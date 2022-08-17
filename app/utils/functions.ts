export const toBRL = (value: number | string) => {
  value = +value;

  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    style: "currency",
    currency: "BRL",
  });
};
