import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { DrawerApp } from "./shared/components/drawer/DrawerApp";
import { Login } from "./shared/components/login/Login";
import { AppDrawerContext, AppThemeContext, AuthProvider } from "./shared/context";

export const App = () => {
  return (
    <AuthProvider>
    <AppThemeContext>

<Login>
      <AppDrawerContext>
        <BrowserRouter>
          <DrawerApp>
            <AppRoutes/>
          </DrawerApp>
        </BrowserRouter>
      </AppDrawerContext>
</Login>

    </AppThemeContext>
    </AuthProvider>
  );
};
