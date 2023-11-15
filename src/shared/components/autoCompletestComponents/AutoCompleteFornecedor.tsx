import { useField } from "@unform/core";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Autocomplete, TextField, CircularProgress, Grid } from "@mui/material";
import { UseDebounce } from "../../hook";
import { FornecedorService } from "../../services/api/fornecedor/FornecedorService";

interface IAutoCompleteCities {
  isExternalLoading?: boolean;

}

type TOptionSelected ={
  id:number,
  nome:string,
  cnpj:string
}
type selectOption={
  fornecedor_id:number
}
export const AutoCompleteFornecedor: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("fornecedor_id");
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
},[select])


const dataValue=useCallback(()=>{
  debounce(() => {
      setIsLoading(true);
      FornecedorService.getAllByCnpj(busca, 1)
      .then((response) => {
            setIsLoading(false);
            if (response instanceof Error) {
            } else {
              setIsLoading(false);
              setOptions(
              response.data.map((res) => ({ id: res.id, cnpj: res.cnpj,nome:res.nome })));
            }
          });
  })},[]);

const autoCompleteValue = useMemo(() => {

  return select ? options.find((op) => op.id === select): null;
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
      getOptionLabel={(data)=>data.cnpj}

      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => {
        setSelect(newValue?.id)
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
        value={autoCompleteValue?.nome}
        required
        focused
        InputProps={{
          readOnly: true,
        }}
        fullWidth
    />
        </Grid>
      
    </>
  );
};
