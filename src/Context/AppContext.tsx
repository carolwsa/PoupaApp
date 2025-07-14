/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { ITransacoes, IUsuario } from "../Types";
import { getTransacoes, getUsuarios, postTransacao, postUsuario } from "../API";

interface AppContextProps {
  usuario: IUsuario | null;
  criarUsuario: (
    usuario: Omit<IUsuario, "id" | "orcamentoDiario">
  ) => Promise<void>;
  transacoes: ITransacoes[];
  criaTransacao: (
    novaTransacao: Omit<ITransacoes, "id" | "userId">
  ) => Promise<void>;
}
const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [transacoes, setTransacoes] = useState<ITransacoes[]>([]);

  const carregaDados = async () => {
    try {
      const usuarios = await getUsuarios();
      const pegaTransacoes = await getTransacoes();
      if (usuarios && usuarios.length > 0) {
        setUsuario(usuarios[0]);
        setTransacoes(pegaTransacoes);
      } else {
        setUsuario(null);
      }
    } catch (error) {
      alert("Erro ao carregar os dados do usuário.");
      console.log(error);
    }
  };

  const criarUsuario = async (
    usuario: Omit<IUsuario, "id" | "orcamentoDiario">
  ) => {
    try {
      const novoUsuario = await postUsuario(usuario);
      setUsuario(novoUsuario);
    } catch (erro) {
      alert("Erro ao criar o usuário.");
      console.log(erro);
    }
  };

  const criaTransacao = async (
    novaTransacao: Omit<ITransacoes, "id" | "userId">
  ) => {
    try {
      if (!usuario) {
        throw new Error("Não podemos criar transacões sem um usuario criado!");
      }
      const { transacao, novoOrcamentoDiario } = await postTransacao(
        novaTransacao,
        usuario
      );
      setTransacoes((prev) => [...prev, transacao]);
      setUsuario((prev) =>
        prev ? { ...prev, orcamentoDiario: novoOrcamentoDiario } : null
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    carregaDados();
  });

  return (
    <AppContext.Provider
      value={{ usuario, criarUsuario, transacoes, criaTransacao }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext deve ser usado dentro de um Provider");
  }
  return context;
};
