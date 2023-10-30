import { Environment } from "../../../environment/Environment";
import { api } from "../axios";

export interface IServices{
    id:number;
    nome:string;
    valor:number;
}
interface IDataCount {
  
    data: IServices[];
   
  totalCount:number;
}

const create=async(services:Omit<IServices,"id">):Promise<IServices | Error>=>{

    try {
        const {data}=await api.post("/servicos",services);
        if(data){
            return data
        }
        return new Error("Erro ao registrar o servico!")
    } catch (error) {
        return new Error ("Erro ao registrar o servico")
    }
}

const updateById=async(id:number,service:IServices):Promise<IServices | Error>=>{
    try {
        const {data}=await api.put(`/servicos/${id}`,service);
        if(data){
            return data
        }
        return new Error("Erro ao atualizar o servico!")
    } catch (error) {
        return new Error ("Erro ao atualizar o servico")
    }
}

const deleteById=async(id:number):Promise<void |Error>=>{
    try {
        await api.delete(`/servicos/${id}`)
        return new Error("Erro ao deletar o servico!")
    } catch (error) {
        return new Error("Erro ao deletar o servico")
    }
}
const getById=async(id:number):Promise<IServices | Error>=>{

    try {
        const {data}=await api.get(`/servicos/${id}`)
        
        if(data){
            return data
        }
        return new Error("Servico nao encontrado!")
    } catch (error) {
        return new Error ("Erro ao buscar o servico")
    }
}


   const getAll = async (
    filter = "",
    page = 1
  ): Promise<IDataCount | Error> => {
    try {
      const urlGetAll = `/servicos?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC&filter=${filter}`;
  
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


  export const ServicosService={
    create,
    updateById,
    deleteById,
    getById,
    getAll
  }