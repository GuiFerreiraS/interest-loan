import {
  Button,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const data = {
    loans: await db.loan.findMany(),
  };

  return json(data);
};

export default function Loans() {
  const data = useLoaderData<typeof loader>();

  return (
    <Grid
      h="100vh"
      templateRows="repeat(24, 1fr)"
      templateColumns="repeat(12, 1fr)"
      gap={4}
    >
      <GridItem p={5} rowSpan={24} colSpan={3} bg="brand.600">
        <VStack spacing={4} align="stretch">
          <Button as={Link} to="new">
            Novo empréstimo
          </Button>

          {data?.loans.map((loan) => (
            <NavLink key={loan.id} to={loan.id}>
              <Heading size={"md"}>{loan.borrowerName}</Heading>
              <Text fontSize={14}>{loan.description}</Text>
            </NavLink>
          ))}
        </VStack>
      </GridItem>
      <GridItem overflow="auto" p={8} rowSpan={23} colSpan={9}>
        <Outlet />
      </GridItem>
      <GridItem colSpan={9}>
        <Text>Copyright GFS - Version 0.0.1</Text>
      </GridItem>
    </Grid>
  );
}
