import { count } from 'console';
import { api } from "../axios";
import { FuncionarioService } from "../funcionarios/FuncionariosService";
import { Environment } from '../../../environment/Environment';


export interface ILogin{
    id_funcionario:number;
    login:string;
    senha:string;
}
interface IDataCount{
    data:ILogin[],
    totalCount:number
}
const create=async(login:ILogin):Promise<ILogin | Error>=>{
    try {
        const func=FuncionarioService.getById(login.id_funcionario);
        if(func instanceof Error){
            return new Error("funcionario nao encontrado");

        }
            const cadastradoFunc=await getByFuncId(login.id_funcionario);
            if(cadastradoFunc instanceof Error){
                const {data}=await api.post(`/login`,login);
                if(data){
                    return data;
                }
            }
                return new Error("funcionario ja possui login!")
            
        
    } catch (error) {
        return new Error("Houve erro ao criar login!");
    }
}

const getByFuncId=async(id:number):Promise<ILogin | Error>=>{

    try {
        const { data }=await api.get(`login/${id}`);

        if(data){
            return data

        }

return new Error("usuario nao encontrado")    } 
catch (error) {
    return new Error("erro ao buscar usuario") 
    } 
}


const updateById=async(login:ILogin):Promise<ILogin | Error>=>{
    try {
        const func=FuncionarioService.getById(login.id_funcionario);
        if(func instanceof Error){
            return new Error("funcionario nao encontrado");

        }
                const {data}=await api.put(`/login`,login);
                if(data){
                    return data;
                }
            
                return new Error("Erro ao atualizar registro!")
            
        
    } catch (error) {
        return new Error("Erro ao atualizar registro!");
    }
}

const deleteById=async(id_func:number):Promise<void|Error>=>{
    try {
        await api.delete(`/login/${id_func}`);
    } catch (error) {
        return new Error("erro ao deletar login!")
    }
}

const getAll = async (
    filter = "",
    page = 1
  ): Promise<IDataCount | Error> => {
    try {
      const urlGetAll = `/login?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC&filter=${filter}`;
  
      const { data, headers } = await api.get(urlGetAll);
  
      if (data) {
        return {
          data,
          totalCount: Number(
            headers["x-total-count"] || Environment.LINES_LIMITS
          ),
        };
      }
  
      return new Error("Erro ao listar os registros!");
    } catch (error) {
      return new Error(
        (error as { message: string }).message || "Dados não encontrados!"
      );
    }
  };
  
export const LoginService={
    create,
    updateById,
    getByFuncId,
    deleteById,
    getAll
}