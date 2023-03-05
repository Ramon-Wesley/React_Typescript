import { api } from "../axios";


interface IAuth{
   accessToken:string;
}
 const auth=async(email:string,password:string):Promise<IAuth | Error>=>{

    try {
        const {data}=await api.get('/auth',{data:{email,password}})

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
