import React, { useState } from "react";
import { VTextField } from "../../form/VTextField";
import { CNPJFormat } from "./MasksInput"; // Importe a função CNPJFormat

export const CNPJInput = () => {
  const [cnpj, setCnpj] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    const formattedValue = CNPJFormat(value);
    setCnpj(formattedValue);
  };

  return (
    <VTextField
      label="Cnp"
      required
      variant="outlined"
      name="cnpj"
      fullWidth
      value={cnpj}
      onChange={handleChange}
      inputProps={{
        maxLength: 18, // Limita o comprimento do input para o formato 00.000.000/0000-00
        inputMode: 'numeric', // Mostra o teclado numérico em dispositivos móveis
        pattern: '[0-9]*' // Aceita apenas dígitos
      }}
    />
  );
};
