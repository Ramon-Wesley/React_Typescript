import { useField } from "@unform/core";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { UseDebounce } from "../../../shared/hook";
import {
  CitiesService,
  ICities,
} from "../../../shared/services/api/cities/CitiesService";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

interface IAutoCompleteCities {
  isExternalLoading?: boolean;
}

type TOptionSelected = {
  id: number;
  label: string;
};
export const AutoCompleteCities: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("cidadeId");
  const [search, setSearch] = useState("");
  const [selectId, setSelectId] = useState<number | undefined>(defaultValue);
  const [options, setOptions] = useState<TOptionSelected[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [firstTime, setFirstTime] = useState(false);
  const { debounce } = UseDebounce();

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectId,
      setValue: (_, newValue) => setSelectId(newValue),
    });
  }, [registerField, fieldName, selectId]);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    debounce(() => {
      try {
        setIsLoading(true);
        selectId && selectId > 4 && !firstTime
          ? CitiesService.getById(selectId).then((response) => {
              if (response instanceof Error) {
              } else {
                setIsLoading(false);
                setOptions([{ id: response.id, label: response.nome }]);
              }
            })
          : CitiesService.getAll(search, 1).then((response) => {
              setIsLoading(false);
              if (response instanceof Error) {
              } else {
                setIsLoading(false);
                setOptions(
                  response.data.map((res) => ({ id: res.id, label: res.nome }))
                );
              }
            });
        setFirstTime(true);
      } catch (error) {
        console.log(error);
      }
    });
  }, [search, selectId]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const autoCompleteValue = useMemo(() => {
    return selectId ? options.find((op) => op.id === selectId) : null;
  }, [selectId, options]);

  return (
    <Autocomplete
      loadingText="Carregando..."
      loading={isLoading}
      disabled={isExternalLoading}
      popupIcon={
        isLoading || isExternalLoading ? <CircularProgress size={26} /> : ""
      }
      openText="Abrir"
      closeText="Fechar"
      noOptionsText="Sem op????es"
      clearText="Apagar"
      disablePortal
      value={autoCompleteValue}
      onInputChange={(_, newValue) => setSearch(newValue)}
      options={options}
      onChange={(_, newValue) => {
        setSelectId(newValue?.id);
        setSearch("");
        clearError();
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Cidade"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};
