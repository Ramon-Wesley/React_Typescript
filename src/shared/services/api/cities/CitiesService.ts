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

export const CitiesService = {
  getById,
  getAll,
};
