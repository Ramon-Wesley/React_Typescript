import { Box, ThemeProvider } from "@mui/material"
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { DarkTheme } from "../theme/DarkTheme"
import { LightTheme } from "../theme/LightTheme"

interface IThemeContextOption{
    toggleTheme:()=>void
    theme:'dark'|'light'
}
const ThemeContextOption=createContext({} as IThemeContextOption)

export const useThemeContextOption=()=>{
    return useContext(ThemeContextOption)
}



interface IAppThemeContext{
    children:React.ReactNode
}
export const AppThemeContext:React.FC<IAppThemeContext>=({children})=>{

    const[theme,setTheme]=useState<"dark"|'light'>('light')

    const toggleTheme=useCallback(()=>{
        setTheme((oldSetTheme)=>oldSetTheme === 'light' ? 'dark' : 'light')
    },[])

    const getTheme=useMemo(()=>{
        if(theme === 'light') return LightTheme

        return DarkTheme
    },[theme])

    return(
        <ThemeContextOption.Provider value={{toggleTheme,theme}}>
            <ThemeProvider theme={getTheme}>
                <Box width='100vw' height='100vh' bgcolor={getTheme.palette.background.default}>
                  {children}
                </Box>

            </ThemeProvider>
        </ThemeContextOption.Provider>
    )
}