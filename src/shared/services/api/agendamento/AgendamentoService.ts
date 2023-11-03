import { Environment } from "../../../environment/Environment";
import { animalService } from "../animals/AnimalsService";
import { api } from "../axios";
import { PersonService } from "../cliente";
import { FuncionarioService } from "../funcionarios/FuncionariosService";
import { IServices } from "../servicos/ServicesService";

export interface IAgendamento{
    id:number;
    animal_id:number,
    funcionario_id:number,
    servico_id:number,
    cliente_id:number,
    funcionario?:{
      id?:number;
      ra?:string,
      nome?:string
    };
    animal?:{
      id?:number,
      nome?:string
      cliente_id?:number,
       cliente?:{
      id?:number,
      cpf?:string,
      nome?:string
    };
    };
    servico?:{
      id?:number,
      nome?:string;
      valor?:number;
    }
    data:string;

}
interface IDataCount {
  data:IAgendamento[]; 
  totalCount:number;
}



const create=async(agendamento:Omit<IAgendamento,"id">):Promise<IAgendamento | Error>=>{

    try {
        const funcionario =await FuncionarioService.getById(agendamento.funcionario_id)
        if(funcionario instanceof Error){}else{
          const cliente =await PersonService.getById(agendamento.cliente_id)
          if(cliente instanceof Error){}{
            const animal=await animalService.getById(agendamento.animal_id)

            if(animal instanceof Error){}{

              const {data}=await api.post("/agendamentos",agendamento);
              if(data){
                  return data
              }

            }
          }
        }
        return new Error("Erro ao registrar o agendamento!")
    } catch (error) {
        return new Error ("Erro ao registrar o agendamento")
    }
}

const updateById=async(id:number,agendamento:Omit<IAgendamento,"id">):Promise<IAgendamento | Error>=>{
  try {
    const funcionario =await FuncionarioService.getById(agendamento.funcionario_id)
    if(funcionario instanceof Error){}
    else{
      const cliente =await PersonService.getById(agendamento.cliente_id)
      if(cliente instanceof Error){}{
        const animal=await animalService.getById(agendamento.animal_id)

        if(animal instanceof Error){}
        {

          const {data}=await api.put(`/agendamentos/${id}`,agendamento);
          if(data){
              return data
          }

        }
      }
    }
        return new Error("Erro ao atualizar o agendamento!")
    } catch (error) {
        return new Error ("Erro ao atualizar o agendamento")
    }
}

const deleteById=async(id:number):Promise<void |Error>=>{
    try {
        await api.delete(`/agendamentos/${id}`)
        return new Error("Erro ao deletar o agendamento!")
    } catch (error) {
        return new Error("Erro ao deletar o agendamento")
    }
}
const getById=async(id:number):Promise<IAgendamento | Error>=>{

    try {
        const {data}=await api.get<IAgendamento>(`/agendamentos/${id}`)
        console.log(data);
        if(data){
          const indice=data.data.indexOf("T")
          data.data=data.data.substring(0,indice)
            return data 
        }
        return new Error("Servico nao encontrado!")
    } catch (error) {
        return new Error ("Erro ao buscar o agendamento")
    }
}


   const getAll = async (
    filter = "",
    page = 1
  ): Promise<IDataCount | Error> => {
    try {
      const urlGetAll = `/agendamentos?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC&filter=${filter}`;
  
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


  export const AgendamentoService={
    create,
    updateById,
    deleteById,
    getById,
    getAll
  }