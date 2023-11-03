import { useField } from "@unform/core";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { UseDebounce } from "../../hook";

import { Autocomplete, TextField, CircularProgress, Grid } from "@mui/material";
import { IEndereco, getEndereco } from "../../services/api/Cep/CepService";

interface IAutoCompleteCities {
  isExternalLoading?: boolean;
}


export const AutoCompleteCities: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("endereco");

  const [endereco,setEndereco]=useState<IEndereco>(defaultValue)
  const[cep,setCep]=useState("")
  const[numero,setNumero]=useState("")
  const[complemento,setComplemento]=useState("")
  

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => endereco,
      setValue: (_, newValue) => setEndereco(newValue),
    });
  }, [registerField, fieldName, endereco]);

  useEffect(()=>{
    if(endereco?.cep?.length >=8 ){
      setCep(endereco.cep)
      if(numero.length === 0){
        setNumero(endereco?.numero || "")
      }
      if(complemento?.length === 0){
        setComplemento(endereco?.complemento || "")
      }
    }
  },[endereco])

  useEffect( ()=>{ 
    if(cep.length >= 8){
      getEndereco(cep)
      .then((response)=>{
        if(response instanceof Error){
        if(endereco?.cep){
          setEndereco({
            logradouro:"",
            bairro:"",
            cep:"",
            complemento:"",
            localidade:"",
            numero:"",
           
          })
        }
        }else{
          console.log(response)
    setEndereco(response)
        }
      })
    }else if(cep.length === 7){
      if(endereco?.cep){
        setEndereco({
          logradouro:"",
          bairro:"",
          cep:"",
          complemento:"",
          localidade:"",
          numero:"",
         
        })

      }
    }
},[cep])
const changeNumero=async(e:string)=>{
setNumero(e)
setEndereco({...endereco,numero:e})
}
const changeComplemento=async(e:string)=>{
  setComplemento(e)
  setEndereco({...endereco,complemento:e})
  }

  return (
    <>
    <Grid container item spacing={2}>
    <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
    <TextField name="cep" label="Cep*" fullWidth 
    onChange={(e)=>setCep(e.target.value)}
    value={cep}
    inputProps={{
      min:8
    }}
    focused
    />
    </Grid>
    <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
    <TextField name="localidade" label="Cidade*" fullWidth
    value={endereco?.localidade}
    error={!!error}
      helperText={error}
      inputProps={{
        readOnly:true
      }}
      focused
    />
    </Grid>
    <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
    <TextField name="rua" label="Rua*" fullWidth
    required
    focused
    value={endereco?.logradouro}
    inputProps={{
      readOnly:true
    }}
    />
    </Grid>
  </Grid>
  <Grid container item spacing={2}>
    <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
    <TextField name="bairro" label="Bairro*" fullWidth
     required
     focused
    value={endereco?.bairro} 
    inputProps={{
      readOnly:true
    }}
    />
    </Grid>
    <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
    <TextField name="numero" label="Numero*" fullWidth 
     onChange={(e)=>{changeNumero(e.target.value)}}
     value={numero}
 
     required
     focused
    />
    </Grid>
    <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
    <TextField name="complemento" label="Complemento" fullWidth 
     onChange={(e)=>{changeComplemento(e.target.value)}}
     focused
     value={complemento}
     />
    </Grid>
</Grid> 
    </>
  );
};
