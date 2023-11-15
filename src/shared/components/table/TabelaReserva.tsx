import { Alert, AlertColor, Button, Icon, IconButton, LinearProgress, Pagination, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { VModal } from "../vModal/VModal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ComponentsConstants } from "../componentsConstants/ComponentesConstantes";
import { UseDebounce } from "../../hook";

import { Environment } from "../../environment/Environment";
import { VTextField } from "../../form/VTextField";

export interface IRowsReserva{
  id:number;
  servico:string;
  data:string;
  valor:number;
}

interface ITabela{
  isLoading?:boolean
  rows:IRowsReserva[],
  handleDelete:(idNumber:number)=>void
}

export const TabelaReserva:React.FC<ITabela>=({isLoading=false,rows,handleDelete})=>{


  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const idResult = useRef<number>();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [typeAlert, setTypeAlert] = useState<AlertColor>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const [precoTotal,setPrecoTotal]=useState<number>(0);
  const location=useLocation();
  
  const getSearch = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);
  
  const getPage = useMemo(() => {
    return Number(searchParams.get("pagina") || 1);
  }, [searchParams]);

  const openModal = useCallback((id: number) => {
    setOpen(true);
    idResult.current = id;
  }, []);
  
  const closeModal = useCallback(() => {
    setOpen(false);
    idResult.current = undefined;
  }, []);
  
  useEffect(()=>{
    if(location.state){
      setMessageAlert(location.state.message)
      setTypeAlert(location.state.type)
    }
  },[])

  useEffect(() => {
    if (typeAlert && messageAlert) {
      setTimeout(() => {
        setTypeAlert(undefined);
        setMessageAlert(undefined);
      }, ComponentsConstants.ALERT_TIME);
    }
  }, [typeAlert, messageAlert]);

  return(
    <>
      {typeAlert !== undefined && messageAlert !== undefined && (
        <Alert severity={typeAlert} >{messageAlert}</Alert>
      )}
    
      {open && (
        <VModal
          open={open}
          handleIsOpen={closeModal}
          handleOnClick={()=>{handleDelete(idResult.current ?? 0) }}
          icon="error_outline"
          color="warning"
          textButton="Excluir"
          title='deseja apagar o registro?'
          subTitle="excluirá permanentemente"
        />
      )}
    <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Ações</TableCell>
          <TableCell>servico</TableCell>
          <TableCell>data</TableCell>
          <TableCell>valor</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (

          <TableRow key={row.id}>
      
            <TableCell>
              <IconButton size="small" onClick={() => openModal(row.id)}>
                <Icon>delete</Icon>
              </IconButton>
            </TableCell>
            <TableCell>{row.servico}</TableCell>
            <TableCell>{row.data}</TableCell>
            <TableCell>{row.valor}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={4}>{<LinearProgress />}</TableCell>
          </TableRow>
        )}
        {count > Environment.LINES_LIMITS && (
          <TableRow>
            <TableCell colSpan={4}>
              <Pagination
                page={getPage}
                count={Math.ceil(count / Environment.LINES_LIMITS)}
                onChange={(_, newPage) =>
                  setSearchParams(
                    { busca: getSearch, pagina: newPage.toString() },
                    { replace: true }
                  )
                }
              />
            </TableCell>
          </TableRow>
        )}
      </TableFooter>
    </Table>
  </TableContainer>
 
        </>
)
}