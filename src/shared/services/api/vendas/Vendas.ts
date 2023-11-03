import { Estoque } from '../../../../pages/estoque/Estoque';
import { Environment } from '../../../environment/Environment';
import { api } from '../axios';
import { IErrors, PersonService } from '../cliente';
import { EstoqueService, IEstoques } from '../estoque/EstoqueService';
import { FuncionarioService, IFuncionarios } from '../funcionarios/FuncionariosService';


export interface IProdutosVendas{
    id?:number
    venda_id?:number;
    nome?:string
    estoque?:{
      nome?:string;
    }
    produto_id:number;
    quantidade:number;
    valorUnitario:number;
    valor:number
}
let produtoEstoque:IEstoques[]=[];

export interface IVenda{
    id:number;
    cliente_id: number;
    funcionario_id: number;
    data:string;
    valorTotal:number;
    produtosVendas:IProdutosVendas[]
}



export interface IVendaResult{
    id: number,
    funcionario_id: number,
    cliente_id: number,
    data: string,
    valorTotal: number,
    produtosVendas: IProdutosVendas[],
    cliente: {
      id: number,
      cpf: string,
      nome: string,
      email: string,
      sexo: string,
      data_de_nascimento: string,
      telefone: string,
      endereco_id: number
    },
    funcionario: {
      id: number,
      ra: string,
      nome: string,
      email: string,
      sexo: string,
      data_de_nascimento: string,
      telefone: string,
      endereco_id: number
    }
   totalCount: number
}


interface IDataCount {
  data:IVendaResult[]
  totalCount: number;
}


const create=async(vendas:Omit<IVenda,"id">):Promise<IVenda | Error>=>{
   
   return api.post("/vendas",vendas)
   .then((response) => {
      const data = response.data;
      console.log(data)
      if (data.hasOwnProperty('errors')) {
        const res=data as IErrors
        return new Error(res.response.data.errors[0])
      } else {
        return data.id;
      }
    }).catch((err:IErrors) => {
      return new Error(err.response.data.errors[0])
    });
}

const getById=async(id:number):Promise<IVendaResult | Error>=>{

    try {
        const {data}=await api.get(`/vendas/${id}`)
        
        if(data){
          const indice=data.data.indexOf("T")
          data.data=data.data.substring(0,indice)
            return data 
        }
        return new Error("Venda nao encontrado!")
    } catch (error) {
        return new Error ("Erro ao buscar o venda")
    }
}

const deleteById=async(id:number):Promise<void |Error>=>{
   try {
    await api.delete(`/vendas/${id}`)
   } catch (error) {
    return new Error("Erro ao deletar registro")
   }
}

const updateById=async(id:number,vendas:Omit<IVenda,"id">):Promise<IVenda | Error>=>{
  return api.put(`/vendas/${id}`,vendas).then((response) => {
      const data = response.data;
      console.log(data)
      if (data.hasOwnProperty('errors')) {
        const res=data as IErrors
        return new Error(res.response.data.errors[0])
      } else {
        return data.id;
      }
    }).catch((err:IErrors) => {
      return new Error(err.response.data.errors[0])
    });
}



   const getAll = async (
    filter = "",
    page = 1
  ): Promise<IDataCount | Error> => {
    try {
      const urlGetAll = `/vendas?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC`;
  
      const { data, headers } = await api.get<IDataCount>(urlGetAll);
  
      if (data) {
        return data
      }
  
      return new Error("Erro ao listar os registros!");
    } catch (error) {
      return new Error(
        (error as { message: string }).message || "Dados não encontrados!"
      );
    }
  };


  export const VendasService={
    create,
    updateById,
    deleteById,
    getById,
    getAll
  }