import  { ChangeEvent, useState } from 'react';
import { VTextField } from '../../form/VTextField';

interface formatNumberName{
    name:string
    label:string
}
export const DecimalInput: React.FC<formatNumberName> = ({name,label}) => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    const decimalValue = (Number(numericValue) / 100).toFixed(2);
    setValue(decimalValue);
  };

  return (
    <VTextField
      label={label}
      value={value}
      name={name}
      fullWidth
      onChange={handleChange}
      variant="outlined"
      InputProps={{
        inputProps: {
          inputMode: 'numeric',
        },
      }}
    />
  )

};

