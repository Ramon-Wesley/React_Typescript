import { useField } from "@unform/core";
import { useEffect, useState, useMemo } from "react";
import { UseDebounce } from "../../../shared/hook";
import { CitiesService } from "../../../shared/services/api/cities/CitiesService";
import { Autocomplete, TextField } from "@mui/material";

interface IAutoCompleteCities {
  isExternalLoading: boolean;
}

interface IOptionSelected {
  id: number;
  label: string;
}
export const AutoCompleteCities: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("cidadeId");
  const [search, setSearch] = useState("");
  const [selectId, setSelectId] = useState<number | undefined>(defaultValue);
  const [options, setOptions] = useState<IOptionSelected[]>([]);
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
      value={autoCompleteValue}
      onInputChange={(_, e) => setSearch(e)}
      options={options}
      onChange={(_, e) => {
        setSelectId(e?.id);
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
