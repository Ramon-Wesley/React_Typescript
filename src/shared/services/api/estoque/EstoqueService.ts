import { Environment } from "../../../environment/Environment";
import { api } from "../axios";

export interface IEstoques{
    id:number;
    nome:string
    estoqueAbaixo:number;
    quantidade:number;
    valor:number;
}
interface IData{
  data: IEstoques[];
}
interface IDataCount {
  data: IEstoques[];
  totalCount:number;
}

const create=async(estoques:Omit<IEstoques,"id">):Promise<IEstoques | Error>=>{

    try {
      
            const {data}=await api.post("/estoques",estoques);
            if(data){
                return data
            }
      
        return new Error("Erro ao registrar o estoque!")
    } catch (error) {
        return new Error ("Erro ao registrar o estoque"+error)
    }
}

const updateById=async(id:number,estoque:Omit<IEstoques,"id">):Promise<IEstoques | Error>=>{
    try {  
            const {data}=await api.put(`/estoques/${id}`,estoque);
            if(data){
                return data
            }
        
        
        return new Error("Erro ao atualizar o estoque!")
    } catch (error) {
        return new Error ("Erro ao atualizar o estoque"+error)
    }
}

const deleteById=async(id:number):Promise<void |Error>=>{
    try {
        await api.delete(`/estoques/${id}`)
       
    } catch (error) {
        return new Error("Erro ao deletar o estoque")
    }
}
const getById=async(id:number):Promise<IEstoques | Error>=>{

    try {
        const {data}=await api.get(`/estoques/${id}`)
        
        if(data){
            return data
        }
        return new Error("Servico nao encontrado!")
    } catch (error) {
        return new Error ("Erro ao buscar o estoque")
    }
}

const verificarEstoque = async (
    page = 1
): Promise<IDataCount | Error> => {
    try {
      const urlGetAll = `/estoques?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC`;
  
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
   const getAll = async (
    filter = "",
    page = 1
  ): Promise<IDataCount | Error> => {
    try {
      const urlGetAll = `/estoques?page=${page}&limit=${Environment.LINES_LIMITS}&order=DESC&filter=${filter}`;
  
      const { data, headers } = await api.get<IDataCount>(urlGetAll);
      console.log(data)
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

  const modificarQuantidade=async(id:number,quantidade:number):Promise<IEstoques | Error>=>{
    try {
      if(quantidade >= 0){

        let result=await getById(id);
        if(result instanceof Error){
          return result
        }else{
        result.quantidade=quantidade;
        const data=await updateById(id,result);
        if(data instanceof Error){
          return data
        }else{
          return data;
        }
      }
      }else{
        return new Error("Quantidade nao pode ser menor que zero!")
      }
    } catch (error) {
      return new Error("Erro ao modificar o estoque")
    }
  }

  const getAllByIds= async(ids:number[]):Promise<IDataCount | Error>=>{
    try {

        const {data,headers}=await api.post<IDataCount>(`/compras/ids`,ids)
       
    if (data) {
      return data
    }
        return new Error("Venda nao encontrado!")
    } catch (error) {
        return new Error ("Erro ao buscar o compra")
    }
}

  export const EstoqueService={
    create,
    updateById,
    deleteById,
    getById,
    getAll,
    verificarEstoque,
    modificarQuantidade,
    getAllByIds
  }