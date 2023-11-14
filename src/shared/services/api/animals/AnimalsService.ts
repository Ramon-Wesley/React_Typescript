import { api } from "../axios";
import { Environment } from "../../../environment/Environment";
import { IPersons, PersonService } from "../cliente";
import { IRacas, RacaService } from "../raca/RacasService";

export interface IAnimals{
    id:number;
    cliente?:{
    id?:number,
    nome?:string,
    cpf?:string
    }
    cliente_id:number,
    nome:string;
    data_de_nascimento:String;
    peso:String;
}
interface IDataCount {
    data:IAnimals[];
    totalCount: number;
  }


const create =async(animais:Omit<IAnimals,"id">):Promise<IAnimals | Error>=>{
    try {
       
            const resultClient=await PersonService.getById(animais.cliente_id);
            if(resultClient instanceof Error){
                return new Error("cliente nao encontrado!") 
            }
            const {data}=await api.post("/animais/",animais);
            if(data){
                return data;
            }
        

        return new Error("Erro ao criar animais")
    } catch (error) {
        return new Error("Eroo ao criar a animais: ");
    }
}

const updateById =async(id:number,animais:Omit<IAnimals,"id">):Promise<IAnimals | Error>=>{
    try {
       
            const resultClient=await PersonService.getById(animais.cliente_id);
            if(resultClient instanceof Error){
                return new Error("cliente nao encontrado!") 
            }
            const {data}=await api.put(`/animais/${id}`,animais);
            
            if(data){
                return data;
            }
        
        return new Error("Erro ao atualizar a animais")
    } catch (error) {
        return new Error("Erro ao atualizar a animais: ");
    }
}

const getAll=async(filter="",page=1,limit=5):Promise<IDataCount|Error>=>{
    try {
        const urlGetAll = `/animais?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC&filter=${filter}`;
        const {data,headers}=await api.get(urlGetAll);

        if (data) {return  data as IDataCount}    
            
        return new Error("Erro ao listar as especies")
    } catch (error) {
        return new Error("Erro ao listar as especies")
    }
}
const getAllByIdCliente=async(idCliente:number,filter="",limit=5,page=1):Promise<IDataCount|Error>=>{
    try {
        const urlGetAll = `animais/cliente/${idCliente}`;
        const {data,headers}=await api.get(urlGetAll);

     
        if (data) {
            return data as IDataCount
          }
        return new Error("Erro ao listar as especies")
    } catch (error) {
        return new Error("Erro ao listar as especies")
    }
}

const getById=async(id:number):Promise<IAnimals | Error>=>{
 
    try {
        const {data}=await api.get(`/animais/${id}`);
        if(data){
            return data
        }

        return new Error("Registro nao encontrado!")
    } catch (error) {
        return new Error("Erro ao encontrar o registro")
    }
}

const deleteById=async(id:number):Promise<void | Error>=>{
 
    try {
        await api.delete(`/animais/${id}`);
    } catch (error) {
        return new Error("Erro ao encontrar o registro")
    }
}


export const animalService={
    create,
    deleteById,
    updateById,
    getAll,
    getById,
    getAllByIdCliente
}