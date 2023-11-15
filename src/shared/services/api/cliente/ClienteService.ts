import { IEndereco } from './../Cep/CepService';
import { Environment } from "../../../environment/Environment";
import { api } from "../axios";

export interface IPersons {
    id: number,
    cpf: string,
    nome: string,
    email: string,
    sexo: string,
    data_de_nascimento: string,
    telefone: string,
    endereco_id?: number,
    endereco: {
      id?: number,
      cep: string,
      logradouro: string,
      complemento?: string,
      bairro: string,
      localidade: string,
      uf: string,
      numero?: string
    }
}
export interface IErrors{
  response:{
    data:{
    errors:string[] | string
    }
  }
  }
interface IDataCount {
  data:IPersons[];
  totalCount:number;
}
 const getAll = async (
  filter = "",
  page = 1
): Promise<IDataCount | Error> => {
  try {
    const urlGetAll = `/clientes?page=${page}&limit=${Environment.LINES_LIMITS}&order=DESC&filter=${filter}`;

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


const getAllByCpf = async (
  filter = "",
  page = 1
): Promise<IDataCount | Error> => {
  try {
    const urlGetAll = `/clientes?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC&filter=${filter}`;

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
const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await api.delete(`/clientes/${id}`);
  } catch (error) {
    return new Error(
      (error as { message: string }).message || "Erro ao deletar o registro"
    );
  }
};

const getById = async (id: number): Promise<IPersons | Error> => {
  try {
    const { data } = await api.get(`/clientes/${id}`);

    if (data) {
      return data;
    }
    return new Error("Erro ao buscar o registro!");
  } catch (error) {
    return new Error(
      (error as { message: string }).message || "Registro não encontrado"
    );
  }
};

const updateById = async (
  id: number,
  person: Omit<IPersons, "id">
): Promise<void | Error> => {


  try {
   const{data}=await api.put(`/clientes/${id}`, person)
      console.log(JSON.stringify(person))
      if (data.hasOwnProperty('errors')) {
       const res=data as IErrors
       return new Error(res.response.data.errors[0])
     } else {
       return data.id;
     }
    } catch (err ) {
      return new Error(err as string)  
    }
   
};

const create= async(person: Omit<IPersons,'id'>):Promise<number | Error> =>{

   return api.post(`/clientes/`, person)
    .then((response) => {
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

export const PersonService = {
  getAll,
  deleteById,
  getById,
  updateById,
  create,
  getAllByCpf
};
