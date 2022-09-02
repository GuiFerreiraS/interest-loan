export const toBRL = (value?: number | string) => {
  if (!value) value = 0;

  value = +value;

  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    style: "currency",
    currency: "BRL",
  });
};
