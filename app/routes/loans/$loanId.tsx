import { Box, Flex, Heading } from "@chakra-ui/react";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { useLoaderData } from "@remix-run/react";
import { toBRL } from "~/utils/functions";

export const loader = async ({ params }: LoaderArgs) => {
  const loanId = params.loanId;
  const loan = await db.loan.findUnique({ where: { id: loanId } });

  if (!loan) {
    return redirect("/loans");
  }

  return json({ loan });
};

export default function NewJokeRoute() {
  const { loan } = useLoaderData<typeof loader>();

  return (
    <Box>
      <Heading size="lg">{loan.description}</Heading>
      <Flex justifyContent="space-between">
        <Heading size="lg">Juros: {loan.monthlyInterest}% ao mês</Heading>
        <Heading size="lg">
          Empréstimo total: {toBRL(loan.borrowedAmount)}
        </Heading>
      </Flex>
    </Box>
  );
}
