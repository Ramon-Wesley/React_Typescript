import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DetailsTools } from "../../shared/components/detailsTools/DetailsTools";
import { LayoutBase } from "../../shared/layouts";
import { Alert, AlertColor, Box, Button, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";

import { VTextField } from "../../shared/form/VTextField";
import { UseVForm } from "../../shared/form/UseVForm";
import { Form } from "@unform/web";
import * as yup from "yup";
import {  AutoCompleteProduto } from "../../shared/components/autoCompletestComponents/AutoCompleteProduto";
import { VModal } from "../../shared/components/vModal/VModal";
import { ComponentsConstants } from "../../shared/components/componentsConstants/ComponentesConstantes";
import { ServicoService, IServicos } from "../../shared/services/api/servico/ServicoService";

export const ServicoDetail: React.FC = () => {
  type TNameAction = "save" | "saveAndClose" | "delete" | "saveProduto" |undefined;
  interface IForm extends Omit<IServicos,"id"> {}
  const { id = "nova" } = useParams<"id">();
  const [name, setName] = useState<string>();
  const [modalOpen, setModalOpen] = useState(false);
  const nameAction = useRef<TNameAction>();
  const { save, IsSaveAndClose, saveAndClose, formRef } = UseVForm();
  const navigate = useNavigate();
  const saveValue = useRef<IForm>();
  const [typeAlert, setTypeAlert] = useState<AlertColor>();
  const [messageAlert, setMessageAlert] = useState<string>();


  const renderInfo = useCallback(async () => {
    const result = id !== "nova" && (await ServicoService.getById(Number(id)));
    
    if(result instanceof Error){
      navigate("/servicos")
   }else{
     if(typeof result === "boolean"){
       

       formRef.current?.setData({
           nome: "",
           servicoAbaixo: "",
           quantidade:"",
           valor:"",
         })

     }else{
       formRef.current?.setData(result) 
       setName(result.nome) 
       
     }
    
   }

   
  }, [id]);



  useEffect(() => {
    renderInfo();
  }, [renderInfo]);

  const validationInputs: yup.ObjectSchema<IForm> = yup.object().shape({
    nome:yup.string().required(),
    valor:yup.number().min(0).required(),

  })


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
        ServicoService.updateById(Number(id), saveValue.current).then(
          (response) => {
            if (response instanceof Error) {
              setTypeAlert("error");
              setMessageAlert(ComponentsConstants.MESSAGE_ERROR_REGISTRATION);
            } else {
              if (IsSaveAndClose()) {
                navigate("/servicos", {
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
        ServicoService.create(saveValue.current).then((response) => {
          if (response instanceof Error) {
            setTypeAlert("error");
            setMessageAlert(ComponentsConstants.MESSAGE_ERROR_REGISTRATION);
          } else {
            if (IsSaveAndClose()) {
              navigate(`/servicos`, {
                state: {
                  message: ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION,
                  type: "success",
                },
              });
            } else {
              navigate(`/servicos/detalhe/${response}`);
            }
          }
        });
      }
    }
  }, []);

  const handleDelete = useCallback((id: number) => {
    ServicoService.deleteById(id).then((response) => {
      if (response instanceof Error) {
        navigate("/servicos", {
          state: {
            message: ComponentsConstants.MESSAGE_ERROR_DELETE,
            type: "error",
          },
        });
      } else {
        navigate("/servicos", {
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
      title={id === "nova" ? "Cadastro de servico" : name ? name : ""}
      tools={
        <DetailsTools
          onclickSave={() => openModal("save")}
          onclickSaveAndBack={() => openModal("saveAndClose")}
          onclickDelete={() => openModal("delete")}
          onclickBack={() => navigate("/servicos")}
          onclickNew={() => navigate("/servicos/detalhe/nova")}
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
              <Typography variant="h6" style={{fontWeight:"bolder"}}>Geral</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                <VTextField
                name="nome"
                onChange={((e)=>setName(e.target.value))}
                label="nome"
                required
                />
                <Button />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
              <VTextField
                                    name="valor"
                                    label="Valor*"
                                
                                    fullWidth
                                  />
              </Grid>
              
            
            </Grid>
                              </Grid>
        </Box>
      </Form>
    </LayoutBase>
  );
};
