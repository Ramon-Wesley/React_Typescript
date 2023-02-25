import {
  Modal,
  Icon,
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
} from "@mui/material";

interface IMessageAlert {
  open: boolean;
  color:
    | "inherit"
    | "disabled"
    | "action"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | undefined;
  icon: "help_outline" | "error_outline";
  title: "deseja apagar o registro?" | "Deseja salvar o registro?";
  subTitle?: "excluirá permanentemente" | "";
  handleOnClick: () => void | undefined;
  handleIsOpen: () => void;
  textButton: "Excluir" | "Cadastrar";
}

export const VModal: React.FC<IMessageAlert> = ({
  open,
  color,
  icon,
  title,
  handleIsOpen,
  handleOnClick,
  subTitle,
  textButton,
}) => {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        component={Paper}
        gap={1}
        display="flex"
        padding={1}
        alignItems="center"
        flexDirection="column"
        width={theme.spacing(35)}
        height={theme.spacing(25)}
        position="absolute"
        top="30%"
        left="50%"
        sx={{ transform: "translate(-50%,-50%)" }}
      >
        <Icon sx={{ fontSize: theme.spacing(8) }} color={color}>
          {icon}
        </Icon>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="subtitle2">{subTitle}</Typography>
        <Box
          display="flex"
          gap={1}
          width="100%"
          justifyContent="space-around"
          marginTop={2}
        >
          <Button onClick={handleIsOpen} variant="contained" color="inherit">
            Fechar
          </Button>
          <Button onClick={handleOnClick} variant="contained">
            {textButton}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
