import {setLocale} from 'yup';




setLocale({
    mixed: {
      default: () => 'Campo inválido',
      required: () => 'Campo obrigatório',
      oneOf: ({ values }) => `Deve ser um dos seguintes valores: ${values}`,
      notOneOf: ({ values }) => `Não pode ser um dos seguintes valores: ${values}`,
    },
    string: {
      length: ({ length }) => `Deve ter exatamente ${length} caracteres`,
      min: ({ min }) => `Deve ter pelo menos ${min} caracteres`,
      max: ({ max }) => `Deve ter no máximo ${max} caracteres`,
      email: () => 'Email inválido',
      url: () => 'URL inválida',
      trim: () => 'Não deve conter espaços no início ou no final',
      lowercase: () => 'Deve estar em minúsculas',
      uppercase: () => 'Deve estar em maiúsculas',
    },
    number: {
      min: ({ min }) => `Deve ser no mínimo ${min}`,
      max: ({ max }) => `Deve ser no máximo ${max}`,
      lessThan: ({ less }) => `Deve ser menor que ${less}`,
      moreThan: ({ more }) => `Deve ser maior que ${more}`,
    
      positive: () => 'Deve ser um número positivo',
      negative: () => 'Deve ser um número negativo',
      integer: () => 'Deve ser um número inteiro',
    },
    date: {
      min: ({ min }) => `Deve ser posterior a ${min}`,
      max: ({ max }) => `Deve ser anterior a ${max}`,
    },
    array: {
      min: ({ min }) => `Deve ter pelo menos ${min} itens`,
      max: ({ max }) => `Deve ter no máximo ${max} itens`,
    },
  });