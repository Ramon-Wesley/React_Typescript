import { Estoque } from './../../../../pages/estoque/Estoque';
import { Fornecedor } from './../../../../pages/fornecedores/Fornecedores';
import { Environment } from '../../../environment/Environment';
import { api } from '../axios';
import { PersonService } from '../cliente';
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
    produtosCompras: [
      {
        compra_id: number,
        produto_id: number,
        quantidade: number,
        valorUnitario: number,
        valor: number
      }
    ],
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
   
   try {
    const {data}=await api.post("/compras",compras)
    if(data){
        return data as ICompra
    }
    return new Error ("Erro ao salvar compra")
   } catch (error) {
    return new Error("Erro ao salvar registro!")
   }
}

const getById=async(id:number):Promise<ICompraResult | Error>=>{

    try {
        const {data}=await api.get(`/compras/${id}`)
        
        if(data){
          const indice=data.data.indexOf("T")
          data.data=data.data.substring(0,indice)
            return data 
        }
        return new Error("Venda nao encontrado!")
    } catch (error) {
        return new Error ("Erro ao buscar o compra")
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
   try {
    const {data}=await api.put(`/compras/${id}`,compras)
    if(data){
        return data as ICompra
    }
    return new Error("Venda nao encontrado!")
   } catch (error) {
    return new Error("Erro ao atualizar registro!")
   }
}



   const getAll = async (
    filter = "",
    page = 1
  ): Promise<IDataCount | Error> => {
    try {
      const urlGetAll = `/compras?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC&filter=${filter}`;
  
      const { data, headers } = await api.get<IDataCount>(urlGetAll);
  
      if (data) {
        console.log("TETETETE"+data)
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