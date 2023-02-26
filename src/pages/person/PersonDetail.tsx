import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DetailsTools } from "../../shared/components/detailsTools/DetailsTools";
import { LayoutBase } from "../../shared/layouts";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { IPersons, PersonService } from "../../shared/services/api/persons";
import { VTextField } from "../../shared/form/VTextField";
import { UseVForm } from "../../shared/form/UseVForm";
import { Form } from "@unform/web";
import * as yup from "yup";
import { AutoCompleteCities } from "./components/AutoCompleteCities";
import { VModal } from "../../shared/components/vModal/VModal";

export const PersonDetail: React.FC = () => {
  type TNameAction = "save" | "saveAndClose" | "delete" | undefined;

  const { id = "nova" } = useParams<"id">();
  const [name, setName] = useState<string>();
  const [modalOpen, setModalOpen] = useState(false);
  const nameAction = useRef<TNameAction>();
  const { save, IsSaveAndClose, saveAndClose, formRef } = UseVForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (id !== "nova") {
      PersonService.getById(Number(id)).then((response) => {
        if (response instanceof Error) {
          navigate("/pessoas");
        } else {
          formRef.current?.setData(response);
          console.log(formRef.current?.getData());
          setName(response.nome);
        }
      });
    } else {
      formRef.current?.setData({
        nome: "",
        email: "",
        cidadeId: undefined,
      });
    }
  }, [id]);

  interface IForm {
    cidadeId: number;
    nome: string;
    email: string;
  }
  const saveValue = useRef<IForm>();

  const validationInputs: yup.ObjectSchema<IForm> = yup.object().shape({
    cidadeId: yup.number().integer().required(),
    nome: yup.string().min(2).required(),
    email: yup.string().email().required(),
  });

  const handleSubmit = useCallback((values: IForm) => {
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
      alert("sem dados");
    } else {
      if (id !== "nova") {
        PersonService.updateById(Number(id), saveValue.current).then(
          (response) => {
            if (response instanceof Error) {
              alert("Erro ao cadastrar");
            } else {
              if (IsSaveAndClose()) {
                navigate("/pessoas", {
                  state: {
                    message: "Cadastro realizado com sucesso",
                    type: "success",
                  },
                });
              } else {
                alert("Salvo com sucesso!");
              }
            }
          }
        );
      } else {
        PersonService.create(saveValue.current).then((response) => {
          if (response instanceof Error) {
            alert("Erro ao salvar");
          } else {
            if (IsSaveAndClose()) {
              navigate(`/pessoas`, {
                state: {
                  message: "Cadastro pessoas salvo com sucesso",
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
      if (response instanceof Error) {
        navigate("/pessoas", {
          state: { message: "Erro ao excluir o registro!", type: "error" },
        });
      } else {
        navigate("/pessoas", {
          state: { message: "Cadastro excluído com sucesso!", type: "success" },
        });
      }
    });
  }, []);

  const openModal = useCallback((name: TNameAction) => {
    nameAction.current = name;
    if (name === "save") {
      save();
      return;
    } else if (name === "saveAndClose") {
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
      title={id === "nova" ? "Cadastro de pessoa" : name ? name : ""}
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
      <Form ref={formRef} onSubmit={handleSubmit}>
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

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
                <VTextField name="email" label="Email" fullWidth />
              </Grid>

              <Grid container item>
                <Grid item xs={12} sm={12} md={8} lg={4} xl={2}>
                  <AutoCompleteCities />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Form>
    </LayoutBase>
  );
};
