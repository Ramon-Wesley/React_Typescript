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
import { AutoCompleteCities } from "../../shared/components/autoCompletestComponents/AutoCompleteCities";
import { VModal } from "../../shared/components/vModal/VModal";
import { ComponentsConstants } from "../../shared/components/componentsConstants/ComponentesConstantes";
import { CpfMask } from "../../shared/form/CpfMask";
import { IEndereco, getEndereco } from "../../shared/services/api/Cep/CepService";
import { VRadioGroup } from "../../shared/form/VRadioField";
import { Mascaras } from "../../shared/hook";


export const PersonDetail: React.FC = () => {
  type TNameAction = "save" | "saveAndClose" | "delete" | undefined;
  interface IForm extends Omit<IPersons, "id"> {}
  const { id = "nova" } = useParams<"id">();
  const [cpf,setCpf]=useState("");
  const [telefone,setTelefone]=useState("");
  const [name, setName] = useState<string>();
  const [modalOpen, setModalOpen] = useState(false);
  let enderecoId:number|undefined;
  const nameAction = useRef<TNameAction>();
  const { save, IsSaveAndClose, saveAndClose, formRef } = UseVForm();
  const navigate = useNavigate();
  const saveValue = useRef<IForm>();
  const [typeAlert, setTypeAlert] = useState<AlertColor>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const {CpfRegex,TelefoneRegex}=Mascaras
  const renderInfo = useCallback(async () => {
    const result = id !== "nova" && (await PersonService.getById(Number(id)));

    if(result instanceof Error){
       navigate("/pessoas")
    }else{
      if(typeof result === "boolean"){
        formRef.current?.setData({
         nome: "",
         email: "",
         endereco: {},
         cpf:"",
         sexo:"masculino",
         data_de_nascimento:Date.now()
        })
      }else{
        
        formRef.current?.setData(result) 
        enderecoId = result.endereco_id as number
    
        setName(result.nome) 
       
      }
     
    }
    
  }, [id]);
  useEffect(() => {
    renderInfo();
  }, [renderInfo]);

  const validationInputs: yup.ObjectSchema<IForm> = yup.object().shape({
    cpf: yup.string().required(),
    nome: yup.string().required(),
    email: yup.string().required().email(),
    sexo: yup.string().required(),
    data_de_nascimento: yup.string().required(),
    telefone: yup.string().required(),
    endereco_id: yup.number(),
    endereco: yup.object().shape({
      id: yup.number(),
      cep: yup.string().required().length(9),
      logradouro: yup.string().required(),
      complemento: yup.string(),
      bairro: yup.string().required(),
      localidade: yup.string().required(),
      numero: yup.string(),
      uf: yup.string().required(),
    }),
    
  });
  const validateForm = useCallback((values: IForm) => {
    values.endereco_id=enderecoId
    if(values.cpf && values.telefone){
    values.cpf=CpfRegex(values.cpf)
    values.telefone=TelefoneRegex(values.telefone)
    }
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
        PersonService.updateById(Number(id), saveValue.current).then(
          (response) => {
            if (response instanceof Error) {
              setTypeAlert("error");
              setMessageAlert(response.message);
              closeModal()
            } else {
              if (IsSaveAndClose()) {
                navigate("/pessoas", {
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
        PersonService.create(saveValue.current).then((response) => {
          if (response instanceof Error) {
            setTypeAlert("error");
            setMessageAlert(response.message);
            closeModal()
            
          } else {
            if (IsSaveAndClose()) {
              navigate(`/pessoas`, {
                state: {
                  message: ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION,
                  type: "success",
                },
              });
            } else {
              navigate(`/pessoas/detalhe/${response}`);
            }
          }
        });
      }
    }
  }, []);

  const handleDelete = useCallback((id: number) => {
    PersonService.deleteById(id).then((response) => {
      if (response) {
        navigate("/pessoas", {
          state: {
            message: ComponentsConstants.MESSAGE_ERROR_DELETE,
            type: "error",
          },
        });
      } else {
        navigate("/pessoas", {
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
useEffect(()=>{
  setTimeout(()=>{
    setMessageAlert(undefined)
    setTypeAlert(undefined)
  },2000)
},[messageAlert,typeAlert])
  const closeModal = useCallback(() => {
    setModalOpen(false);
    nameAction.current = undefined;
    saveValue.current = undefined;
  }, []);

  return (
    <LayoutBase
      title={id === "nova" ? "Cadastro de cliente" : name ? name : ""}
      tools={
        <DetailsTools
          onclickSave={() => openModal("save")}
          onclickSaveAndBack={() => openModal("saveAndClose")}
          onclickDelete={() => openModal("delete")}
          onclickBack={() => navigate("/pessoas")}
          onclickNew={() => navigate("/pessoas/detalhe/nova")}
        />
      }
    >
      {typeAlert !== undefined && messageAlert !== undefined && (
        <>
        <Alert severity={typeAlert}>{messageAlert}</Alert>
       
        </>
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
                  name="cpf"
                  label="Cpf*"
                  fullWidth
                 
                  inputProps={{ maxLength: 14,minLenght:14, }}
                  
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
                <VTextField name="telefone" label="Telefone*" fullWidth
                onChange={(e)=>setTelefone(TelefoneRegex(e.target.value))}
              
                inputProps={{ maxLength: 15,minLenght:15, }}
                />
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
