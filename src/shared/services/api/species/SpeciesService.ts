import { count } from "console";
import { Environment } from "../../../environment/Environment";
import { api } from "../axios";

export interface ISpecies{
    id:number;
    nome:string;
}
export interface ISpeciesAll{
    data:ISpecies[];
    totalCount:number;
}

const create =async(specie:Omit<ISpecies,"id">):Promise<ISpecies | Error>=>{
    try {
        const {data}=await api.post("/especies/",specie);

        if(data){
            return data;
        }
        return new Error("Erro ao criar especies")
    } catch (error) {
        return new Error("Eroo ao criar a especies: ");
    }
}

const updateById =async(id:number,specie:Omit<ISpecies,"id">):Promise<ISpecies | Error>=>{
    try {
        const {data}=await api.put(`/especies/${id}`,specie);

        if(data){
            return data;
        }
        return new Error("Erro ao atualizar a especies")
    } catch (error) {
        return new Error("Erro ao atualizar a especies: ");
    }
}

const getAll=async(filter="",limit=5,page=1):Promise<ISpeciesAll|Error>=>{
    try {
        const urlGetAll = `/especies?_page=${page}&_limit=${Environment.LINES_LIMITS}&_order=desc&nome_like=${filter}`;

        const {data,headers}=await api.get(urlGetAll);

        if (data) {
            return {
              data,
              totalCount: Number(
                headers["x-total-count"] || Environment.LINES_LIMITS
              ),
            };
          }
        return new Error("Erro ao listar as especiess")
    } catch (error) {
        return new Error("Erro ao listar as especiess")
    }
}

const getById=async(id:number):Promise<ISpecies | Error>=>{
 
    try {
        const {data}=await api.get(`/especies/${id}`);
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
        await api.delete(`/especies/${id}`);
    } catch (error) {
        return new Error("Erro ao encontrar o registro")
    }
}

export const SpecieService={
    create,
    updateById,
    deleteById,
    getById,
    getAll
}