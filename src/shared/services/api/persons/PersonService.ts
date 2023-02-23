import { Environment } from "../../../environment/Environment"
import { api } from "../axios"


export interface IPersons{
    id:number,
    cidadeId:number,
    nome:string,
    email:string
}

interface IDataCount{
    data:IPersons[],
    totalCount:number
}
export const getAll=async(filter='',page= 1):Promise<IDataCount | Error>=>{

    try {
        const urlGetAll=`/pessoas?_page=${page}&_limit=${Environment.LINES_LIMITS}&nome_like=${filter}`

        const {data,headers}=await api.get(urlGetAll)
    
        if(data) {
            return{
                data,
                totalCount:Number(headers['x-total-count'] || Environment.LINES_LIMITS)
            }
        }

        return new Error('Erro ao listar os registros!')
    } catch (error ) {
        return  new Error((error as {message:string}).message || 'Dados não encontrados!')
    }
}

export const deleteById=async(id:number):Promise<void | Error>=>{

    try {
        await api.delete(`/pessoas/${id}`)

    } catch (error) {
        return new Error((error as {message:string}).message || 'Erro ao deletar o registro')
    }
}



export const PersonService={
    getAll,
    deleteById
}