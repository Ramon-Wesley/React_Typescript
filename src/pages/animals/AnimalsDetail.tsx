import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DetailsTools } from "../../shared/components/detailsTools/DetailsTools";
import { LayoutBase } from "../../shared/layouts";
import { Alert, AlertColor, Box, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import { IPersons, PersonService } from "../../shared/services/api/cliente";
import { VTextField } from "../../shared/form/VTextField";
import { UseVForm } from "../../shared/form/UseVForm";
import { Form } from "@unform/web";
import {mask,unMask} from "remask"
import * as yup from "yup";

import { VModal } from "../../shared/components/vModal/VModal";
import { ComponentsConstants } from "../../shared/components/componentsConstants/ComponentesConstantes";
import { IAnimals, animalService } from "../../shared/services/api/animals/AnimalsService";
import { AutoCompleteCliente } from "../../shared/components/autoCompletestComponents/AutoCompleteCliente";
import { AutoCompleteRaca } from "../../shared/components/autoCompletestComponents/AutoCompleteRaca copy";


export const AnimalDetail: React.FC = () => {
  type TNameAction = "save" | "saveAndClose" | "delete" | undefined;
  interface IForm extends Omit<IAnimals, "id"> {}
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
    const result = id !== "nova" && (await animalService.getById(Number(id)));
  
    if(result instanceof Error){
      navigate("/animais")
   }else{
     if(typeof result === "boolean"){
      formRef.current?.setData({
        nome: "",
        raca:{
          racaId:undefined,
          especie:{
            especieId:undefined,
            nome:""
          }
        },
        cliente:{
          clienteId:undefined,
          cpf:"",
          nome:""
        },
        data_de_nascimento:"",
        peso:""
      })
     }else{
       formRef.current?.setData(result) 
       setName(result.nome) 
       console.log(result)
     }
    
   }


    
  }, [id]);

  useEffect(() => {
    renderInfo();
  }, [renderInfo]);

  const validationInputs: yup.ObjectSchema<IForm> = yup.object().shape({
  cliente: yup.object().shape({
    id: yup.number(),
    nome: yup.string(),
    cpf: yup.string(),
  }),
  cliente_id: yup.number().required(),
  nome: yup.string().required(),
  data_de_nascimento: yup.string().required(),
  peso: yup.string().required(),
  });

  const validateForm = useCallback((values: IForm) => {
    console.log(values)
    validationInputs
    .validate(values, { abortEarly: false })
    .then((response) => {
      setModalOpen(true);
      saveValue.current = response;
      console.log(values)
      })
      .catch((error: yup.ValidationError) => {
        const errorsResult: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path === undefined) return;
          errorsResult[err.path] = err.message;
          console.log(err.path)
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
        animalService.updateById(Number(id), saveValue.current).then(
          (response) => {
            if (response instanceof Error) {
              setTypeAlert("error");
              setMessageAlert(ComponentsConstants.MESSAGE_ERROR_REGISTRATION);
            } else {
              if (IsSaveAndClose()) {
                navigate("/animais", {
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
        animalService.create(saveValue.current).then((response) => {
          if (response instanceof Error) {
            setTypeAlert("error");
            setMessageAlert(response.message);
          } else {
            if (IsSaveAndClose()) {
              navigate(`/animais`, {
                state: {
                  message: ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION,
                  type: "success",
                },
              });
            } else {
              navigate(`/animais/detalhe/${response.id}`);
            }
          }
        });
      }
    }
  }, []);

  const handleDelete = useCallback((id: number) => {
    PersonService.deleteById(id).then((response) => {
      if (response instanceof Error) {
        navigate("/animais", {
          state: {
            message: ComponentsConstants.MESSAGE_ERROR_DELETE,
            type: "error",
          },
        });
      } else {
        navigate("/animais", {
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
      title={id === "nova" ? "Cadastro de animais" : name ? name : ""}
      tools={
        <DetailsTools
          onclickSave={() => openModal("save")}
          onclickSaveAndBack={() => openModal("saveAndClose")}
          onclickDelete={() => openModal("delete")}
          onclickBack={() => navigate("/animais")}
          onclickNew={() => navigate("/animais/detalhe/nova")}
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
              <Typography variant="h6" style={{fontWeight:"bolder"}}>Dono/dona</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
            
                  <AutoCompleteCliente/>
              
            </Grid>
            <Grid item>
            <Typography variant="h6" style={{fontWeight:"bolder"}} >Animal</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
                <VTextField name="nome" label="Nome_animal*" onChange={(e)=>setName(e.target.value)}fullWidth />
              </Grid>
            
            </Grid>
            
              <Grid container item spacing={2}>
                <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
                <VTextField name="peso" label="Peso*" fullWidth />
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
                <VTextField name="data_de_nascimento" type="date" label="data de nascimento*" fullWidth />
                </Grid>
               
              </Grid>
          </Grid>
        </Box>
      </Form>
    </LayoutBase>
  );
};
