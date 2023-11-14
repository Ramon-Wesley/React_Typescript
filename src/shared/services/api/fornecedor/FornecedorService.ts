import { Environment } from "../../../environment/Environment";
import { IEndereco } from "../Cep/CepService";
import { api } from "../axios";
import { IErrors } from "../cliente";

export interface IFornecedores {
  id: number;
  nome: string;
  cnpj:string;
  sexo:string;
  endereco_id?:number;
  data_de_nascimento:string;
  email: string;
  telefone:string;
  endereco:IEndereco
}
interface IDataCount {
  
    data: IFornecedores[];
   
  totalCount: number;
}

 const getAll = async (
  filter = "",
  page = 1
): Promise<IDataCount | Error> => {
  try {
    const urlGetAll = `/fornecedores?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC&filter=${filter}`;

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

const getAllByCnpj = async (
  filter = "",
  page = 1
): Promise<IDataCount | Error> => {
  try {
    const urlGetAll = `/fornecedores?page=${page}&limit=${Environment.LINES_LIMITS}&orderBy=DESC&filter=${filter}`;

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
    await api.delete(`/fornecedores/${id}`);
  } catch (error) {
    return new Error(
      (error as { message: string }).message || "Erro ao deletar o registro"
    );
  }
};

const getById = async (id: number): Promise<IFornecedores | Error> => {
  try {
    const { data } = await api.get(`/fornecedores/${id}`);

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
  data: Omit<IFornecedores, "id">
): Promise<void | Error> => {
 
    return api.put(`/fornecedores/${id}`, data)
    .then((response) => {
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
};

const create= async(person: Omit<IFornecedores,'id'>):Promise<number | Error> =>{

  return api.post(`/fornecedores/`,person)
  .then((response) => {
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

export const FornecedorService = {
  getAll,
  deleteById,
  getById,
  updateById,
  create,
  getAllByCnpj
};
