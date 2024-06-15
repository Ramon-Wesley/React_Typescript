import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { DrawerApp } from "./shared/components/drawer/DrawerApp";
import { LoginDetail } from "./shared/components/login/LoginDetail";
import { AppDrawerContext, AppThemeContext, AuthProvider } from "./shared/context";
import "./shared/middlewares/TraduticaoYup";
export const App = () => {
  return (
    <AppThemeContext>
    <AuthProvider>
<LoginDetail>
      <AppDrawerContext>
        <BrowserRouter>
          <DrawerApp>
            <AppRoutes/>
          </DrawerApp>
        </BrowserRouter>
      </AppDrawerContext>
</LoginDetail>
    </AuthProvider>
    </AppThemeContext>
  );
};
