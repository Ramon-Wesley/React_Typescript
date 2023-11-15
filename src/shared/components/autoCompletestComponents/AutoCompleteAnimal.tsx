import { useField } from "@unform/core";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

import { Autocomplete, TextField, CircularProgress, Grid } from "@mui/material";
import { IPersons, PersonService } from "../../services/api/cliente";
import { UseDebounce } from "../../hook";
import { RacaService } from "../../services/api/raca/RacasService";
import { animalService } from "../../services/api/animals/AnimalsService";

interface IAutoCompleteCities {
  isExternalLoading?: boolean;
  idCliente:number | undefined
}

type TOptionSelected = {
  animalId: number;
  nome: string;
};
export const AutoCompleteAnimal: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
  idCliente
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("animal_id");
  const [select, setSelect] = useState<number | undefined>(defaultValue);
  const [options, setOptions] = useState<TOptionSelected[]>([]);
  const [id,setId]=useState<number | undefined | null>(0);
  const [search,setSearch]=useState("");
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
    },[select,idCliente])
    
    
    const autoCompleteValue = useMemo(() => {
      return select ? options.find((op) => op.animalId === select): null;
    }, [select, options]);

const dataValue=useCallback(()=>{

  debounce(() => {
      setIsLoading(true);
     
      if(idCliente !== undefined && idCliente > 0){
       
        animalService.getAllByIdCliente(idCliente,search, 1)
        .then((response) => {
          setIsLoading(false);
          if (response instanceof Error) {
            
          } else {
           
            setOptions(
              response.data.map((res) => ({ animalId: res.id,nome:res.nome })));
            }
          });
        }else{
          setIsLoading(false)
        }
  });
},[search,select,idCliente])
 




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
        setSelect(newValue?.animalId)
        clearError();       
      }}
      renderInput={(params) => (
        <TextField
        required
        focused
        {...params}
        label="Animal"

        error={!!error}
        helperText={error}
        fullWidth
        />
        )}
        />
        </Grid>

    </>
  );
};
