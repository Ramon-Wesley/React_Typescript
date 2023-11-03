const CpfRegex = (cpf:string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
}

const TelefoneRegex = (telefone:string) => {

    return telefone.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
  
}


export const Mascaras={
  CpfRegex,
  TelefoneRegex
}
