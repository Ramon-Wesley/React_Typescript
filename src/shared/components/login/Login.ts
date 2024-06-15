import * as yup from 'yup'
import { useState,useCallback,useRef, useMemo, FormEvent } from "react"
import { useAuthContext } from "../../context"
import { UseVForm } from '../../form/UseVForm';
import { ILogin } from '../../services/api/login/Login';
import { useMediaQuery, useTheme } from '@mui/material';

export const useLogin =()=>{
const [forgotPass,setForgotPass]=useState<boolean>(false) 
interface IForm extends Omit<ILogin, "id_funcionario"> {}
const saveValue = useRef<IForm>();
const theme = useTheme();
const smDown = useMediaQuery(() => theme.breakpoints.down("sm"));
const mdDown = useMediaQuery(() => theme.breakpoints.down("md"));
const {formRef } = UseVForm();
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [isLoading,setIsLoading]=useState(false)
const [errorsemail,setErrorsEmail]=useState("")
const [errorspassword,setErrorsPassword]=useState("")
const {isAuthenticated,login}=useAuthContext()

const validateSchema:yup.ObjectSchema<IForm>=yup.object().shape({
        login:yup.string().email().required(),
        senha:yup.string().min(6).required()
     })
const handleForgotPassword=(()=>{
      setForgotPass(prev=>!prev)
      console.log("teste"+forgotPass)
})



    const handleValidate=useCallback((values: IForm)=>{
        setIsLoading(true)
        validateSchema.validate(values,{abortEarly:false})
        .then((result)=>{
            login(result.login,result.senha).then((result)=>{
                setIsLoading(false)
                setEmail("")
                setPassword("")
                
            })
            
        }) .catch((error: yup.ValidationError) => {
            setIsLoading(false)
            console.log("testedddee")
            const errorsResult: Record<string, string> = {};
            error.inner.forEach((err) => {
              if (err.path === undefined) return;
              errorsResult[err.path] = err.message;
            });
            formRef.current?.setErrors(errorsResult);
          });
    },[])

    return{
        handleValidate,
        validateSchema,
        isAuthenticated,
        email,
        password,
        isLoading,
        errorsemail,
        errorspassword,
        formRef,
        smDown,
        mdDown,
        handleForgotPassword,

        forgotPass
        
    }
}