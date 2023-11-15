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
<<<<<<< HEAD
        const {data}=await api.get<IEndereco>(`https://viacep.com.br/ws/${cep}/json/`)
        if(data){
            return data 
=======
        const {data}=await api.get(`https://viacep.com.br/ws/${cep}/json/`)
        if(data){
            return data as IEndereco;
>>>>>>> 2f98c5ece0dc1cf562cd9bbd9811e1ec9924b089
        }
        return new Error("Endereco nao encontrado")
    } catch (error) {
        return new Error("Erro ao buscar endereco")
    }
}