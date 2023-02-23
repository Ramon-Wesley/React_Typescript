import React from 'react';
import {BrowserRouter} from 'react-router-dom'
import { AppRoutes } from './routes';
import { DrawerApp } from './shared/components/drawer/DrawerApp';
import { AppDrawerContext,AppThemeContext } from './shared/context';

export const App=() =>{
  return (
    <AppThemeContext>
    <AppDrawerContext>
    <BrowserRouter>
    <DrawerApp>
    <AppRoutes/>
    </DrawerApp>
    </BrowserRouter>
    </AppDrawerContext>
    </AppThemeContext>
  )
}
