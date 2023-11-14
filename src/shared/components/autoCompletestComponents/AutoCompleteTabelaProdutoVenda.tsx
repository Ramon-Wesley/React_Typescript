import { useField } from "@unform/core";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { UseDebounce } from "../../hook";
import { Autocomplete, TextField, CircularProgress, Grid, Button } from "@mui/material";
import { EstoqueService, IEstoques } from "../../services/api/estoque/EstoqueService";
import { IProdutosVendas } from "../../services/api/vendas/Vendas";
import { VTextField } from "../../form/VTextField";
import { TabelaProduto } from "../table/TabelaProdutos";

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
export const AutoCompleteTabelaProdutoVenda: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("produtosVendas");
  const [optionsTable,setOptionsTable]=useState<IProdutosVendas[]>(defaultValue as IProdutosVendas[]);
  const [search, setSearch] = useState("");
  const [optionsTableDelete,setOptionsTableDelete]=useState<number[]>([]);
 
  const [select, setSelect] = useState<TOptionSelected>();
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
   console.log("idNumber"+idNumber)
   let totalValue=0
  optionsTable.forEach((e,index)=>{
     if (e.produto_id === idNumber){
     optionsTableDelete[e.produto_id]=e.quantidade;
   } else{
    totalValue+=e.valor
  
  }  
})
setOptionsTable((e)=>{
  return e.filter((f)=> f.produto_id !== idNumber)
})
setValorTotalProdutos(totalValue)

  

  
}
  
  
const addServicos = () => {
    if (autoCompleteValue?.id && autoCompleteValue.nome && !optionsTable?.find((e) => e.produto_id === autoCompleteValue.produto_id)) {
     
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
  
      const total = newOptionsTable.reduce((cont, value) => cont + value.valor, 0);
      console.log(newOptionsTable)
      setOptionsTable(newOptionsTable);
      setValorTotalProdutos(total);
      setSelect({ nome: "", id: undefined, produto_id:0,quantidade:0,valor:0});
      setQuantidade(1);
      setPrecoTotal(0);
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
        console.log(error);
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
    
  }, [select]);

  const autoCompleteValueTotal = useMemo(() => {
    return valorTotalProdutos;
  }, [valorTotalProdutos]);

  return (
    <>
    <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>

    <Autocomplete
      loadingText="Carregando..."
      loading={isLoading}
      disabled={isExternalLoading}
      popupIcon={
        isLoading || isExternalLoading ? <CircularProgress size={26} /> : ""
      }
      getOptionLabel={(e)=>e.nome}
      openText="Abrir"
      closeText="Fechar"
      noOptionsText="Sem opções"
      clearText="Apagar"
      disablePortal
      value={autoCompleteValue}
      onInputChange={(_, newValue) => setSearch(newValue)}
      options={options}
      onChange={(_, newValue) => {
        setSelect(newValue as TOptionSelected);
        clearError();
      }}
      renderInput={(params) => (
        <TextField
        {...params}
        label="Produto"
        error={!!error}
        helperText={error}
        />
        )}
        />

        </Grid>

<Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                  <TextField
                  required
                  focused
                  value={autoCompleteValue?.valor}
                  type="number"
                  label="Preco unitario"
                  error={!!error}
                  helperText={error}
                  inputProps={{
                    min: 0, 
                    readOnly:true
                  }}
                  fullWidth
                  />
          </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
        <TextField
        required
        focused
        value={quantidade}
        type="number"
        label="quantidade"
        inputProps={{
          min: 1, 
          max:autoCompleteValue?.quantidade
        }}
        onChange={(e)=>setQuantidade(parseInt(e.target.value) )}
        error={!!error}
        helperText={error}
        fullWidth
        />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
        <TextField
        required
        focused
        type="number"
        value={precoTotal}
        inputProps={{
          min: 0, 
          readOnly: true
        }}
        label="Preco Total"
        error={!!error}
        helperText={error}
        fullWidth
        />
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
        <Button variant="contained" onClick={addServicos}>Adicionar</Button>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

        <TabelaProduto
        rows={optionsTable}
      
        handleDelete={handleDelete}
        />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
          <VTextField
          name="valorTotal"
          label="Valor Total"
          inputProps={{
            min: 0
          }}
            value={valorTotalProdutos}
                      
          />
        </Grid>
      </>
  );
};

