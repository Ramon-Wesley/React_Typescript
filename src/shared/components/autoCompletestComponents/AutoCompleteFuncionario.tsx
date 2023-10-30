import { useField } from "@unform/core";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

import { Autocomplete, TextField, CircularProgress, Grid } from "@mui/material";

import { UseDebounce } from "../../hook";
import { CitiesService } from "../../services/api/cities/CitiesService";
import { FuncionarioService } from "../../services/api/funcionarios/FuncionariosService";

interface IAutoCompleteCities {
  isExternalLoading?: boolean;
}

type TOptionSelected = {
  id: number;
  ra: string;
  nome: string;
};
export const AutoCompleteFuncionario: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("funcionario_id");
  const [select, setSelect] = useState<number | undefined>(defaultValue);
  const [busca,setBusca]=useState<string>("")
  const [options, setOptions] = useState<TOptionSelected[]>([]);
  const [id,setId]=useState<number | null | undefined>(0);
  const [nome,setNome]=useState<string | undefined>("")
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


const autoCompleteValue = useMemo(() => {

  return select ? options.find((op) => op.id === select): null;
}, [select, options]);
const dataValue=useCallback(()=>{
  debounce(() => {
      setIsLoading(true);
      FuncionarioService.getAllByRa(busca, 1)
      .then((response) => {
            setIsLoading(false);
            if (response instanceof Error) {
            } else {
              setIsLoading(false);
              setOptions(
              response.data.map((res) => ({ id: res.id, ra: res.ra,nome:res.nome })));
            }
          });
  })},[]);


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
      getOptionLabel={(data)=>data.ra}

      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => {
        setSelect(newValue?.id )
        setNome(newValue?.nome )   
        clearError();       
      }}
      renderInput={(params) => (
        <TextField
        focused
        value={autoCompleteValue?.ra}
        required
        {...params}
        label="Ra"
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
        onChange={(e)=>setNome(e.target.value)} 
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
