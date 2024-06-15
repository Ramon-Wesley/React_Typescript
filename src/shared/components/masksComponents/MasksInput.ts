
export const PhoneNumberFormat=(phoneNumber:string)=> {
  const regex = /^(\d{2})(\d{5})(\d{4})$/;
  return phoneNumber.replace(regex, '($1) $2-$3');
}

  export const CPFFormat = (cpf: string): string => {
    const regex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
    return cpf.replace(regex, '$1.$2.$3-$4');
  };
  
  export function CNPJFormat(cnpj: string): string {
    const cleaned = cnpj.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
  
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
    }
  
    return cleaned;
  }
  