import { Box, ThemeProvider } from "@mui/material";
import {
  useContext,
  createContext,
  useState,
  useCallback,
  useMemo,
} from "react";

interface IDrawerContextData {
  path: string;
  icon: string;
  label: string;
  onclick?: () => void;
}

interface IDrawerContext {
  isOpen: boolean;
  options?: IDrawerContextData[];
  handleOptions: (drawerOptions: IDrawerContextData[]) => void;
  handleToggleOpen: () => void;
}

const DrawerContext = createContext({} as IDrawerContext);

export const useDrawerContext = () => {
  return useContext(DrawerContext);
};

interface IAppDrawerContext {
  children: React.ReactNode;
}
export const AppDrawerContext: React.FC<IAppDrawerContext> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<IDrawerContextData[]>();

  const handleOptions = useCallback((drawerOptions: IDrawerContextData[]) => {
    setOptions(drawerOptions);
  }, []);

  const handleToggleOpen = useCallback(() => {
    setIsOpen((oldIsOpen) => !oldIsOpen);
  }, []);

  return (
    <DrawerContext.Provider
      value={{ handleOptions, handleToggleOpen, options, isOpen }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
