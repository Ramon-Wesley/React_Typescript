import { useField } from "@unform/core";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

import { Autocomplete, TextField, CircularProgress, Grid } from "@mui/material";
import { IPersons, PersonService } from "../../services/api/cliente";
import { UseDebounce } from "../../hook";
import { IRacas, RacaService } from "../../services/api/raca/RacasService";

interface IAutoCompleteCities {
  isExternalLoading?: boolean;
}

export const AutoCompleteRaca: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("raca");
  const [select, setSelect] = useState<IRacas>(defaultValue);
  const [options, setOptions] = useState<IRacas[]>([]);
  const [busca,setBusca]=useState("");
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
        RacaService.getAll(busca, 1)
        .then((response) => {
              setIsLoading(false);
              if (response instanceof Error) {
              } else {
                setIsLoading(false);
                setOptions(
                response.data.map((res) => ({ racaId:res.racaId,especie:res.especie,nome:res.nome })));
              }
            });
    });
      },[busca,select]);


      const autoCompleteValue = useMemo(() => {

        return select ? options.find((op) => op.racaId === select.racaId): null;
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
      getOptionLabel={(data)=>data.nome}
      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => {
        setSelect(newValue as IRacas)
        clearError();       
      }}
      renderInput={(params) => (
        <TextField
        required
        focused
        {...params}
        label="Raca"
        error={!!error}
        helperText={error}
        />
        )}
        />
        </Grid>

    </>
  );
};
