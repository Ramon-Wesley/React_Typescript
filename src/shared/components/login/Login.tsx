import { Box,Button,Card,TextField,CardContent,CardActions, Typography, CircularProgress } from "@mui/material"
import { useState,useCallback } from "react"
import * as yup from 'yup'
import background from "./background.png"
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
const [isLoading,setIsLoading]=useState(false)
const [errorsemail,setErrorsEmail]=useState("")
const [errorspassword,setErrorsPassword]=useState("")
const {isAuthenticated,login}=useAuthContext()
const handleValidate=()=>{
    setIsLoading(true)
 validateSchema.validate({email,password},{abortEarly:false})
.then((result)=>{
    login(result.email,result.password).then((result)=>{
        setIsLoading(false)
            setEmail("")
            setPassword("")
        
    })
   
}).catch((errors:yup.ValidationError)=>{
    setIsLoading(false)
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

        <Box width="100vw" height="100vh" bgcolor="none"  sx={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
        <Box display='flex' flexDirection="column" alignItems='center' justifyContent='center' width='100%' height='100%'>
            <Typography variant="h2"  color="white" marginBottom="20px" >Castanhas RJ</Typography>
            <Card sx={{backgroundColor:"white"}}>
                    <CardContent>
                <Box display='flex' flexDirection='column'  gap={2} padding={2}>
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
                        <Button sx={{backgroundColor:"purple"}} variant="contained" onClick={handleValidate} disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress style={{ width: '10px', height: '10px' }}/> : null}>Entrar</Button>
                    </Box>
                        </CardActions>
            </Card>
        </Box>
        </Box>
    )
}