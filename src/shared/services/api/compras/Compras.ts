import { Estoque } from './../../../../pages/estoque/Estoque';
import { Fornecedor } from './../../../../pages/fornecedores/Fornecedores';
import { Environment } from '../../../environment/Environment';
import { api } from '../axios';
import { IErrors, PersonService } from '../cliente';
import { EstoqueService, IEstoques } from '../estoque/EstoqueService';
import { FornecedorService, IFornecedores } from '../fornecedor/FornecedorService';
import { FuncionarioService, IFuncionarios } from '../funcionarios/FuncionariosService';


export interface IProdutosCompras{
    id?:number
    compra_id?:number;
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

export interface Errors{
errors:[]
}

export interface ICompra{
    id:number;
    fornecedor_id: number;
    funcionario_id: number;
    data:string;
    valorTotal:number;
    produtosCompras:IProdutosCompras[]
}

export interface ICompraResult{
    id: number,
    funcionario_id: number,
    fornecedor_id: number,
    data: string,
    valorTotal: number,
    produtosCompras:IProdutosCompras[],
    fornecedor: {
      id: number,
      cnpj: string,
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

}

interface IDataCount {
  data:ICompraResult[]
  totalCount:number;
}


const create=async(compras:Omit<ICompra,"id">):Promise<ICompra | Error>=>{
   
  
    return api.post("/compras",compras).then((response) => {
      const data = response.data;
     
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

const getById=async(id:number):Promise<ICompraResult | Error>=>{

    try {
    
    const {data,status}= await  api.get<ICompraResult>(`/compras/${id}`)
    
    if(data){
      const indice=data.data.indexOf("T")
      data.data=data.data.substring(0,indice)
      return data
    }
  
      return new Error ("Erro ao buscar o compra"+status)
    } catch (error) {
        return new Error ("Erro ao buscar o compra"+error)
    }
}

const deleteById=async(id:number):Promise<void |Error>=>{
   try {
    await api.delete(`/compras/${id}`)
   } catch (error) {
    return new Error("Erro ao deletar registro")
   }
}


const updateById=async(id:number,compras:Omit<ICompra,"id">,valorAnterior:number[]):Promise<ICompra | Error>=>{

return api.put(`/compras/${id}`,compras).then((response) => {
      const data = response.data;
     
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
      const urlGetAll = `/compras?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC&filter=${filter}`;
  
      const { data, headers } = await api.get<IDataCount>(urlGetAll);
  
      if (data) {
       
        return data
  };
      
  
      return new Error("Erro ao listar os registros!");
    } catch (error) {
      return new Error(
        (error as { message: string }).message || "Dados não encontrados!"
      );
    }
  };


  export const ComprasService={
    create,
    updateById,
    deleteById,
    getById,
    getAll
  }