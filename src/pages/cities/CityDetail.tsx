import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DetailsTools } from "../../shared/components/detailsTools/DetailsTools";
import { LayoutBase } from "../../shared/layouts";
import { Alert, AlertColor, Box, Grid, Paper, Typography } from "@mui/material";
import { ICities,CitiesService } from "../../shared/services/api/cities/CitiesService";
import { VTextField } from "../../shared/form/VTextField";
import { UseVForm } from "../../shared/form/UseVForm";
import { Form } from "@unform/web";
import * as yup from "yup";
import { VModal } from "../../shared/components/vModal/VModal";
import { ComponentsConstants } from "../../shared/components/componentsConstants/ComponentesConstantes";

export const CityDetail: React.FC = () => {
  type TNameAction = "save" | "saveAndClose" | "delete" | undefined;
  interface IForm extends Omit<ICities, "id"> {}
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
    const result = id !== "nova" && (await CitiesService.getById(Number(id)));
    result instanceof Error
      ? navigate("/cidades")
      : typeof result === "boolean"
      ? formRef.current?.setData({
          nome: "",
        })
      : formRef.current?.setData(result) && setName(result.nome);
  }, [id]);

  useEffect(() => {
    renderInfo();
  }, [renderInfo]);
  useEffect(() => {
    if (typeAlert && messageAlert) {
      setTimeout(() => {
        setTypeAlert(undefined);
        setMessageAlert(undefined);
      }, ComponentsConstants.ALERT_TIME);
    }
  }, [typeAlert, messageAlert]);

  const validationInputs: yup.ObjectSchema<IForm> = yup.object().shape({
    nome: yup.string().min(2).required(),
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
        CitiesService.updateById(Number(id), saveValue.current).then(
          (response) => {
            if (response instanceof Error) {
              setTypeAlert("error");
              setMessageAlert(ComponentsConstants.MESSAGE_ERROR_REGISTRATION);
            } else {
              if (IsSaveAndClose()) {
                navigate("/cidades", {
                  state: {
                    message: ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION,
                    type: "success",
                  },
                });
              } else {
                setTypeAlert("success");
                setMessageAlert(ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION);
                closeModal();
              }
            }
          }
        );
      } else {
        CitiesService.create(saveValue.current).then((response) => {
          if (response instanceof Error) {
            setTypeAlert("error");
            setMessageAlert(ComponentsConstants.MESSAGE_ERROR_REGISTRATION);
          } else {
            if (IsSaveAndClose()) {
              navigate(`/cidades`, {
                state: {
                  message: ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION,
                  type: "success",
                },
              });
            } else {
              navigate(`/cidades/detalhe/${response}`, {
                state: {
                  message: ComponentsConstants.MESSAGE_SUCCESS_REGISTRATION,
                  type: "success",
                },
              });
            }
          }
        });
      }
    }
  }, []);

  const handleDelete = useCallback((id: number) => {
    CitiesService.deleteById(id).then((response) => {
      if (response instanceof Error) {
        navigate("/cidades", {
          state: {
            message: ComponentsConstants.MESSAGE_ERROR_DELETE,
            type: "error",
          },
        });
      } else {
        navigate("/cidades", {
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
      title={id === "nova" ? "Cadastro de cidade" : name ? name : ""}
      tools={
        <DetailsTools
          onclickSave={() => openModal("save")}
          onclickSaveAndBack={() => openModal("saveAndClose")}
          onclickDelete={() => openModal("delete")}
          onclickBack={() => navigate("/cidades")}
          onclickNew={() => navigate("/cidades/detalhe/nova")}
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
              <Typography variant="h6">Geral</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  name="nome"
                  label="Nome"
                  fullWidth
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
            </Grid>
            </Grid>
        </Box>
      </Form>
    </LayoutBase>
  );
};
