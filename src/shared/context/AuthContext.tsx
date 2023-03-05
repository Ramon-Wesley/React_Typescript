import {createContext,useContext,useState,useEffect,useCallback,useMemo} from 'react'
import { authService } from '../services/api/auth/auth'
interface IAuthContextData{
    login:(email:string,password:string)=>Promise<string | void>,
    logout:()=>void,
    isAuthenticated:boolean
}

const AuthContext=createContext({} as IAuthContextData)
const LOCAL_STORAGE_KEY='APP_ACCESS_TOKEN'
interface IAuthProvider{
    children:React.ReactNode
}

export const AuthProvider:React.FC<IAuthProvider>=({children})=>{
    const [accessToken,setAccessToken]=useState<string>()
useEffect(()=>{
const result =localStorage.getItem(LOCAL_STORAGE_KEY)

if(result){
    setAccessToken(JSON.parse(result))
}else{
    setAccessToken(undefined)
}
},[])

const handleLogin=useCallback(async(email:string,password:string)=>{

   const result = await authService.auth(email,password)
   
   if(result instanceof Error) {
       return result.message
   }else{  
       localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(result.accessToken))
       console.log(result.accessToken)
       setAccessToken(result.accessToken)
    }

    

},[])

const handleLogout=useCallback(()=>{
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setAccessToken(undefined)
},[])

const isAuthenticated=useMemo(()=>!!accessToken,[accessToken])

    return(
        <AuthContext.Provider value={{isAuthenticated,login:handleLogin,logout:handleLogout}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuthContext=()=>useContext(AuthContext)