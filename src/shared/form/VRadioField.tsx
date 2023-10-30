import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useField } from "@unform/core";
import { useEffect, useMemo, useState } from "react";

type VRadioGroupProps = {
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
};

export const VRadioGroup: React.FC<VRadioGroupProps> = ({ name, onChange }) => {
  const { fieldName, registerField, defaultValue } = useField(name);
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      setValue: (_, newValue) => {
        setValue(newValue);
      },
      getValue: () => {
        return value;
      },
    });
    console.log(value)
  }, [registerField, fieldName,value]);
const valorAtual=useMemo(()=>{
  return value
},[value])
  return (
    <RadioGroup
      name={name}
      row
      value={valorAtual?valorAtual:"masculino"}
      onChange={(e) => {
        setValue(e.target.value);
        onChange?.(e, e.target.value);
      }}
    >
      <FormControlLabel value="feminino" control={<Radio />} label="Feminino" />
      <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
      <FormControlLabel value="outros" control={<Radio />} label="Outros" />
    </RadioGroup>
  );
};
