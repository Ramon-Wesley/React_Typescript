import { Box,Button,Card,TextField,CardContent,CardActions, Typography, CircularProgress, ThemeProvider } from "@mui/material"

import background from "./background.png"
import { useLogin } from "./Login"
import { Form } from "@unform/web";
import { UseVForm } from "../../form/UseVForm";
import { VTextField } from "../../form/VTextField";
import ParticlesComponent from "./backgroundLogin";
import { ForgotPassword } from "./ForgotPassword";
import { useEffect } from "react";
import { LightTheme } from "../../theme/LightTheme";

interface ILogin{
    children:React.ReactNode
}

export const LoginDetail:React.FC<ILogin>=({children})=>{
const {handleValidate,validateSchema,isAuthenticated,formRef,isLoading,smDown,mdDown,forgotPass,handleForgotPassword}=useLogin()

if (isAuthenticated) {
    return(<>{children}</>)
}else{
  return(
    <ThemeProvider theme={LightTheme}>
         
        <Box width="100vw" height="100vh" bgcolor="none" sx={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute', top: 0, left: 0, zIndex: 1 
        }}>
          {forgotPass?(<ForgotPassword/>):(
            <Form ref={formRef} onSubmit={handleValidate} style={{width:"100vw"}}>
          
        <Box display='flex' flexDirection="column" alignItems='center' justifyContent='center'  width='100%' height='100%'>
            <Typography variant="h4" fontWeight="bold"  color="black" marginBottom="20px" >Login</Typography>
            <Box sx={{backgroundColor:"none"}}>
                    <Box width={smDown?"90vw":mdDown?"50vw":"30vw"} >
                    <Box display='flex' flexDirection='column'  gap={2} padding={2}>
          <VTextField
          name="login" label="Email" fullWidth 
          style={{
            backgroundColor:"#FFFFFF",
            color:"#000000"
          }}
          />
            <VTextField
          name="senha" label="Senha" fullWidth  type="password" 
          style={{
            backgroundColor:"#FFFFFF",
            color:"#000000"
          }}
          />
          </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography onClick={handleForgotPassword} alignSelf="flex-end" fontWeight="bold"  sx={{
                          cursor: 'pointer', // Adiciona cursor pointer
                          '&:hover': {
                            color: '#800080', // Altera a cor do texto para roxo no hover
                          },
                        }}></Typography>
                    <Box display='flex'  justifyContent='center' width='100%'>
                    <Button
      sx={{
        backgroundColor: 'purple',
        color: '#FFFFFF',
        borderRadius:"10px",
        width:"50%",
        '&:hover': {
          backgroundColor: '#4B0082', // Cor mais escura no hover
        },
      }}
      type="submit"
      disabled={isLoading}
      startIcon={isLoading ? <CircularProgress style={{ width: '10px', height: '10px', color: '#FFFFFF' }} /> : null}
      >
      Entrar
    </Button>
                    </Box>
                        </Box>
            </Box>
        </Box>
                        </Form>
    )
  }
      </Box>
  </ThemeProvider>
    )
  }
}