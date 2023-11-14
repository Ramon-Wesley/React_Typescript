import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DetailsTools } from "../../shared/components/detailsTools/DetailsTools";
import { LayoutBase } from "../../shared/layouts";
import { Alert, AlertColor, Box, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import { VTextField } from "../../shared/form/VTextField";
import { UseVForm } from "../../shared/form/UseVForm";
import { Form } from "@unform/web";
import {mask,unMask} from "remask"
import * as yup from "yup";

import { VModal } from "../../shared/components/vModal/VModal";
import { ComponentsConstants } from "../../shared/components/componentsConstants/ComponentesConstantes";



import { VendasService, IVenda, IProdutosVendas } from "../../shared/services/api/vendas/Vendas";
import { AutoCompleteCliente } from "../../shared/components/autoCompletestComponents/AutoCompleteCliente";
import { AutoCompleteFuncionario } from "../../shared/components/autoCompletestComponents/AutoCompleteFuncionario";
import { AutoCompleteProduto } from "../../shared/components/autoCompletestComponents/AutoCompleteProduto";
import { AutoCompleteTabelaProdutoVenda } from "../../shared/components/autoCompletestComponents/AutoCompleteTabelaProdutoVenda";


export const VendasDetail: React.FC = () => {
  type TNameAction = "save" | "saveAndClose" | "delete" | undefined;
  interface IForm extends Omit<IVenda, "id"> {}
  const { id = "nova" } = useParams<"id">();
  const [name, setName] = useState<string|number>();
  const [modalOpen, setModalOpen] = useState(false);
  const nameAction = useRef<TNameAction>();

  const { save, IsSaveAndClose, saveAndClose, formRef } = UseVForm();
  const navigate = useNavigate();
  const saveValue = useRef<IForm>();
  let anteriorValue:number[]=[] 
  const [typeAlert, setTypeAlert] = useState<AlertColor>();
  const [messageAlert, setMessageAlert] = useState<string>();


  const renderInfo = useCallback(async () => {
    const result = id !== "nova" && (await VendasService.getById(Number(id)));

      if(result instanceof Error){
        navigate("/vendas")
      }else if(typeof result === "boolean"){
        formRef.current?.setData({
         cliente:{},
         funcionario:{},
         produtos:[],
         data:Date.now().toString(),
         valorTotal:0
         })
      }else{
        formRef.current?.setData(result) && setName(result.cliente.nome);
      }
  }, [id]);

  useEffect(() => {
    renderInfo();
  }, [renderInfo]);

  useEffect(()=>{
    setTimeout(()=>{
      setMessageAlert(undefined)
      setTypeAlert(undefined)
    },2000)
  },[messageAlert,typeAlert])

  const validationInputs: yup.ObjectSchema<IForm> = yup.object().shape({
    cliente_id: yup.number().required(),
    funcionario_id: yup.number().required(),
    data:yup.string().required(),
    valorTotal:yup.number().required(),
    produtosVendas:yup.array().required()

  });
  
  const validateForm = useCallback((values: IForm) => {
  
    validationInputs
    .validate(values, { abortEarly: false })
    .then((response) => {
      setModalOpen(true);
      saveValue.current = response; 
      })
      .catch((error: yup.ValidationError) => {
        const errorsResult: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path === undefined) return;
          errorsResult[err.path] = err.message;
        });
        formRef.current?.setErrors(errorsResult);
      });
  }, []);

  const handleSave = useCallback(() => {
    if (!saveValue.current) {
      setTypeAlert("error");
      setMessageAlert("Sem dados válidos");
    } else {
      if (id !== "nova") {
        VendasService.updateById(Number(id), saveValue.current).then(
          (response) => {
            if (response instanceof Error) {
              setTypeAlert("error");
              setMessageAlert(response.message);
              closeModal()
            } else {
              if (IsSaveAndClose()) {
                navigate("/vendas", {
                  state: {
                    message: ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION,
                    type: "success",
                  },
                });
              } else {
                closeModal();
              }
            }
          }
        );
      } else {
        VendasService.create(saveValue.current).then((response) => {
          if (response instanceof Error) {
            setTypeAlert("error");
            setMessageAlert(response.message);
            closeModal()
          } else {
            if (IsSaveAndClose()) {
              navigate(`/vendas`, {
                state: {
                  message: ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION,
                  type: "success",
                },
              });
            } else {
              navigate(`/vendas/detalhe/${response}`);
            }
          }
        });
      }
    }
  }, []);

  const handleDelete = useCallback((id: number) => {
    VendasService.deleteById(id).then((response) => {
      if (response instanceof Error) {
        navigate("/vendas", {
          state: {
            message: ComponentsConstants.MESSAGE_ERROR_DELETE,
            type: "error",
          },
        });
      } else {
        navigate("/vendas", {
          state: {
            message: ComponentsConstants.MESSAGE_SUCCESS_DELETE,
            type: "success",
          },
        });
      }
    });
  }, []);

  const openModal = useCallback((name: TNameAction) => {
    nameAction.current = name;
    if (name === "save") {
      save();
      return;
    }
    if (name === "saveAndClose") {
      saveAndClose();
      return;
    }

    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    nameAction.current = undefined;
    saveValue.current = undefined;
  }, []);

  return (
    <LayoutBase
    
      title={id === "nova" ? "Cadastro de vendas" : name  ? name : ""}
      tools={
        <DetailsTools
          onclickSave={() => openModal("save")}
          onclickSaveAndBack={() => openModal("saveAndClose")}
          onclickDelete={() => openModal("delete")}
          onclickBack={() => navigate("/vendas")}
          onclickNew={() => navigate("/vendas/detalhe/nova")}
        />
      }
    >
      {typeAlert !== undefined && messageAlert !== undefined && (
        <Alert severity={typeAlert}>{messageAlert}</Alert>
      )}

      <VModal
        handleIsOpen={closeModal}
        handleOnClick={
          nameAction.current === "saveAndClose"
            ? handleSave
            : nameAction.current === "save"
            ? handleSave
            : nameAction.current === "delete"
            ? () => handleDelete(Number(id))
            : () => undefined
        }
        color={nameAction.current === "delete" ? "warning" : "success"}
        open={modalOpen}
        icon={
          nameAction.current === "delete" ? "error_outline" : "help_outline"
        }
        textButton={nameAction.current === "delete" ? "Excluir" : "Cadastrar"}
        title={
          nameAction.current === "delete"
            ? "deseja apagar o registro?"
            : "Deseja salvar o registro?"
        }
        subTitle={
          nameAction.current === "delete" ? "excluirá permanentemente" : ""
        }
      />
      <Form ref={formRef} onSubmit={validateForm}>
        <Box
          component={Paper}
          margin={1}
          display="flex"
          flexDirection="column"
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid item>
        <Typography>Todos os campos com <span style={{color:"red"}}>*</span> são obrigatorios!</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{fontWeight:"bolder"}}>Cliente</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
            
                  <AutoCompleteCliente/>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{fontWeight:"bolder"}}>Funcionario</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
                  <AutoCompleteFuncionario/>
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                  name="data"
                  type="date"
                  label="Data"
                  />
                  </Grid>
            </Grid>
            <Grid item>
            <Typography variant="h6" style={{fontWeight:"bolder"}} >Produto</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
            <AutoCompleteTabelaProdutoVenda/>
            </Grid>

          </Grid>
        </Box>
        
 
      </Form>
    </LayoutBase>
  );
};
