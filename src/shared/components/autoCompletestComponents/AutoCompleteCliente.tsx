import { useField } from "@unform/core";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Autocomplete, TextField, CircularProgress, Grid } from "@mui/material";
import { UseDebounce } from "../../hook";
import { PersonService } from "../../services/api/cliente";
import { AutoCompleteAnimal } from "./AutoCompleteAnimal";

interface IAutoCompleteCities {
  isExternalLoading?: boolean;
  isAnimal?:boolean
}

type TOptionSelected ={
  cliente_id:number,
  nome:string,
  cpf:string
}
export const AutoCompleteCliente: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
  isAnimal=false
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("cliente_id");
    const [select, setSelect] = useState<number | undefined >(defaultValue);
  const [options, setOptions] = useState<TOptionSelected[]>([]);
  const [busca,setBusca]=useState<string>("")
  const [isLoading, setIsLoading] = useState(false);
  const { debounce } = UseDebounce();
  

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => select,
      setValue: (_, newValue) => setSelect(newValue),
    });

  }, [registerField, fieldName, select]);

useEffect(()=>{
dataValue()
},[select]);


const dataValue=useCallback(()=>{
  debounce(() => {
      setIsLoading(true);
      PersonService.getAllByCpf(busca,1) 
      .then((response) => {
            setIsLoading(false);
            if (response instanceof Error) {
            } else {
              setIsLoading(false);
              setOptions(
              response.data.map((res) => ({ cliente_id: res.id, cpf: res.cpf,nome:res.nome })));
            }
          });
  })},[]);

const autoCompleteValue = useMemo(() => {

  return select ? options.find((op) => op.cliente_id === select): null;
}, [select, options]);
  return (
<>
<Grid item xs={12} sm={12} md={6} lg={4} xl={2}>

    <Autocomplete
    
      loadingText="Carregando..."
      loading={isLoading}
      disabled={isExternalLoading}
      popupIcon={
        isLoading || isExternalLoading ? <CircularProgress size={26} /> : ""
      }
     
      openText="Abrir"
      closeText="Fechar"
      noOptionsText="Sem opções"
      clearText="Apagar"
      disablePortal
      options={options}
      value={autoCompleteValue}
      getOptionLabel={(data)=>data.cpf}

      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => {
        setSelect(newValue?.cliente_id)
        clearError();       
      }}
      renderInput={(params) => (
        <TextField
        focused
        required
        {...params}
        label="Cpf"
        error={!!error}
        helperText={error}
        />
        )}
        />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>

    <TextField
        label="nome"
        required
        focused
        InputProps={{
          readOnly: true,
        }}
        value={autoCompleteValue?.nome}
        fullWidth
    />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
    {isAnimal &&(
      <AutoCompleteAnimal
      idCliente={autoCompleteValue?.cliente_id}
      />
      )}
      </Grid>
    </>
  );
};
