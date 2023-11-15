import { useField } from "@unform/core";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { UseDebounce } from "../../hook";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { EstoqueService, IEstoques } from "../../services/api/estoque/EstoqueService";

interface IAutoCompleteCities {
  isExternalLoading?: boolean;
}

type TOptionSelected = {
      id:number;
      nome:string
};
export const AutoCompleteProduto: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("produto");
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState<TOptionSelected>(defaultValue);
  const [options, setOptions] = useState<TOptionSelected[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { debounce } = UseDebounce();

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => select,
      setValue: (_, newValue) => setSelect(newValue),
    });
  }, [registerField, fieldName, select]);

  const handleSearch = useCallback( () => {
    setIsLoading(true);
    debounce(() => {
      try {
        EstoqueService.getAll(search, 1).then((response) => {
              setIsLoading(false);
              if (response instanceof Error) {
              } else {
                setIsLoading(false);
                setOptions(
                  response.data.map((res) => ({ id: res?.id, nome: res?.nome }))
                );
              }
            });
      } catch (error) {
       
      }
    });
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search]);

  const autoCompleteValue = useMemo(() => {
    return select ? options.find((op) => op.id === select.id) : null;
  }, [select, options]);

  return (
    <Autocomplete
      loadingText="Carregando..."
      loading={isLoading}
      disabled={isExternalLoading}
      popupIcon={
        isLoading || isExternalLoading ? <CircularProgress size={26} /> : ""
      }
      getOptionLabel={(e)=>e.nome}
      openText="Abrir"
      closeText="Fechar"
      noOptionsText="Sem opções"
      clearText="Apagar"
      disablePortal
      value={autoCompleteValue}
      onInputChange={(_, newValue) => setSearch(newValue)}
      options={options}
      onChange={(_, newValue) => {
        setSelect(newValue as TOptionSelected);
        clearError();
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Produto"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};
