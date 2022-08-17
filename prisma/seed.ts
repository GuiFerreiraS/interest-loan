import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getLoans().map((loan) => {
      return db.loan.create({ data: loan });
    })
  );
}

seed();

function getLoans() {
  return [
    {
      description: "Empréstimo feito para João comprar um carro",
      borrowerName: "João",
      monthlyInterest: 1,
      borrowedAmount: 10000,
      combinedInstallmentValue: 1000,
    },
    {
      description: "Empréstimo feito para Maria reformar a casa",
      borrowerName: "Maria",
      monthlyInterest: 1.5,
      borrowedAmount: 40000,
      combinedInstallmentValue: 1600,
    },
  ];
}
