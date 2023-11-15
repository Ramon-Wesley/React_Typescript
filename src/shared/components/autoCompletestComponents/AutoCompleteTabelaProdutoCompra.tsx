import { useField } from "@unform/core";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { UseDebounce } from "../../hook";
import { Autocomplete, TextField, CircularProgress, Grid, Button } from "@mui/material";
import { EstoqueService, IEstoques } from "../../services/api/estoque/EstoqueService";
import { IProdutosCompras } from "../../services/api/compras/Compras";
import { VTextField } from "../../form/VTextField";
import { TabelaProduto } from "../table/TabelaProdutos";

interface IAutoCompleteCities {
  isExternalLoading?: boolean;
}

type TOptionSelected = {
      id?:number;
      nome:string
};
export const AutoCompleteTabelaProdutoCompra: React.FC<IAutoCompleteCities> = ({
  isExternalLoading = false,
}) => {
  const { clearError, defaultValue, error, fieldName, registerField } =
    useField("produtosCompras");
  const [optionsTable,setOptionsTable]=useState<IProdutosCompras[] >(defaultValue);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState<TOptionSelected>();
  const [options, setOptions] = useState<TOptionSelected[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quantidade,setQuantidade]=useState(1);
  const [precoUnitario,setPrecoUnitario]=useState(0);
  const [precoTotal,setPrecoTotal]=useState(0);
  const [valorTotalProdutos,setValorTotalProdutos]=useState(0)
  const { debounce } = UseDebounce();

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => optionsTable,
      setValue: (_, newValue) => setOptionsTable(newValue),
    });
   
  }, [registerField, fieldName, optionsTable]);

  const handleDelete=(idNumber:number)=>{

    let totalValue=0
   optionsTable.forEach((e,index)=>{
      if (e.produto_id !== idNumber){
        totalValue+=e.valor
    }  
 })
 setOptionsTable((e)=>{
   return e.filter((f)=> f.produto_id !== idNumber)
 })
 setValorTotalProdutos(totalValue)
 
   
 }
   
 
  

  const addServicos = () => {
  
    if (autoCompleteValue?.id && autoCompleteValue.nome && !optionsTable?.find((e) => e.produto_id === autoCompleteValue.id)) {
     
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
  
      const total = newOptionsTable.reduce((cont, value) => cont + value.valor, 0);
  
      setOptionsTable(newOptionsTable);
      
      setValorTotalProdutos(total);
      setSelect({ nome: "", id: undefined });
      setQuantidade(1);
      setPrecoUnitario(0);
      setPrecoTotal(0);
    }
  };
  
  useEffect(()=>{
    if(precoUnitario !== 0){
      setPrecoTotal(precoUnitario * quantidade)
    }
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
                  value={precoUnitario}
                  type="number"
                  onChange={(e)=>setPrecoUnitario(parseFloat(e.target.value) )}
                  label="Preco unitario"
                  error={!!error}
                  helperText={error}
                  inputProps={{
                    min: 0, 
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
            min: 0,
            readOnly: true,
          }}
            value={autoCompleteValueTotal}          
          />
        </Grid>
      </>
  );
};

