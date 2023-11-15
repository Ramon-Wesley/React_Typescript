import { AlertColor, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, RadioGroup, Select, TextField, Typography } from "@mui/material"
import { FormEvent, FormEventHandler, useCallback, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TLink, TTipo, createPdf } from "../../services/api/pdf/PdfService";

interface Itipo{
    nome:"Compras" | "Vendas"
}
export const RelatorioDetail:React.FC<Itipo>=({nome})=>{


    const [inicio, setInicio] = useState<string>();
    const [fim, setFim] = useState<string>();
   
    const navigate = useNavigate();
 
 
const save=():void | undefined=>{

}  
   
  const handleSave = useCallback((event:FormEvent<HTMLFormElement>) => {
   event.preventDefault();
   
   event.preventDefault(); 
   const formData = new FormData(event.currentTarget);
   const valorInicio = formData.get('dataInicio')
   const valorFim = formData.get('dataFinal');
   const tipo = formData.get('tipo');
   const link = formData.get('link');
   
   if(valorInicio && valorFim && tipo && link){
    createPdf({dataInicio:new Date(valorInicio.toString()),dataFinal:new Date(valorFim.toString())},tipo as TTipo,link as TLink)
    .then((e)=>{
      if(e instanceof Error){
        console.log(e.message)
      }else{
        e.download()
        
    }})
   }

    }, []);



  return (
  
     

     
      <form  onSubmit={handleSave}>
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
            <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
               <TextField
               fullWidth
                required
               type="date"
               name="dataInicio"
               label="Data"
               focused
               value={inicio}
               onChange={(e)=>setInicio(e.target.value)}
               />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
               <TextField
               fullWidth
               required
               type="date"
               name="dataFinal"
               label="Data Final*"
               focused
               value={fim}
               onChange={((e)=>setFim(e.target.value))}
               />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                <Select
                 required
                labelId="demo-simple-select-label"
                name="tipo"
                label="tipo">
                <MenuItem value={"vendas"}>Vendas</MenuItem>
                <MenuItem value={"compras"}>Compras</MenuItem>
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                <Select
                required
                labelId="demo-simple-select-label"
                name="link"
                label="tipo de relatorio">
                <MenuItem value={"relatorio"}>Geral</MenuItem>
                <MenuItem value={"relatorio/produto"}>Produtos</MenuItem>
                </Select>
              </FormControl>
              </Grid>
            </Grid>
            <Grid item>
                    <Button variant="contained" type="submit">Gerar pdf</Button>
            </Grid>
            </Grid>
        </Box>
      </form>
   
  );
}