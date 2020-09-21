import { cpf, cnpj } from "cpf-cnpj-validator";

export const isValidCpf = (value: string, helpers: any) => {
  if (cpf.isValid(value)) return value;
  return helpers.error("any.invalid");
};

export const isValidCnpj = (value: string, helpers: any) => {
  if (cnpj.isValid(value)) return value;
  return helpers.error("any.invalid");
};
