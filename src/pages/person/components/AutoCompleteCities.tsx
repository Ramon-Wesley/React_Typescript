import { useField } from "@unform/core";
import { useEffect, useState, useMemo } from "react";
import { UseDebounce } from "../../../shared/hook";
import { CitiesService } from "../../../shared/services/api/cities/CitiesService";
import { Autocomplete, TextField } from "@mui/material";

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
  const [selectId, setSelectId] = useState<number | undefined>();
  const [options, setOptions] = useState<TOptionSelected[]>([]);
  const { debounce } = UseDebounce();

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectId,
      setValue: (_, newValue) => setSelectId(newValue),
    });
  }, []);

  useEffect(() => {
    debounce(() => {
      CitiesService.getAll(search, 1).then((response) => {
        if (response instanceof Error) {
        } else {
          setOptions(
            response.data.map((res) => ({ id: res.id, label: res.nome }))
          );
        }
      });
    });
  }, [search]);

  const autoCompleteValue = useMemo(() => {
    if (!selectId) return null;
    const result = options.find((op) => op.id === selectId);
    if (!result) return null;
    return result;
  }, [selectId, options]);

  return (
    <Autocomplete
      openText="Abrir"
      closeText="Fechar"
      noOptionsText="Sem opções"
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
