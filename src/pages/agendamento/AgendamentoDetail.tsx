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
import { AutoCompleteAnimal } from "../../shared/components/autoCompletestComponents/AutoCompleteAnimal";
import { AgendamentoService, IAgendamento } from "../../shared/services/api/agendamento/AgendamentoService";
import { AutoCompleteFuncionario } from "../../shared/components/autoCompletestComponents/AutoCompleteFuncionario";
import { AutoCompleteServicos } from "../../shared/components/autoCompletestComponents/AutoCompleteServicos";
import { AutoCompleteCliente } from "../../shared/components/autoCompletestComponents/AutoCompleteCliente";

interface IAgenda{
  animal_id:number,
  funcionario_id:number,
   servico_id:number
}

export const AgendamentoDetail: React.FC = () => {
  type TNameAction = "save" | "saveAndClose" | "delete" | undefined;
  interface IForm extends Omit<IAgendamento, "id"> {}
  const { id = "nova" } = useParams<"id">();
  const [name, setName] = useState<string>();
  const [modalOpen, setModalOpen] = useState(false);
  const nameAction = useRef<TNameAction>();
  const { save, IsSaveAndClose, saveAndClose, formRef } = UseVForm();
  const navigate = useNavigate();
  const [datas,setDatas]=useState<IAgendamento>({} as IAgendamento)
  const saveValue = useRef<IForm>();
  const [typeAlert, setTypeAlert] = useState<AlertColor>();
  const [messageAlert, setMessageAlert] = useState<string>();


  const renderInfo = useCallback(async () => {
    const result = id !== "nova" && (await AgendamentoService.getById(Number(id)));
  
  if (result instanceof Error){
    navigate("/agendamentos")
  }
      else if(typeof result === "boolean"){

      formRef.current?.setData({
     funcionario_id:undefined,
    funcionario:{
      id:undefined,
      ra:"",
      nome:""
    },
    cliente_id:undefined,
    cliente:{
      id:undefined,
      cpf:"",
      nome:""
    },
    animal_id:undefined,
    animal:{
      id:undefined,
      nome:""
    },
    servico_id:undefined,
    servico:{
      id:undefined,
      nome:"",
      valor:""
    },
    data:Date.now()
        } )
      }else{ 
        if(result.animal?.cliente_id){
          result.cliente_id=result.animal.cliente_id
        }
        formRef.current?.setData(result) 
        setName(result.animal?.cliente?.nome)
     
        
    };
  }, [id]);

  useEffect(() => {
    renderInfo();
  }, [renderInfo]);

  const validationInputs:yup.ObjectSchema<IForm> = yup.object().shape({
    animal_id: yup.number().required(),
    funcionario_id: yup.number().required(),
    servico_id: yup.number().required(),
    funcionario: yup.object().shape({
      funcionarioId: yup.number(),
      ra: yup.string(),
      nome: yup.string(),
    }),
    cliente_id: yup.number().required(),
    cliente: yup.object().shape({
      id: yup.number(),
      cpf: yup.string(),
      nome: yup.string(),
    }),
    animal: yup.object().shape({
      id: yup.number(),
      nome: yup.string(),
    }),
    servico: yup.object().shape({
      id: yup.number(),
      nome: yup.string(),
      valor: yup.number(),
    }),
    data: yup.string().required()
  
  });

  const validateForm = useCallback((values: IForm) => {
    console.log(values)
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
        console.log("Update: "+id)
        AgendamentoService.updateById(Number(id), saveValue.current).then(
          (response) => {
            if (response instanceof Error) {
              setTypeAlert("error");
              setMessageAlert(ComponentsConstants.MESSAGE_ERROR_REGISTRATION);
            } else {
              console.log(response)
              if (IsSaveAndClose()) {
                navigate("/agendamentos", {
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
        AgendamentoService.create(saveValue.current).then((response) => {
          if (response instanceof Error) {
            setTypeAlert("error");
            setMessageAlert(ComponentsConstants.MESSAGE_ERROR_REGISTRATION);
          } else {
            if (IsSaveAndClose()) {
              navigate(`/agendamentos`, {
                state: {
                  message: ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION,
                  type: "success",
                },
              });
            } else {
              navigate(`/agendamentos/detalhe/${response}`);
            }
          }
        });
      }
    }
  }, []);

  const handleDelete = useCallback((id: number) => {
    AgendamentoService.deleteById(id).then((response) => {
      if (response instanceof Error) {
        navigate("/agendamentos", {
          state: {
            message: ComponentsConstants.MESSAGE_ERROR_DELETE,
            type: "error",
          },
        });
      } else {
        navigate("/agendamentos", {
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
    
      title={id === "nova" ? "Cadastro de agendamentos" : name ? name : ""}
      tools={
        <DetailsTools
          onclickSave={() => openModal("save")}
          onclickSaveAndBack={() => openModal("saveAndClose")}
          onclickDelete={() => openModal("delete")}
          onclickBack={() => navigate("/agendamentos")}
          onclickNew={() => navigate("/agendamentos/detalhe/nova")}
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
            
                  <AutoCompleteCliente
                  isAnimal={true}
                  />
                  
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{fontWeight:"bolder"}}>Funcionario/funcionaria</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
                  <AutoCompleteFuncionario/>
            </Grid>
            
            <Grid item>
            <Typography variant="h6" style={{fontWeight:"bolder"}} >Servico</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
            <AutoCompleteServicos
           
            />
            </Grid>
           
          </Grid>
        </Box>
        
 
      </Form>
    </LayoutBase>
  );
};
