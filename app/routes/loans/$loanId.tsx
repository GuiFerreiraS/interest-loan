import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ActionArgs, json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { Form, useLoaderData } from "@remix-run/react";
import { toBRL } from "~/utils/functions";
import { Loan } from "@prisma/client";

export const loader = async ({ params }: LoaderArgs) => {
  const loanId = params.loanId;
  const loan = await db.loan.findUnique({
    where: { id: loanId },
    include: { payments: true },
  });

  if (!loan) {
    return redirect("/loans");
  }

  const tableContent: {
    day: Date;
    expectedInstallment: number;
    payedValue?: number;
  }[] = [];

  let aux = loan.borrowedAmount.toNumber();
  const createdAt = new Date(loan.createdAt.valueOf());

  while (aux > 0) {
    const day = new Date(createdAt.setMonth(createdAt.getMonth()));
    const monthBefore = new Date(day.valueOf());
    monthBefore.setMonth(day.getMonth() - 1);

    const payedValue = loan.payments
      .filter(
        (payment) => payment.createdAt > monthBefore && payment.createdAt < day
      )
      .reduce((sum, curr) => sum + curr.value.toNumber(), 0);

    const interest = loan.monthlyInterest.toNumber() / 100;
    const combinedInstallmentValue = loan.combinedInstallmentValue.toNumber();

    const expectedInstallment =
      aux < combinedInstallmentValue
        ? aux + aux * interest
        : combinedInstallmentValue;

    tableContent.push({ day, expectedInstallment, payedValue });

    createdAt.setMonth(createdAt.getMonth() + 1);
    aux = aux + aux * interest - combinedInstallmentValue;
  }

  return json({ loan, tableContent });
};

export const action = async ({ request, params }: ActionArgs) => {
  const loan = await db.loan.findUnique({
    where: { id: params.loanId },
  });
  if (loan && request.method === "DELETE") {
    await db.loan.delete({ where: { id: params.loanId } });
    return redirect("/loans");
  }
  if (request.method === "POST" && params.loanId) {
    const newPayment = (await await request.formData())
      .get("newPayment")!
      .toString();
    await db.payment.create({
      data: { loanId: params.loanId!, value: newPayment },
    });
    return redirect(`/loans/${params.loanId}`);
  }
  return redirect(`/loans/${params.loanId}`);
};

export default function NewJokeRoute() {
  const { loan, tableContent } = useLoaderData<typeof loader>();

  const handleDelete = () => {
    fetch("", { method: "DELETE" });
  };

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading size="lg">{loan.description}</Heading>
        {loan.createdAt.toString()}
        <Button variant="outline" colorScheme="red" onClick={handleDelete}>
          Excluir
        </Button>
      </Flex>
      <Flex justifyContent="space-between">
        <Heading size="lg">Juros: {loan.monthlyInterest}% ao mês</Heading>
        <Heading size="lg">
          Empréstimo total: {toBRL(loan.borrowedAmount)}
        </Heading>
      </Flex>
      <Form method="post">
        <Flex marginTop={10} gap={4} direction="row">
          <NumberInput width={400} precision={2} min={0}>
            <NumberInputField
              borderColor="blackAlpha.800"
              _hover={{ borderColor: "blackAlpha.700" }}
              name="newPayment"
            />
          </NumberInput>
          <Button type={"submit"} paddingX={5}>
            Adicionar pagamento
          </Button>
        </Flex>
      </Form>
      <TableContainer marginTop={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Mês e dia</Th>
              <Th isNumeric>Valor previsto</Th>
              <Th isNumeric>Valor pago</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableContent.map((content) => (
              <Tr key={content.day}>
                <Td>{new Date(content.day).toLocaleDateString("pt-BR")}</Td>
                <Td isNumeric>{toBRL(content.expectedInstallment)}</Td>
                <Td isNumeric>{toBRL(content.payedValue)}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th></Th>
              <Th isNumeric>
                Total:{" "}
                {toBRL(
                  tableContent.reduce(
                    (sum, curr) => sum + curr.expectedInstallment,
                    0
                  )
                )}
              </Th>
              <Th isNumeric>
                Total pago:{" "}
                {toBRL(
                  tableContent.reduce(
                    (sum, curr) => sum + (curr.payedValue ?? 0),
                    0
                  )
                )}
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
}
