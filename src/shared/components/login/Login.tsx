import { Box,Button,Card,TextField,CardContent,CardActions, Typography } from "@mui/material"
import { useState,useCallback } from "react"
import * as yup from 'yup'
import { useAuthContext } from "../../context"



const validateSchema=yup.object().shape({
    email:yup.string().email().required(),
    password:yup.string().min(6).required()
})
interface ILogin{
    children:React.ReactNode
}
export const Login:React.FC<ILogin>=({children})=>{

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [errorsemail,setErrorsEmail]=useState("")
const [errorspassword,setErrorsPassword]=useState("")
const {isAuthenticated,login}=useAuthContext()
const handleValidate=()=>{
    
 validateSchema.validate({email,password},{abortEarly:false})
.then((result)=>{
    login(result.email,result.password).then((result)=>{
        setEmail("")
        setPassword("")
    })
   
}).catch((errors:yup.ValidationError)=>{

    errors.inner.forEach((err)=>{
        if(err.path === 'email'){
            setErrorsEmail(err.message)
        }
        if(err.path === 'password'){
            setErrorsPassword(err.message)
        }
    })
})
}

if (isAuthenticated) {
    return(<>{children}</>)
}
    return(

        <Box display='flex' alignItems='center' justifyContent='center' width='100%' height='100%'>
            <Card>
                    <CardContent>
                <Box display='flex' flexDirection='column' gap={2} padding={2}>
                        <Typography>Login</Typography>
                        <TextField
                        fullWidth
                        label="Email"
                        type='email'
                        error={!!errorsemail}
                        helperText={errorsemail}
                        onChange={(newValue)=>setEmail(newValue.target.value)}
                        value={email}
                        onKeyDown={()=>setErrorsEmail("")}
                        />
                         <TextField
                         fullWidth
                         type='password'
                        label="Senha"
                        error={!!errorspassword}
                        helperText={errorspassword}
                        onChange={(newValue)=>setPassword(newValue.target.value)}
                        value={password}
                        onKeyDown={()=>setErrorsPassword("")}
                        />
                </Box>
                    </CardContent>
                    <CardActions>
                    <Box display='flex'  justifyContent='center' width='100%'>
                        <Button variant="contained" onClick={handleValidate}>Entrar</Button>
                    </Box>
                        </CardActions>
            </Card>
        </Box>
    )
}