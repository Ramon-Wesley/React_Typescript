import { useField } from "@unform/core";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

import { Autocomplete, TextField, CircularProgress, Grid, Select, Button } from "@mui/material";
import { IPersons, PersonService } from "../../services/api/cliente";
import { UseDebounce } from "../../hook";
import { RacaService } from "../../services/api/raca/RacasService";
import { animalService } from "../../services/api/animals/AnimalsService";
import { ServicosService } from "../../services/api/servicos/ServicesService";
import { IRowsReserva, TabelaReserva } from "../table/TabelaReserva";
import { VTextField } from "../../form/VTextField";

interface IAutoCompleteCities {
  isExternalLoading?: boolean;
  data?:Date
}

type TOptionSelected = {
    servico_id:number;
    nome:string;
    valor:number;
};

export const AutoCompleteServicos: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
  data=undefined
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("servico_id");
  const [select, setSelect] = useState<number | undefined >(defaultValue);
  const [options, setOptions] = useState<TOptionSelected[]>([]);
  const [search,setSearch]=useState("")
  const [optionsTable,setOptionsTable]=useState<IRowsReserva[]>([]);
  const [id,setId]=useState<number | undefined | null>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [datas,setDatas]=useState<Date| undefined>(data);
  const { debounce } = UseDebounce();
  

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () =>select,
      setValue: (_, newValue) => setSelect(newValue),
    });
  }, [registerField, fieldName, select]);

  useEffect(()=>{
    dataValue()
    },[select])
const dataValue=useCallback(()=>{

  debounce(() => {
      setIsLoading(true);

        ServicosService.getAll(search, 1)
        .then((response) => {
          setIsLoading(false);
          if (response instanceof Error) {
          } else {
            setIsLoading(false);
            setOptions(
              response.data.map((res) => ({ servico_id: res.id,nome:res.nome,valor:res.valor})));
            }
          });
        
  })
},[select,search])
 

const autoCompleteValue = useMemo(() => {

  return select ? options.find((op) => op.servico_id === select): null;
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
      onInputChange={(_, newValue) => setSearch(newValue)}
      onChange={(_, newValue) => {
        setSelect(newValue?.servico_id)
        clearError();       
      }}
      renderInput={(params) => (
        <TextField
        required
        focused
        {...params}
        label="Servico"
        error={!!error}
        helperText={error}
        fullWidth
        />
        )}
        />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
        <VTextField
        required
       
        name="data"
        type="date"
        label="data"
        fullWidth
        />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
        <TextField
        required
        focused
        type="number"
        value={autoCompleteValue?.valor}
        label="valor do servico"
        error={!!error}
        helperText={error}
        fullWidth
        InputProps={{
          readOnly: true,
        }}
        />
        </Grid>

        

       
    </>
  );
};
