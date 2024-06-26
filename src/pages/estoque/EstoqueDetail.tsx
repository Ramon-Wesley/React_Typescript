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
import { EstoqueService, IEstoques } from "../../shared/services/api/estoque/EstoqueService";
import { DecimalInput } from "../../shared/components/masksComponents/DecimalNumberInput";

export const EstoqueDetail: React.FC = () => {
  type TNameAction = "save" | "saveAndClose" | "delete" | "saveProduto" |undefined;
  interface IForm extends Omit<IEstoques,"id"> {}
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
    const result = id !== "nova" && (await EstoqueService.getById(Number(id)));
    if(result instanceof Error){
      navigate("/pessoas")
   }else{
     if(typeof result === "boolean"){
      
       formRef.current?.setData({
           nome: "",
           estoqueAbaixo: 0,
           quantidade:0,
           valor:0,
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
    estoqueAbaixo:yup.number().min(0).required(),
    quantidade:yup.number().min(0).required(),
    valor:yup.number().min(0).required(),

  })


  const validateForm = useCallback((values: IForm) => {
    values.quantidade=0
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
    console.log(saveValue.current)
    if (!saveValue.current) {
      setTypeAlert("error");
      setMessageAlert("Sem dados válidos");
    } else {
      if (id !== "nova") {
        EstoqueService.updateById(Number(id), saveValue.current).then(
          (response) => {
            if (response instanceof Error) {
              setTypeAlert("error");
              setMessageAlert(response.message);
            } else {
              if (IsSaveAndClose()) {
                navigate("/estoques", {
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
        EstoqueService.create(saveValue.current).then((response) => {
          if (response instanceof Error) {
            setTypeAlert("error");
            setMessageAlert(response.message);
          } else {
            if (IsSaveAndClose()) {
              navigate(`/estoques`, {
                state: {
                  message: ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION,
                  type: "success",
                },
              });
            } else {
              navigate(`/estoques/detalhe/${response}`);
            }
          }
        });
      }
    }
    closeModal()
  }, []);

  const handleDelete = useCallback((id: number) => {
    EstoqueService.deleteById(id).then((response) => {
      if (response instanceof Error) {
        navigate("/estoques", {
          state: {
            message: ComponentsConstants.MESSAGE_ERROR_DELETE,
            type: "error",
          },
        });
      } else {
        navigate("/estoques", {
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
      title={id === "nova" ? "Cadastro de estoque" : name ? name : ""}
      tools={
        <DetailsTools
          onclickSave={() => openModal("save")}
          onclickSaveAndBack={() => openModal("saveAndClose")}
          onclickDelete={() => openModal("delete")}
          onclickBack={() => navigate("/estoques")}
          onclickNew={() => navigate("/estoques/detalhe/nova")}
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
                label="nome"
                required
                onChange={(e)=>setName(e.target.value)}
                />
                <Button />
              </Grid>
            
              
              <Grid item xs={12} sm={12} md={6} lg={2} xl={2} >
                                
              <VTextField
                  name="estoqueAbaixo"
                  label="abaixoEstoque*"
                  fullWidth
                  type="number"
                  inputProps={{
                    min: 0,
    
                  }}
                />

              </Grid>
              
            <Grid item xs={12} sm={12} md={6} lg={2} xl={2} >
              <DecimalInput
              name="valor"
              label="Valor*"
              />
                                
                                </Grid>
            </Grid>
                              </Grid>
        </Box>
      </Form>
    </LayoutBase>
  );
};
