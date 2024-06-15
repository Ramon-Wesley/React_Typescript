
import { Box,Button,Card,TextField,CardContent,CardActions, Typography, CircularProgress } from "@mui/material"
import { useLogin } from "./Login"
import { Form } from "@unform/web"
import { VTextField } from "../../form/VTextField"
import { useEffect } from "react"

export const ForgotPassword=()=>{
    const {handleForgotPassword,formRef,isLoading,smDown,mdDown}=useLogin()

    return(
      <Box>
            <Form ref={formRef} onSubmit={handleForgotPassword} style={{width:"100vw"}}>
        <Box display='flex' flexDirection="column" alignItems='center' justifyContent='center'  width='100%' height='100%'>

      <Button
      onClick={handleForgotPassword}
      sx={{
        backgroundColor: 'purple',
        color: '#FFFFFF',
        borderRadius:"10px",
        
        '&:hover': {
          backgroundColor: '#4B0082', // Cor mais escura no hover
        },
      }}
      disabled={isLoading}
      startIcon={isLoading ? <CircularProgress style={{ width: '10px', height: '10px', color: '#FFFFFF' }} /> : null}
      >
      Voltar
    </Button>
            <Typography variant="h4" fontWeight="bold"  color="black" marginBottom="20px" >Esqueci senha</Typography>
            <Box sx={{backgroundColor:"none"}}>
                    <Box width={smDown?"90vw":mdDown?"50vw":"30vw"} >
                    <Box display='flex' flexDirection='column'  gap={2} padding={2}>

          <VTextField
          name="login" label="Email" fullWidth
          style={{
            backgroundColor:"#FFFFFF"
          }}
          />
          </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={2}>
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
      
      disabled={isLoading}
      startIcon={isLoading ? <CircularProgress style={{ width: '10px', height: '10px', color: '#FFFFFF' }} /> : null}
      >
      Enviar
    </Button>
                    </Box>

                        </Box>
            </Box>
        </Box>
                        </Form>
       
      </Box>
    )
}