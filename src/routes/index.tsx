import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { PersonDetail } from "../pages/person";
import { People } from "../pages/person/Person";
import { useDrawerContext } from "../shared/context";
import { AnimalDetail } from "../pages/animals/AnimalsDetail";
import { Animais } from "../pages/animals/Animals";
import { Funcionario, FuncionarioDetail } from "../pages/funcionarios";
import { Fornecedor, FornecedorDetail } from "../pages/fornecedores";
import { Agendamentos } from "../pages/agendamento/Agendamentos";
import { AgendamentoDetail } from "../pages/agendamento/AgendamentoDetail";
import { Estoque, EstoqueDetail } from "../pages/estoque";
import { Compras } from "../pages/compra/Compra";
import { ComprasDetail } from "../pages/compra/CompraDetail";
import { Servico, ServicoDetail } from "../pages/servico";
import { Vendas } from "../pages/venda/Venda";
import { VendasDetail } from "../pages/venda/VendaDetail";
import { Relatorio } from "../pages/relatorio/Relatorio";

export const AppRoutes = () => {
  const { handleOptions } = useDrawerContext();

  useEffect(() => {
    handleOptions([
     
      {
        icon: "person2",
        label: "Clientes",
        path: "/pessoas",
      },
     
      {
        icon: "person3",
        label: "Funcionarios",
        path: "/funcionarios",
      },
      {
        icon: "people",
        label: "Fornecedores",
        path: "/fornecedores",
      },
     
      {
        icon: "inventory",
        label: "Estoque",
        path: "/estoques",
      },
       {
        icon: "shopping",
        label: "Compras",
        path: "/compras",
      },
       {
        icon: "shopping_car_rounded_icon",
        label: "Vendas",
        path: "/vendas",
      },
      {
        icon: "file_open",
        label: "Relatorios",
        path: "/relatorios",
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/pessoas" element={<People />} />
      <Route path="/fornecedores" element={<Fornecedor />} />
      <Route path="/compras" element={<Compras />} />
      <Route path="/agendamentos" element={<Agendamentos />} />
      <Route path="/estoques" element={<Estoque />} />
      <Route path="/funcionarios" element={<Funcionario />} />    
      <Route path="/pessoas/detalhe/:id" element={<PersonDetail />} />
      <Route path="/agendamentos/detalhe/:id" element={<AgendamentoDetail />} />
      <Route path="/compras/detalhe/:id" element={<ComprasDetail />} />
      <Route path="/estoques/detalhe/:id" element={<EstoqueDetail />} />
      <Route path="/fornecedores/detalhe/:id" element={<FornecedorDetail />} />
      <Route path="/funcionarios/detalhe/:id" element={<FuncionarioDetail />} />
      <Route path='*' element={<Navigate to='/pessoas'/>}/>
      <Route path="/animais/detalhe/:id" element={<AnimalDetail/>}/>
      <Route path="/animais" element={<Animais/>}/>
      <Route path="/servicos" element={<Servico/>}/>
      <Route path="/servicos/detalhe/:id" element={<ServicoDetail/>} />
      <Route path="/vendas" element={<Vendas/>}/>
      <Route path="/relatorios" element={<Relatorio/>}/>
      <Route path="/vendas/detalhe/:id" element={<VendasDetail/>} />
    </Routes>
  );
};
