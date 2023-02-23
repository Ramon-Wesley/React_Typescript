import { createTheme } from "@mui/material";
import { cyan, purple } from "@mui/material/colors";


export const DarkTheme=createTheme({
    palette:{
        mode:'dark',
        primary:{
            light:purple[400],
            main:purple[500],
            dark:purple[700]
        },
        secondary:{
            light:cyan[400],
            main:cyan[500],
            dark:cyan[700]
        },
        background:{
            default:'#010101',
            paper:'#0c0c0c'
        }
    },
    typography:{
        allVariants:{
            color:'#FFFFFF'
        }
    }
})