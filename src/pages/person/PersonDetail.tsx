
import { DetailsTools } from "../../shared/components/detailsTools/DetailsTools";
import { LayoutBase } from "../../shared/layouts";
import { Alert,Box,Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import { VTextField } from "../../shared/form/VTextField";
import { Form } from "@unform/web";
import { AutoCompleteCities } from "../../shared/components/autoCompletestComponents/AutoCompleteCities";
import { VModal } from "../../shared/components/vModal/VModal";
import { PersonDetailFunc } from "./PersonDetailFunc";
import { VRadioGroup } from "../../shared/form/VRadioField";
import { PhoneNumberInput } from "../../shared/components/masksComponents/PhoneNumberInput";
import { CPFInput } from "../../shared/components/masksComponents/CpfNumberInput";

export const PersonDetail: React.FC = () => {
 const {
  id,
  openModal,
  modalOpen,
  navigate,
  typeAlert,
  messageAlert,
  closeModal,
  nameAction,
  handleSave,
  handleDelete,
  formRef,
  validateForm,
  setName,
  setTelefone,
  name,
  TelefoneRegex
}= PersonDetailFunc()

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
              <CPFInput/>
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
                                
                <Typography>Gênero*</Typography>
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
                <PhoneNumberInput/>
               
              </Grid>

            </Grid>
            <Grid item>
            <Typography variant="h6" style={{fontWeight:"bolder"}} >Endereço</Typography>
            </Grid>
              <AutoCompleteCities/>
          </Grid>
        </Box>
      </Form>
    </LayoutBase>
  );
};
