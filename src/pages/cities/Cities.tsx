import { SearchTools } from "../../shared/components/searchTools/SearchTools";
import { LayoutBase } from "../../shared/layouts";
import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import {
  CitiesService,
  ICities,
} from "../../shared/services/api/cities/CitiesService";
import {
  Pagination,
  Table,
  TableBody,
  LinearProgress,
  TableCell,
  TableFooter,
  TableContainer,
  AlertColor,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Icon,
  Alert,
} from "@mui/material";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Environment } from "../../shared/environment/Environment";
import { VModal } from "../../shared/components/vModal/VModal";
import { UseDebounce } from "../../shared/hook";
import { ComponentsConstants } from "../../shared/components/componentsConstants/ComponentesConstantes";

export const Citie: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [cities, setCities] = useState<ICities[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsloading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [typeAlert, setTypeAlert] = useState<AlertColor>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const idResult = useRef<number>();
  const location = useLocation();
  const { debounce } = UseDebounce();
  const getCitiesAll = useCallback(() => {
    setIsloading(true);
    debounce(() => {
      CitiesService.getAll(getSearchParams, getPageParams).then((result) => {
        if (result instanceof Error) {
          alert("não foi possivel carregar");
        } else {
          setIsloading(false);
          setCities(result.data);
          setCount(result.count);
        }
      });
    });
  }, [params]);

  useEffect(() => {
    getCitiesAll();
  }, [getCitiesAll]);
  useEffect(() => {
    if (location.state) {
      setMessageAlert(location.state.message);
      setTypeAlert(location.state.type);
    }
  }, []);

  useEffect(() => {
    if (typeAlert && messageAlert) {
      setTimeout(() => {
        setTypeAlert(undefined);
        setMessageAlert(undefined);
      }, ComponentsConstants.ALERT_TIME);
    }
  }, [typeAlert, messageAlert]);

  const getSearchParams = useMemo(() => {
    return params.get("busca")?.toString() || "";
  }, [params]);
  const getPageParams = useMemo(() => {
    return Number(params.get("pagina")) || 1;
  }, [params]);

  const openModal = useCallback((id: number) => {
    idResult.current = id;
    setIsOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
    idResult.current = undefined;
  }, []);
  const handleDelete = useCallback(() => {
    setIsOpen(false)
    if (idResult.current) {
      CitiesService.deleteById(idResult.current).then((response) => {
        if (response instanceof Error) {
          setTypeAlert("error");
          setMessageAlert(ComponentsConstants.MESSAGE_ERROR_DELETE);
        } else {
            setCities((oldCities)=>{
              return[...oldCities.filter((city)=>city.id !== idResult.current)]
            })
          setTypeAlert("success");
          setMessageAlert(ComponentsConstants.MESSAGE_SUCCESS_DELETE);
        }
      });
    }
  }, []);
  return (
    <LayoutBase
      tools={
        <SearchTools
          onchangeInput={(newValue) =>
            setParams({ busca: newValue.toString() }, { replace: true })
          }
          onclickButton={() => navigate("/cidades/detalhe/nova")}
          textButton="Nova"
          valueTextInput={params.get("busca")?.toString()}
        />
      }
      title="Cidades"
    >
      {typeAlert !== undefined && messageAlert !== undefined && (
        <Alert severity={typeAlert}>{messageAlert}</Alert>
      )}
      {isOpen && (
        <VModal
          color="warning"
          handleIsOpen={closeModal}
          textButton="Excluir"
          handleOnClick={handleDelete}
          open={isOpen}
          icon="error_outline"
          title="deseja apagar o registro?"
          subTitle="excluirá permanentemente"
        />
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ações</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableHead>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3}>
                <LinearProgress />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && (
            <>
              <TableBody>
                {cities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => openModal(city.id)}
                      >
                        <Icon>delete</Icon>
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/cidades/detalhe/${city.id}`)}
                      >
                        <Icon>edit</Icon>
                      </IconButton>
                    </TableCell>
                    <TableCell>{city.nome}</TableCell>
                    <TableCell colSpan={4}></TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Pagination
                      page={getPageParams}
                      count={Math.ceil(count / Environment.LINES_LIMITS)}
                      onChange={(_, newValue) => {
                        setParams(
                          {
                            busca: getSearchParams,
                            pagina: newValue.toString(),
                          },
                          { replace: true }
                        );
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </>
          )}
        </Table>
      </TableContainer>
    </LayoutBase>
  );
};
