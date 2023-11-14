import { Environment } from "../../../environment/Environment";
import { IEndereco } from "../Cep/CepService";
import { api } from "../axios";
import { IErrors } from "../cliente";

export interface IFuncionarios {
  id: number;
  ra:string;
  nome: string;
  sexo:string;
  endereco_id?:number
  data_de_nascimento:string;
  email: string;
  telefone:string;
  endereco:IEndereco

}

interface IDataCount {

    data: IFuncionarios[];
   
  totalCount:number;
}

 const getAll = async (
  filter = "",
  page = 1
): Promise<IDataCount | Error> => {
  try {
    const urlGetAll = `/funcionarios?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC&filter=${filter}`;

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

const getAllByRa = async (
  filter = "",
  page = 1
): Promise<IDataCount | Error> => {
  try {
    const urlGetAll = `/funcionarios?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC&filter=${filter}`;

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
    await api.delete(`/funcionarios/${id}`);
  } catch (error) {
    return new Error(
      (error as { message: string }).message || "Erro ao deletar o registro"
    );
  }
};

const getById = async (id: number): Promise<IFuncionarios | Error> => {
  try {
    const { data } = await api.get(`/funcionarios/${id}`);

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
  data: Omit<IFuncionarios, "id">
): Promise<void | Error> => {

    return api.put(`/funcionarios/${id}`, data).then((response) => {
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
};

const create= async(person: Omit<IFuncionarios,'id'>):Promise<number | Error> =>{


  return api.post(`/funcionarios/`,person).then((response) => {
    const data = response.data;
    console.log(data)
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

export const FuncionarioService = {
  getAll,
  deleteById,
  getById,
  updateById,
  create,
  getAllByRa
};
