import { SearchTools } from "../../shared/components/searchTools/SearchTools";
import { LayoutBase } from "../../shared/layouts";

import {
  Alert,
  AlertColor,
  TableContainer,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableFooter,
  TableRow,
  LinearProgress,
  Pagination,
  IconButton,
  Icon,
} from "@mui/material";
import { useSearchParams, useNavigate,useLocation } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { UseDebounce } from "../../shared/hook";
import { Environment } from "../../shared/environment/Environment";
import { VModal } from "../../shared/components/vModal/VModal";
import { ComponentsConstants } from "../../shared/components/componentsConstants/ComponentesConstantes";
import { VendasService, IVenda, IVendaResult } from "../../shared/services/api/vendas/Vendas";

export const Vendas: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const idResult = useRef<number>();
  const navigate = useNavigate();
  const [rows, setRows] = useState<IVendaResult[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [typeAlert, setTypeAlert] = useState<AlertColor>();
  const [messageAlert, setMessageAlert] = useState<string>();

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
  
  const handleDelete = useCallback(() => {
    setOpen(false);
    if (idResult.current) {
      VendasService.deleteById(idResult.current).then((response) => {
        if (response instanceof Error) {
          setTypeAlert("error");
          setMessageAlert(response.message);
        } else {
          setRows((oldSetRows) => {
            return [...oldSetRows.filter((row) =>row.id !== idResult.current)];});
          setTypeAlert("success");
          setMessageAlert("Cadastro apagado com sucesso");
        }
      });
    }
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

  const { debounce } = UseDebounce();
  useEffect(() => {
    setIsLoading(true);
    debounce(() => {

      VendasService.getAll(getSearch, getPage).then((response) => {
        setIsLoading(false);
        if (response instanceof Error) {
          setMessageAlert(response.message);
          setTypeAlert('error')
        } else {
          setRows(response.data);
          setCount(response.totalCount);
        }
      });
    });
  }, [getSearch, getPage]);

 
  return (
    <LayoutBase
      title="Venda"
      tools={
        <SearchTools
          textButton="Nova"
          onclickButton={()=>navigate('/vendas/detalhe/nova')}
          onchangeInput={(e) =>
            setSearchParams({ busca: e, pagina: "1" }, { replace: true })
          }
          valueTextInput={searchParams.get("busca") ?? ""}
        />
      }

    >

      {typeAlert !== undefined && messageAlert !== undefined && (
        <Alert severity={typeAlert} >{messageAlert}</Alert>
      )}

      {open && (
        <VModal
          open={open}
          handleIsOpen={closeModal}
          handleOnClick={handleDelete}
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
              <TableCell>Cliente</TableCell>
              <TableCell>Funcionario</TableCell>
              <TableCell>data</TableCell>
              <TableCell>Valor total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <IconButton size="small" onClick={() => openModal(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/vendas/detalhe/${row.id}`)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{row.cliente.nome}</TableCell>
                <TableCell>{row.funcionario.nome}</TableCell>
                <TableCell>{row.data.substring(0,10)}</TableCell>
                <TableCell>{row.valorTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5}>{<LinearProgress />}</TableCell>
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
    </LayoutBase>
  );
};
