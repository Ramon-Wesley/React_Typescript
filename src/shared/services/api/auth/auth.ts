import { api } from "../axios";


interface IAuth{
   accessToken:string;
}
 const auth=async(email:string,senha:string):Promise<IAuth | Error>=>{

    try {
        const {data}=await api.post('/entrar',{email,senha})
        if(data){
            return data
        }
        return new Error('Erro na autenticação!')
    } catch (error) {
        return new Error((error as {message:string}).message || 'Erro ao autenticar!')
    }
}
const email=async(email:string):Promise<boolean | Error>=>{
    try {
        //let res:IAuth={accessToken:"hhhh"}
        const {data}=await api.post('/entrar',{email})

        if(data){
            return true
        }
        return new Error('Erro na autenticação!')
    } catch (error) {
        return new Error((error as {message:string}).message || 'Email não cadastrado!')
    }
}

export const authService={
    auth
}
