import { Environment } from "../../../environment/Environment";
import { api } from "../axios";

export interface IServicos{
    id:number;
    nome:string
    valor:number;
}
interface IData{
  data: IServicos[];
}
interface IDataCount {
  data: IServicos[];
  totalCount: number;
}

const create=async(servicos:Omit<IServicos,"id">):Promise<IServicos | Error>=>{

    try {
      
            const {data}=await api.post("/servicos",servicos);
            if(data){
                return data
            }
      
        return new Error("Erro ao registrar o servico!")
    } catch (error) {
        return new Error ("Erro ao registrar o servico")
    }
}

const updateById=async(id:number,servico:Omit<IServicos,"id">):Promise<IServicos | Error>=>{
    try {  
            const {data}=await api.put(`/servicos/${id}`,servico);
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
const getById=async(id:number):Promise<IServicos | Error>=>{

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

const verificarServico = async (
    page = 1
): Promise<IDataCount | Error> => {
    try {
      const urlGetAll = `/servicos?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC`;
  
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

  export const ServicoService={
    create,
    updateById,
    deleteById,
    getById,
    getAll,
    getAllByIds
  }