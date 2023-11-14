import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DetailsTools } from "../../shared/components/detailsTools/DetailsTools";
import { LayoutBase } from "../../shared/layouts";
import { Alert, AlertColor, Box, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";

import { VTextField } from "../../shared/form/VTextField";
import { UseVForm } from "../../shared/form/UseVForm";
import { Form } from "@unform/web";
import * as yup from "yup";
import { VModal } from "../../shared/components/vModal/VModal";
import { ComponentsConstants } from "../../shared/components/componentsConstants/ComponentesConstantes";
import { IEndereco, getEndereco } from "../../shared/services/api/Cep/CepService";
import { FuncionarioService, IFuncionarios } from "../../shared/services/api/funcionarios/FuncionariosService";
import { AutoCompleteCities } from "../../shared/components/autoCompletestComponents/AutoCompleteCities";
import { VRadioGroup } from "../../shared/form/VRadioField";

export const FuncionarioDetail: React.FC = () => {
  type TNameAction = "save" | "saveAndClose" | "delete" | undefined;
  interface IForm extends Omit<IFuncionarios, "id"> {}
  const { id = "nova" } = useParams<"id">();
  let enderecoId:number|undefined;
  const [sexo,setSexo]=useState("masculino");
  const [name, setName] = useState<string>();
  const [modalOpen, setModalOpen] = useState(false);
  const nameAction = useRef<TNameAction>();
  const { save, IsSaveAndClose, saveAndClose, formRef } = UseVForm();
  const navigate = useNavigate();
  const saveValue = useRef<IForm>();
  const [endereco,setEndereco]=useState<IEndereco>();
  const [typeAlert, setTypeAlert] = useState<AlertColor>();
  const [messageAlert, setMessageAlert] = useState<string>();

  const renderInfo = useCallback(async () => {
    const result = id !== "nova" && (await FuncionarioService.getById(Number(id)));
    
    if(result instanceof Error){
      navigate("/funcionarios")
   }else{
     if(typeof result === "boolean"){
    
      formRef.current?.setData({
          nome: "",
          email: "",
          cidadeId: undefined,
          ra:"",
          data_de_nascimento:""
        })
     }else{
       formRef.current?.setData(result)
       enderecoId=result.endereco_id as number
       setName(result.nome) 
       console.log(enderecoId)
     }
    
   }


  
  }, [id]);

  useEffect(()=>{
    setTimeout(()=>{
      setMessageAlert(undefined)
      setTypeAlert(undefined)
    },2000)
  },[messageAlert,typeAlert])

  const cepInfo=(async(cep:string)=>{
      if(cep.length === 8){
        getEndereco(cep)
        .then((response)=>{
          if(response instanceof Error){
          if(endereco?.cep){
            setEndereco({
              logradouro:"",
              bairro:"",
              cep:"",
              complemento:"",
              localidade:"",
              numero:"",
             
            })
          }
          }else{
            console.log(response)
      setEndereco(response)
          }
        })
      }else if(cep.length === 7){
        if(endereco?.cep){
          setEndereco({
            logradouro:"",
            bairro:"",
            cep:"",
            complemento:"",
            localidade:"",
            numero:"",
           
          })

        }
      }
  })


  useEffect(() => {
    renderInfo();
  }, [renderInfo]);

  const validationInputs: yup.ObjectSchema<IForm> = yup.object().shape({
    nome: yup.string().min(2).required(),
    email: yup.string().email().required(),
    ra:yup.string().min(11).max(11).required(),
    endereco_id:yup.number(),
    sexo:yup.string().oneOf(["feminino","masculino","outros"]).required(),
    data_de_nascimento:yup.string().required(),
    telefone:yup.string().required(),
    endereco:yup.object().shape({
      cep:yup.string().required(),
      localidade:yup.string().required(),
      logradouro:yup.string().required(),
      bairro:yup.string().required(),
      complemento:yup.string().required(),
      numero:yup.string().required()
    })

  });
  const validateForm = useCallback((values: IForm) => {
    console.log()
    if(enderecoId){
      values.endereco_id=enderecoId;
    }
    values.sexo=sexo;
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
        FuncionarioService.updateById(Number(id), saveValue.current).then(
          (response) => {
            if (response instanceof Error) {
              setTypeAlert("error");
              setMessageAlert(response.message);
              closeModal()
            } else {
              if (IsSaveAndClose()) {
                navigate("/funcionarios", {
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
        FuncionarioService.create(saveValue.current).then((response) => {
          if (response instanceof Error) {
            setTypeAlert("error");
            setMessageAlert(response.message);
            closeModal()
          } else {
            if (IsSaveAndClose()) {
              navigate(`/funcionarios`, {
                state: {
                  message: ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION,
                  type: "success",
                },
              });
            } else {
              navigate(`/funcionarios/detalhe/${response}`);
            }
          }
        });
      }
    }
  }, []);

  const handleDelete = useCallback((id: number) => {
    FuncionarioService.deleteById(id).then((response) => {
      if (response instanceof Error) {
        navigate("/funcionarios", {
          state: {
            message: ComponentsConstants.MESSAGE_ERROR_DELETE,
            type: "error",
          },
        });
      } else {
        navigate("/funcionarios", {
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
      title={id === "nova" ? "Cadastro de Funcionario" : name ? name : ""}
      tools={
        <DetailsTools
          onclickSave={() => openModal("save")}
          onclickSaveAndBack={() => openModal("saveAndClose")}
          onclickDelete={() => openModal("delete")}
          onclickBack={() => navigate("/funcionarios")}
          onclickNew={() => navigate("/funcionarios/detalhe/nova")}
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
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  name="ra"
                  label="RA*"
                  fullWidth
                
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  name="nome"
                  label="Nome*"
                  fullWidth
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2} >
                                
                <Typography>Genero*</Typography>
                 <VRadioGroup
                  name="sexo"
              />
  

              </Grid>
              
            </Grid>
            <Grid container item direction="row" spacing={2}> 
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
               <VTextField
               type="date"
               name="data_de_nascimento"
               label="Data de nascimento*"
               />
              </Grid>
            </Grid>
            <Grid item>
            <Typography variant="h6" style={{fontWeight:"bolder"}} >Contato</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
                <VTextField name="email" label="Email*" fullWidth />
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
                <VTextField name="telefone" label="Telefone*" fullWidth />
              </Grid>

            </Grid>
            <Grid item>
            <Typography variant="h6" style={{fontWeight:"bolder"}} >Endereco</Typography>
            </Grid>
              <AutoCompleteCities/>
          </Grid>
        </Box>
      </Form>
    </LayoutBase>
  );
};
