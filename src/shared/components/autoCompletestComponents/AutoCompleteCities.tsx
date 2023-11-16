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
  const { defaultValue, error, fieldName, registerField } =
    useField("endereco");

  const [endereco,setEndereco]=useState<IEndereco>(defaultValue)
  const[cep,setCep]=useState("")

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
    }
  },[endereco])

  useEffect( ()=>{ 
    if(cep.length >= 8){
      getEndereco(cep)
      .then((response)=>{
        if(response instanceof Error){
        if(endereco?.cep){
          setEndereco(
            {...endereco,
            logradouro:"",
            bairro:"",
            cep:"",
            localidade:"",
          
           
          })
        }
        }else{
  
        setEndereco({...endereco,cep:response.cep,localidade:response.localidade,logradouro:response.logradouro,bairro:response.bairro,uf:response.uf})
        }
      })
    }else if(cep.length === 7){
      if(endereco?.cep){
        setEndereco({
          ...endereco,
          logradouro:"",
          bairro:"",
          cep:"",
          localidade:"",
        })

      }
    }
},[cep])

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
    <TextField name="numero" label="Numero" fullWidth 
     onChange={(e)=>{setEndereco({...endereco,numero:e.target.value})}}
     value={endereco?.numero}
     focused
    />
    </Grid>
    <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
    <TextField name="complemento" label="Complemento" fullWidth 
     focused
     onChange={(e)=>{setEndereco({...endereco,complemento:e.target.value})}}
     value={endereco?.complemento}
     />
    </Grid>
</Grid> 
    </>
  );
};
