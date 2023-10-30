import { api } from '../axios';


export interface IEndereco{
    cep:string;
    localidade:string;
    logradouro:string
    bairro:string;
    numero?:string;
    complemento?:string;
    uf?:string
}


export const getEndereco=async(cep:string):Promise<IEndereco | Error>=>{
 
    try {
        const {data}=await api.get(`https://viacep.com.br/ws/${cep}/json/`)
        if(data){
            return data as IEndereco;
        }
        return new Error("Endereco nao encontrado")
    } catch (error) {
        return new Error("Erro ao buscar endereco")
    }
}