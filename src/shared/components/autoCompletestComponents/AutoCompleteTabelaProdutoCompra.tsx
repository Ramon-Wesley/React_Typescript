import { useField } from "@unform/core";
import { useEffect, useState, useMemo, useCallback, useRef, ChangeEvent } from "react";
import { UseDebounce } from "../../hook";
import { Autocomplete, TextField, CircularProgress, Grid, Button, Alert } from "@mui/material";
import { EstoqueService, IEstoques } from "../../services/api/estoque/EstoqueService";
import { IProdutosCompras } from "../../services/api/compras/Compras";
import { VTextField } from "../../form/VTextField";
import { TabelaProduto } from "../table/TabelaProdutos";
import { FuncProductCompra } from "./AutoCompleteTabelaProdutoCompraFunction";


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
const {messageAlertProduct,isLoading,select,setSearch,options,setSelect,clearError,error,precoTotal,precoUnitario,handleChangeInputDecimal,handleDelete,quantidade,setQuantidade,addServicos,optionsTable,autoCompleteValueTotal}=FuncProductCompra()

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
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={select}
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
        error={!!error||!!messageAlertProduct}
        helperText={error||messageAlertProduct}
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
                  onChange={handleChangeInputDecimal}
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

