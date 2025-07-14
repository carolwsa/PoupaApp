import axios from "axios";
import { ITransacoes, IUsuario } from "../Types";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const getUsuarios = async (): Promise<IUsuario[]> => {
  const { data } = await API.get<IUsuario[]>("/usuarios");
  return data;
};

export const postUsuario = async (
  //omit permite criar uma nova interface, "eu quero que seja um usuario, mas sem o id"
  usuario: Omit<IUsuario, "id" | "orcamentoDiario">
): Promise<IUsuario> => {
  const usuarioOrcamentoDiario = {
    ...usuario,
    orcamentoDiario: usuario.renda / 30,
  };
  const { data } = await API.post<IUsuario>(
    "/usuarios",
    usuarioOrcamentoDiario
  );
  return data;
};

export const atualizarUsuario = async (
  id: string,
  dados: Partial<{ orcamentoDiario: number }>
): Promise<IUsuario> => {
  const { data } = await API.patch(`/usuarios/${id}`, dados);
  return data;
};

export const getTransacoes = async (): Promise<ITransacoes[]> => {
  const { data } = await API.get<ITransacoes[]>("/transacoes");
  return data;
};

export const postTransacao = async (
  transacao: Omit<ITransacoes, "id" | "userId">,
  usuario: Omit<IUsuario, "nome">
): Promise<{ transacao: ITransacoes; novoOrcamentoDiario: number }> => {
  const transacoesComID = { ...transacao, userID: usuario.id };
  const { data } = await API.post<ITransacoes>("/transacoes", transacoesComID);

  // Busca todas as transações para calcular o saldo
  const transacoesSaldo = await getTransacoes();
  const saldo = calcularSaldo(transacoesSaldo);

  const novoOrcamentoDiario = (Number(usuario.renda) + saldo) / 30;

  await atualizarUsuario(usuario.id, {
    orcamentoDiario: novoOrcamentoDiario,
  }).catch((error) => console.error(error));

  return { transacao: data, novoOrcamentoDiario: novoOrcamentoDiario };
};

const calcularSaldo = (transacoes: ITransacoes[]): number => {
  return transacoes.reduce((total, transacao) => {
    return transacao.tipo === "receita"
      ? total + transacao.valor
      : total - transacao.valor;
  }, 0);
};
