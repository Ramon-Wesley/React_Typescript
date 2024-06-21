
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { UseDebounce } from "../../hook";

import { useField } from "@unform/core";
import { EstoqueService } from "../../services/api/estoque/EstoqueService";
import { IProdutosVendas } from "../../services/api/vendas/Vendas";

interface IAutoCompleteCities {
    isExternalLoading?: boolean;
  }
  
  type TOptionSelected = {
        id?:number;
        produto_id:number
        nome:string;
        valor:number;
        quantidade:number
  };
  export const ProdutoVendaFunc = () => {
    const { clearError, defaultValue, error, fieldName, registerField } =
      useField("produtosVendas");
    const [optionsTable,setOptionsTable]=useState<IProdutosVendas[]>(defaultValue as IProdutosVendas[]);
    const [search, setSearch] = useState("");
    const [optionsTableDelete,setOptionsTableDelete]=useState<number[]>([]);
    const [messageAlertProduct,setMessageAlertProduct]=useState<string | undefined> ()
    const [select, setSelect] = useState<TOptionSelected | null>(null);
    const [options, setOptions] = useState<TOptionSelected[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [quantidade,setQuantidade]=useState(1);
    const [precoTotal,setPrecoTotal]=useState(0);
    const [valorTotalProdutos,setValorTotalProdutos]=useState(0)
    const { debounce } = UseDebounce();
  
    useEffect(() => {
      registerField({
        name: fieldName,
        getValue: () => optionsTable,
        setValue: (_, newValue) => setOptionsTable(newValue ),
      });
       }, [registerField, fieldName, optionsTable]);
   

       useEffect(()=>{
        setTimeout(()=>{
          setMessageAlertProduct(undefined)
        },2000)})
   // const handleDelete=useCallback((idNumber:number)=>{
   
     // optionsTable.filter((e)=>{
       // if (e.produto_id === idNumber){
       // optionsTableDelete[e.produto_id]=e.quantidade;
     // }})
  
     // setOptionsTable((e)=>{
       // return e.filter((f)=> f.produto_id !== idNumber)
      // })
  
     // const totalValue=optionsTable.reduce((total,value)=>{return total+value.valor},0)
      //setValorTotalProdutos(totalValue)
    
   // },[])
   const handleDelete=(idNumber:number)=>{
    setOptionsTable((prevOptions) => {
      const updatedOptions = prevOptions.filter((elemento) => elemento.produto_id !== idNumber);
      
      // Atualiza o valor total após remover o elemento
      const totalValue = updatedOptions.reduce((acc, e) => Number(acc) + Number(e.valor), 0);
      
      // Atualiza o estado `valorTotalProdutos`
      setValorTotalProdutos(totalValue);
      // Retorna o array atualizado
  
      return updatedOptions;
  });
    
    
  }
    
    const addServicos = () => {
  
        if (autoCompleteValue?.id && autoCompleteValue.nome ) {
          if(!optionsTable?.find((e) => e.produto_id === autoCompleteValue.id)){
          const newOption = {
            id: autoCompleteValue.id,
            produto_id: autoCompleteValue.id,
            nome: autoCompleteValue.nome,
            valor: precoTotal,
            valorUnitario: autoCompleteValue.valor,
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
          setPrecoTotal(0);
        }else{
          setMessageAlertProduct("Produto já está na lista!")
        }
      }
      };
    useEffect(()=>{
      if(autoCompleteValue?.valor){
        setPrecoTotal(autoCompleteValue?.valor * quantidade)
      }
    },[quantidade])
  
    const handleSearch = useCallback( () => {
      setIsLoading(true);
      debounce(() => {
        try {
          EstoqueService.getAll(search, 1).then((response) => {
                setIsLoading(false);
                if (response instanceof Error) {
                } else {
                  setIsLoading(false);
                  
               // response.data.filter((res)=>  !optionsTable.find((f)=>f.produto_id === res.id) )
                  setOptions(
                    response.data.map((res) => ({ id: res?.id, nome: res?.nome,quantidade:res.quantidade,valor:res.valor ,produto_id:res.id}))
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
      if(select && select.produto_id){
        if(optionsTableDelete.length > 0 && optionsTableDelete[select.produto_id]){
          options.forEach((op,index) => {
            if(optionsTableDelete[op.produto_id]){
              op.quantidade+=optionsTableDelete[op.produto_id]
             optionsTableDelete[op.produto_id]=0
            }
          })
        }
      }
  
      setQuantidade(1);
      setPrecoTotal(0);
      
      return select ? options.find((op) => op.id === select.id) : null;  
    }, [select,options]);
  
    const autoCompleteValueTotal = useMemo(() => {
      return valorTotalProdutos.toFixed(2);
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
        handleDelete,
        quantidade,
        setQuantidade,
        addServicos,
        optionsTable,
        autoCompleteValueTotal,
        messageAlertProduct,
        autoCompleteValue,
        valorTotalProdutos
    
    }
}  