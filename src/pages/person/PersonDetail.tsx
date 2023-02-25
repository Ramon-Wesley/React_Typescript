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
          setName(response.nome);
          formRef.current?.setData(response);
          console.log(response.cidadeId);
          console.log(formRef.current?.getData());
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

  const validationInputs: yup.ObjectSchema<IForm> = yup.object().shape({
    cidadeId: yup.number().integer().required(),
    nome: yup.string().min(2).required(),
    email: yup.string().email().required(),
  });

  const handleSubmit = useCallback((values: IForm) => {
    console.log(values);
    validationInputs
      .validate(values, { abortEarly: false })
      .then((response) => {
        if (id !== "nova") {
          PersonService.updateById(Number(id), response).then((response) => {
            if (response instanceof Error) {
              // ALERT
            } else {
              if (IsSaveAndClose()) {
                navigate("/pessoas");
              } else {
                navigate(`/pessoas/detalhe/${id}`);
              }
            }
          });
        }
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
    setModalOpen(true);
    nameAction.current = name;
  }, []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    nameAction.current = undefined;
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
          onclickNew={() => navigate("/pessoas/nova")}
        />
      }
    >
      <VModal
        handleIsOpen={closeModal}
        handleOnClick={
          nameAction.current === "saveAndClose"
            ? saveAndClose
            : nameAction.current === "save"
            ? save
            : nameAction.current === "delete"
            ? ()=>handleDelete(Number(id))
            : ()=> undefined
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
