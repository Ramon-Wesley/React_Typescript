import { Alert, AlertColor, Button, Icon, IconButton, LinearProgress, Pagination, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material"
import { VModal } from "../vModal/VModal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ComponentsConstants } from "../componentsConstants/ComponentesConstantes";
import { UseDebounce } from "../../hook";

import { Environment } from "../../environment/Environment";
import { VTextField } from "../../form/VTextField";
import { IProdutosCompras } from "../../services/api/compras/Compras";
import { ElderlyWoman } from "@mui/icons-material";
import { IProdutosVendas } from "../../services/api/vendas/Vendas";

export interface IRows{
    id?:number
    compra_id?:number;
    produto_id:number;
    nome:string
    quantidade:number;
    valorUnitario:number;
    valor:number
}

interface ITabela{
  isLoading?:boolean
  rows:IProdutosCompras[] | IProdutosVendas[],
  handleDelete:(idNumber:number)=>void,
  
  
}

export const TabelaProduto:React.FC<ITabela>=({isLoading=false,rows=[],handleDelete})=>{
  const idResult = useRef<number>();
  const [open, setOpen] = useState(false);
  const [typeAlert, setTypeAlert] = useState<AlertColor>();
  const [messageAlert, setMessageAlert] = useState<string>();

  const openModal = useCallback((id: number) => {
    setOpen(true);
    idResult.current = id;
  }, []);
  
  const closeModal = async() => {
    setOpen(false);
    idResult.current = undefined;
  };
const deletarRegistro=async(id:number)=>{
  setOpen(false)
  handleDelete(id)
}
  return(
    <>
    {typeAlert !== undefined && messageAlert !== undefined && (
        <Alert severity={typeAlert} >{messageAlert}</Alert>
      )}
    
      {open && (
        <VModal
          open={open}
          handleIsOpen={closeModal}
          handleOnClick={()=>{deletarRegistro(idResult.current ?? 0) }}
          icon="error_outline"
          color="warning"
          textButton="Excluir"
          title='deseja apagar o registro?'
          subTitle="excluirá permanentemente"
        />
      )}
    <TableContainer style={{ maxHeight: 200, overflow: 'auto' }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Ações</TableCell>
          <TableCell>nome</TableCell>
          <TableCell>quantidade</TableCell>
          <TableCell>precoUnitario</TableCell>
          <TableCell>precoTotal</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (

          <TableRow key={row.produto_id}>
      
            <TableCell>
              <IconButton size="small" onClick={()=>openModal(row.produto_id)}>
                <Icon>delete</Icon>
              </IconButton>
            </TableCell>
            <TableCell>{row?.nome? row.nome : row?.estoque?.nome ? row.estoque.nome : ""}</TableCell>
            <TableCell>{row.quantidade}</TableCell>
            <TableCell>{row.valorUnitario}</TableCell>
            <TableCell>{row.valor}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
      </TableFooter>
    </Table>
  </TableContainer>       
    </>
)
}