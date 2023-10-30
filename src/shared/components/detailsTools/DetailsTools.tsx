import {
  Box,
  Button,
  Icon,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";

interface IDetailTools {
  textNew?: string;

  onclickSave?: () => void | undefined;
  onclickSaveAndBack?: () => void | undefined;
  onclickBack?: () => void;
  onclickNew?: () => void;
  onclickDelete?: () => void;

  onNew?: boolean;
  onBack?: boolean;
  onSaveAndBack?: boolean;
  onSave?: boolean;
  onDelete?: boolean;

  isLoading?: boolean;
}
export const DetailsTools: React.FC<IDetailTools> = ({
  textNew = "Novo",
  isLoading = false,
  onBack = true,
  onNew = true,
  onSave = true,
  onSaveAndBack = true,
  onDelete = true,
  onclickBack,
  onclickNew,
  onclickSave,
  onclickDelete,
  onclickSaveAndBack,
}) => {
  return (
    <Box display="flex" padding={2} gap={2} alignItems="center" width="100%">
      {isLoading && onSave && (
        <Skeleton variant="rounded">
          <Button startIcon={<Icon>save</Icon>}>
            <Typography
              whiteSpace="nowrap"
              variant="button"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              Salvar
            </Typography>
          </Button>
        </Skeleton>
      )}

      {onSave && !isLoading && (
        <Button
          onClick={onclickSave}
          variant="contained"
          startIcon={<Icon>save</Icon>}
        >
          <Typography
            whiteSpace="nowrap"
            variant="button"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            Salvar
          </Typography>
        </Button>
      )}

      {onSaveAndBack && isLoading && (
        <Skeleton variant="rounded">
          <Button startIcon={<Icon>save</Icon>}>
            <Typography
              whiteSpace="nowrap"
              variant="button"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              Salvar e Voltar
            </Typography>
          </Button>
        </Skeleton>
      )}

      {onSaveAndBack && !isLoading && (
        <Button
          onClick={onclickSaveAndBack}
          variant="outlined"
          startIcon={<Icon>save</Icon>}
        >
          <Typography
            whiteSpace="nowrap"
            variant="button"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            Salvar e voltar
          </Typography>
        </Button>
      )}

      {onDelete && isLoading && (
        <Skeleton variant="rounded">
          <Button startIcon={<Icon>delete</Icon>}>
            <Typography
              whiteSpace="nowrap"
              variant="button"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              Apagar
            </Typography>
          </Button>
        </Skeleton>
      )}

      {onDelete && !isLoading && (
        <Button
          onClick={onclickDelete}
          variant="outlined"
          startIcon={<Icon>delete</Icon>}
        >
          <Typography
            whiteSpace="nowrap"
            variant="button"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            Apagar
          </Typography>
        </Button>
      )}

      {onBack && isLoading && (
        <Skeleton variant="rounded">
          <Button startIcon={<Icon>arrow_back</Icon>}>
            <Typography
              whiteSpace="nowrap"
              variant="button"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              Voltar
            </Typography>
          </Button>
        </Skeleton>
      )}
      {onBack && !isLoading && (
        <Button
          onClick={onclickBack}
          variant="outlined"
          startIcon={<Icon>arrow_back</Icon>}
        >
          <Typography
            whiteSpace="nowrap"
            variant="button"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            voltar
          </Typography>
        </Button>
      )}
      <Divider orientation="vertical" />

      {onNew && isLoading && (
        <Skeleton variant="rounded">
          <Button startIcon={<Icon>add</Icon>}>
            <Typography
              whiteSpace="nowrap"
              variant="button"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {textNew}
            </Typography>
          </Button>
        </Skeleton>
      )}

      {onNew && !isLoading && (
        <Button
          onClick={onclickNew}
          variant="outlined"
          startIcon={<Icon>add</Icon>}
        >
          <Typography
            variant="button"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            {textNew}
          </Typography>
        </Button>
      )}
    </Box>
  );
};
