import { useNavigate, useParams } from "react-router-dom";
import { IPersons, PersonService } from "../../shared/services/api/cliente";
import { useCallback, useEffect, useRef, useState } from "react";
import { UseVForm } from "../../shared/form/UseVForm";
import { AlertColor } from "@mui/material";
import { Mascaras } from "../../shared/hook";
import * as yup from "yup";
import { ComponentsConstants } from "../../shared/components/componentsConstants/ComponentesConstantes";


export const PersonDetailFunc=()=>{

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


return{
    id,
    openModal,
    navigate,
    typeAlert,
    messageAlert,
    closeModal,
    nameAction,
    modalOpen,
    handleSave,
    handleDelete,
    formRef,
    validateForm,
    setName,
    setTelefone,
    name,
    TelefoneRegex
}

}
