import {
  Box,
  Drawer,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  List,
  ListItemButton,
  ListItemIcon,
  Icon,
  ListItemText,
} from "@mui/material";
import { useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { useAuthContext, useDrawerContext, useThemeContextOption } from "../../context";
interface IListApp {
  path: string;
  icon: string;
  label: string;
  onclick?: () => void;
}

export const ListApp: React.FC<IListApp> = ({ path, icon, label, onclick }) => {
  const pathResult = useResolvedPath(path);
  const matchResult = useMatch({ path: pathResult.pathname, end: false });
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
    onclick?.();
  };
  return (
    <ListItemButton selected={!!matchResult} onClick={handleClick}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

interface IDrawerApp {
  children: React.ReactNode;
}
export const DrawerApp: React.FC<IDrawerApp> = ({ children }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(() => theme.breakpoints.down("sm"));
  const { handleToggleOpen, isOpen, options } = useDrawerContext();
  const { toggleTheme } = useThemeContextOption();
  const {logout}=useAuthContext()
  return (
    <>
      <Drawer
        open={isOpen}
        variant={smDown ? "temporary" : "permanent"}
        onClose={handleToggleOpen}
      >
        <Box
          width={theme.spacing(28)}
          display="flex"
          flexDirection="column"
          height="100%"
        >
          <Box
            display="flex"
            height={theme.spacing(18)}
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              sx={{ width: theme.spacing(10), height: theme.spacing(10) }}
            />
          </Box>
          <Divider />
          <Box flex={1}>
            <List>
              {options &&
                options.length > 0 &&
                options.map((op, key) => (
                  <ListApp
                    key={key}
                    icon={op.icon}
                    label={op.label}
                    path={op.path}
                    onclick={smDown ? handleToggleOpen : undefined}
                  />
                ))}
            </List>
          </Box>
          <Divider />
          <Box>
            <List>
              <ListItemButton onClick={toggleTheme}>
                <ListItemIcon>
                  <Icon>dark_mode</Icon>
                </ListItemIcon>
                <ListItemText primary="Trocar tema" />
              </ListItemButton>
              
              <ListItemButton onClick={logout}>
                <ListItemIcon>
                  <Icon>logout</Icon>
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Drawer>
      <Box marginLeft={smDown ? 0 : theme.spacing(28)} height="100vh">
        {children}
      </Box>
    </>
  );
};
