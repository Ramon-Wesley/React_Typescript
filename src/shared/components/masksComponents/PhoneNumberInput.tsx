import { useState } from "react";
import { VTextField } from "../../form/VTextField";
import { PhoneNumberFormat } from "./MasksInput";

export const PhoneNumberInput = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    const formattedValue = PhoneNumberFormat(value);
    setPhoneNumber(formattedValue);
  };
  return (
    <VTextField
      label="Telefone"
      required
      variant="outlined"
      name="telefone"
      fullWidth
      value={phoneNumber}
      onChange={handleChange}
      inputProps={{ maxLength: 15,
      inputMode: 'numeric', // Mostra o teclado numérico em dispositivos móveis
      pattern: '[0-9]*'
      }}
    />
  );
}