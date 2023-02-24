import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "@unform/core";
import { useEffect, useState } from "react";

type IVTextField = TextFieldProps & {
  name: string;
};

export const VTextField: React.FC<IVTextField> = ({ name, ...rest }) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField(name);
  const [value, setValue] = useState(defaultValue || "");

  useEffect(() => {
    registerField({
      name: fieldName,
      setValue: (_, newValue) => setValue(newValue),
      getValue: () => value,
    });
  }, [registerField, fieldName, value]);

  return (
    <TextField
      {...rest}
      error={!!error}
      helperText={error}
      value={value}
      onKeyDown={(e) => {
        error && clearError();
        rest.onKeyDown?.(e);
      }}
      onChange={(e) => {
        setValue(e.target.value);
        rest.onChange?.(e);
      }}
    />
  );
};
