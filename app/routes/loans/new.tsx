import { Form } from "@remix-run/react";
import { ActionArgs, redirect } from "@remix-run/node";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from "@chakra-ui/react";
import { db } from "~/utils/db.server";

export const action = async ({ request }: ActionArgs) => {
  const form = await await request.formData();

  const newLoan = {
    description: form.get("description")!.toString(),
    borrowerName: form.get("borrowerName")!.toString(),
    borrowedAmount: +form.get("borrowedAmount")!.toString(),
    combinedInstallmentValue: +form.get("combinedInstallmentValue")!.toString(),
    monthlyInterest: +form.get("monthlyInterest")!.toString(),
  };

  const response = await db.loan.create({ data: newLoan });

  return redirect(`/loans/${response.id}`);
};

export default function NewJokeRoute() {
  return (
    <Box maxWidth={500}>
      <Heading size="lg" as="h1" mb={8}>
        Cadastrar novo empréstimo
      </Heading>
      <Form method="post">
        <VStack spacing="24px">
          <FormControl>
            <FormLabel>Descrição</FormLabel>
            <Input
              borderColor="blackAlpha.800"
              _hover={{ borderColor: "blackAlpha.700" }}
              name="description"
            />
          </FormControl>
          <Flex gap={3} w="100%">
            <FormControl>
              <FormLabel>Mutuário</FormLabel>
              <Input
                borderColor="blackAlpha.800"
                _hover={{ borderColor: "blackAlpha.700" }}
                name="borrowerName"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Valor do empréstimo</FormLabel>
              <NumberInput precision={2} min={0}>
                <NumberInputField
                  borderColor="blackAlpha.800"
                  _hover={{ borderColor: "blackAlpha.700" }}
                  name="borrowedAmount"
                />
              </NumberInput>
            </FormControl>
          </Flex>
          <Flex gap={3} w="100%">
            <FormControl flex={1}>
              <FormLabel>{"Prestação (projeção)"}</FormLabel>
              <NumberInput precision={2} min={0}>
                <NumberInputField
                  borderColor="blackAlpha.800"
                  _hover={{ borderColor: "blackAlpha.700" }}
                  name="combinedInstallmentValue"
                />
              </NumberInput>
            </FormControl>
            <FormControl flex={1}>
              <FormLabel>Taxa de juros por mês</FormLabel>
              <NumberInput precision={2} step={0.1} min={0} max={100}>
                <NumberInputField
                  borderColor="blackAlpha.800"
                  _hover={{ borderColor: "blackAlpha.700" }}
                  name="monthlyInterest"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Flex>
          <Button
            w="100%"
            type="submit"
            className="button"
            color={"blue.300"}
            bgColor={"blackAlpha.800"}
            _hover={{ bgColor: "blackAlpha.700" }}
            _active={{ bgColor: "blackAlpha.600" }}
          >
            Add
          </Button>
        </VStack>
      </Form>
    </Box>
  );
}
