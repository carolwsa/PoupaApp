import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  grid-template-rows: auto auto auto 1fr;
  gap: var(--gap-s);
  min-width: 1260px;
  max-width: 100%;
  margin: 32px 0;
  box-sizing: border-box;

  grid-template-areas:
    "sidebar search search"
    "sidebar usuario usuario"
    "sidebar orcamento transacoes"
    "sidebar movimentacoes transacoes";
`;

export const Orcamento = styled.section`
  grid-area: orcamento;
  display: flex;
  justify-content: space-between;
  gap: var(--gap-l);
  max-width: 100%;
`;

export const Movimentacoes = styled.section`
  grid-area: movimentacoes;
  display: flex;
  gap: var(--gap-l);
  max-width: 100%;
`;

export const TransacoesWrapper = styled.section`
  grid-area: transacoes;
  display: flex;
  flex-direction: column;
  gap: var(--gap-l);
  max-width: 100%;
`;
