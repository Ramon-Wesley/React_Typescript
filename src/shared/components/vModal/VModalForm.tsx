import {
    Modal,
    Box,
    Typography,
    Button,
    Paper,
    useTheme,
    Grid,
  } from "@mui/material";
import { Form } from "react-router-dom";
import { VTextField } from "../../form/VTextField";

  
  
interface IDateForm{
open:boolean;
validateForm:()=>void;
}
  
  export const VModal: React.FC<IDateForm> = ({
   open=false,
   validateForm
  }) => {
    const theme = useTheme();
    return (
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          overflow="auto"
          component={Paper}
          gap={1}
          display="flex"
          padding={1}
          alignItems="center"
          flexDirection="column"
          width={theme.spacing(35)}
          height={theme.spacing(25)}
          position="absolute"
          top="30%"
          left="50%"
          sx={{ transform: "translate(-50%,-50%)" }}
        >
           <Form onSubmit={validateForm}>
        <Box
          component={Paper}
          margin={1}
          display="flex"
          flexDirection="column"
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid item>
        <Typography>Todos os campos com <span style={{color:"red"}}>*</span> são obrigatorios!</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{fontWeight:"bolder"}}>Geral</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                <VTextField
                  name="nome"
                  label="Nome*"
                  fullWidth
                />
              </Grid>
              <Button variant="contained" type="submit">Cadastrar</Button>
            </Grid>
                              </Grid>
        </Box>
      </Form>
        </Box>
      </Modal>
    );
  };
  