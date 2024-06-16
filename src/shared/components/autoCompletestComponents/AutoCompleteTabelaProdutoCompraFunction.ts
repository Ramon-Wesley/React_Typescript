import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { UseDebounce } from "../../hook";
import { IProdutosCompras } from "../../services/api/compras/Compras";
import { useField } from "@unform/core";
import { EstoqueService } from "../../services/api/estoque/EstoqueService";
interface IAutoCompleteCities {
    isExternalLoading?: boolean;
  }
  
  type TOptionSelected = {
        id?:number;
        nome:string
  };

  export const FuncProductCompra=()=>{
    const { clearError, defaultValue=[], error, fieldName="", registerField } =
    useField("produtosCompras");
  const [optionsTable,setOptionsTable]=useState<IProdutosCompras[] >(defaultValue || []);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState<TOptionSelected | null>(null);
  const [options, setOptions] = useState<TOptionSelected[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quantidade,setQuantidade]=useState(1);
  const [precoUnitario,setPrecoUnitario]=useState(0);
  const [precoTotal,setPrecoTotal]=useState(0);
  const [valorTotalProdutos,setValorTotalProdutos]=useState(0)
  const [messageAlertProduct,setMessageAlertProduct]=useState<string | undefined> ()
  const { debounce } = UseDebounce();
  
  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => optionsTable,
      setValue: (_, newValue) => setOptionsTable(newValue),
    });
   
  }, [registerField, fieldName, optionsTable]);

  useEffect(()=>{
    setTimeout(()=>{
      setMessageAlertProduct(undefined)
    },2000)
  },[messageAlertProduct])
  const handleChangeInputDecimal = (event: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    const decimalValue = (Number(numericValue) / 100).toFixed(2) ;
    setPrecoUnitario(Number(decimalValue))
  };

  const handleDelete = (idNumber: number) => {
    setOptionsTable((prevOptions) => {
        const updatedOptions = prevOptions.filter((elemento) => elemento.produto_id !== idNumber);
        
        // Atualiza o valor total após remover o elemento
        const totalValue = updatedOptions.reduce((acc, e) => acc + e.valor, 0);
        
        // Atualiza o estado `valorTotalProdutos`
        setValorTotalProdutos(totalValue);
        // Retorna o array atualizado
   
        return updatedOptions;
    });
    console.log(optionsTable.length)
};

   
 
  

  const addServicos = () => {
  
    if (autoCompleteValue?.id && autoCompleteValue.nome ) {
      if(!optionsTable?.find((e) => e.produto_id === autoCompleteValue.id)){

   
      const newOption = {
        id: autoCompleteValue.id,
        produto_id: autoCompleteValue.id,
        nome: autoCompleteValue.nome,
        valor: precoTotal,
        valorUnitario: precoUnitario,
        quantidade: quantidade,
      };
  
      let newOptionsTable;
      if (optionsTable && optionsTable.length > 0) {
          newOptionsTable = [...optionsTable, newOption];
      } else {
        newOptionsTable = [newOption];
      }
  
      const total = newOptionsTable.reduce((cont, value) => Number(cont) + Number(value.valor), 0);
  
      setOptionsTable(newOptionsTable);
      
      setValorTotalProdutos(total);
      setSelect(null);
      setQuantidade(1);
      setPrecoUnitario(0);
      setPrecoTotal(0);
    }else{
      setMessageAlertProduct("Produto já está na lista!")
    }
  }
  };
  
  useEffect(()=>{
   
      let valor=(precoUnitario*quantidade).toFixed(2)
      setPrecoTotal(Number(valor))
    
  },[quantidade,precoUnitario])

  const handleSearch = useCallback( () => {
    setIsLoading(true);
    debounce(() => {
      try {
        EstoqueService.getAll(search, 1).then((response) => {
              setIsLoading(false);
              if (response instanceof Error) {
              } else {
                setIsLoading(false);
                setOptions(
                  response.data.map((res) => ({ id: res?.id, nome: res?.nome }))
                );
              }
            });
      } catch (error) {
       
      }
    });
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search]);

  const autoCompleteValue = useMemo(() => {
    return select ? options.find((op) => op.id === select.id) : null;
  }, [select,options]);

  const autoCompleteValueTotal = useMemo(() => {
    return valorTotalProdutos;
  }, [valorTotalProdutos]);





return{
    isLoading,
    select,
    setSearch,
    options,
    setSelect,
    clearError,
    error,
    precoTotal,
    precoUnitario,
    handleChangeInputDecimal,
    handleDelete,
    quantidade,
    setQuantidade,
    addServicos,
    optionsTable,
    autoCompleteValueTotal,
    messageAlertProduct

}
}