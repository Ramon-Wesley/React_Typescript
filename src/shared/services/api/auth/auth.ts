import { api } from "../axios";


interface IAuth{
   accessToken:string;
}
 const auth=async(email:string,senha:string):Promise<IAuth | Error>=>{

    try {
        //let res:IAuth={accessToken:"hhhh"}
        const {data}=await api.post('/entrar',{email,senha})

        if(data){
            return data
        }
        return new Error('Erro na autenticação!')
    } catch (error) {
        return new Error((error as {message:string}).message || 'Erro ao autenticar!')
    }
}

export const authService={
    auth
}
