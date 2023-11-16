import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { DrawerApp } from "./shared/components/drawer/DrawerApp";
import { Login } from "./shared/components/login/Login";
import { AppDrawerContext, AppThemeContext, AuthProvider } from "./shared/context";
import "./shared/middlewares/TraduticaoYup";
export const App = () => {
  return (
    <AuthProvider>
<Login>
    <AppThemeContext>
      <AppDrawerContext>
        <BrowserRouter>
          <DrawerApp>
            <AppRoutes/>
          </DrawerApp>
        </BrowserRouter>
      </AppDrawerContext>
    </AppThemeContext>
</Login>
    </AuthProvider>
  );
};
