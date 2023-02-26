import { Environment } from "../../../environment/Environment";
import { api } from "../axios";

interface ICities {
  id: number;
  nome: string;
}

interface ICitiesCount {
  data: ICities[];
  count: number;
}

const getAll = async (filter = "", page = 1): Promise<ICitiesCount | Error> => {
  try {
    const url = `/cidades?_page=${page}&_limit=${Environment.LINES_LIMITS}&nome_like=${filter}`;

    const { data, headers } = await api.get(url);

    if (data) {
      return {
        data,
        count: Number(headers["x-total-count"] | Environment.LINES_LIMITS),
      };
    }
    return new Error("Erro ao listar os registros");
  } catch (error) {
    return new Error(
      (error as { message: string }).message || "Registros não encontrados"
    );
  }
};

const getById = async (id: number): Promise<ICities | Error> => {
  try {
    const { data } = await api.get(`/cidades/${id}`);
    if (data) {
      return data;
    }

    return new Error("Erro ao buscar o registro!");
  } catch (error) {
    return new Error(
      (error as { message: string }).message || "Registro não encontrado!"
    );
  }
};
const create = async (city: Omit<ICities, "id">): Promise<number | Error> => {
  try {
    const { data } = await api.post<ICities>("/cidades", city);

    if (data) return data.id;

    return new Error("erro ao criar o registro!");
  } catch (error) {
    return new Error(
      (error as { message: string }).message || "Erro ao criar o registro!"
    );
  }
};
const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await api.delete(`/cidades/${id}`);
  } catch (error) {
    return new Error(
      (error as { message: string }).message || "Erro ao excluir o registro!"
    );
  }
};
const updateById = async (id: number, city: Omit<ICities, "id">) => {
  try {
    await api.put(`/cidades/${id}`, city);
  } catch (error) {
    return new Error(
      (error as { message: string }).message ||
        " Erro ao atualizar o registro!"
    );
  }
};

export const CitiesService = {
  getById,
  getAll,
  create,
  deleteById,
  updateById,
};
