import { count } from "console";

import { api } from "../axios";
import { ISpecies, SpecieService } from "../species/SpeciesService";
import { Environment } from "../../../environment/Environment";

export interface IRacas{
    racaId:number;
    nome:string;
    especie:{
        especieId:number;
        nome:string
    };
}
interface IRacasAll{
    data:IRacas[];
    totalCount:number;
}

const create =async(racass:Omit<IRacas,"id">):Promise<IRacas | Error>=>{
    try {
        const result =await SpecieService.getById(racass.especie.especieId);
        if(result instanceof Error){
           return new Error("especie nao encontrada!") 
        }else{
            const {data}=await api.post("/racas/",racass);
            if(data){
                return data;
            }
        }

        return new Error("Erro ao criar racas")
    } catch (error) {
        return new Error("Eroo ao criar a racas: ");
    }
}

const updateById =async(id:number,racass:Omit<IRacas,"id">):Promise<IRacas | Error>=>{
    try {
        const result =await SpecieService.getById(racass.especie.especieId);
        if(result instanceof Error){
           return new Error("especie nao encontrada!") 
        }else{
            const {data}=await api.put(`/racas/${id}`,racass);
            
            if(data){
                return data;
            }
        }
        return new Error("Erro ao atualizar a racas")
    } catch (error) {
        return new Error("Erro ao atualizar a racas: ");
    }
}
const getByName=async(filter:string):Promise<IRacas | Error>=>{
 
    try {
        const {data}=await api.get(`/racas?nome=${filter}`);
        if(data){
            return data
        }

        return new Error("Registro nao encontrado!")
    } catch (error) {
        return new Error("Erro ao encontrar o registro")
    }
}
const getAll=async(filter="",limit=5,page=1):Promise<IRacasAll|Error>=>{
    try {
        const urlGetAll = `/racas?_page=${page}&_limit=${Environment.LINES_LIMITS}&_order=desc&nome_like=${filter}`;

        const {data,headers}=await api.get(urlGetAll);

        if (data) {
            return {
              data,
              totalCount: Number(
                headers["x-total-count"] || Environment.LINES_LIMITS
              ),
            };
          }
        return new Error("Erro ao listar as especies")
    } catch (error) {
        return new Error("Erro ao listar as especies")
    }
}

const getById=async(id:number):Promise<IRacas | Error>=>{
 
    try {
        const {data}=await api.get(`/racas?racaId=${id}`);
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
        await api.delete(`/racas/${id}`);
    } catch (error) {
        return new Error("Erro ao encontrar o registro")
    }
}


export const RacaService={
    create,
    deleteById,
    updateById,
    getAll,
    getById,
    getByName
}