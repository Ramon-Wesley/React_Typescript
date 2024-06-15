import { useState } from "react";
import { VTextField } from "../../form/VTextField";
import { CPFFormat } from "./MasksInput";

export const CPFInput = () => {
  const [cpf, setCpf] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    const formattedValue = CPFFormat(value);
    setCpf(formattedValue);
  };

  return (
    <VTextField
      label="CPF"
      required
      variant="outlined"
      name="cpf"
      fullWidth
      value={cpf}
      onChange={handleChange}
      inputProps={{
        maxLength: 14, // Limita o comprimento do input para o formato 000.000.000-00
        inputMode: 'numeric', // Mostra o teclado numérico em dispositivos móveis
        pattern: '[0-9]*' // Aceita apenas dígitos
      }}
    />
  );
};
