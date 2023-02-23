import { Box,Typography,Paper,useTheme, useMediaQuery, Menu, IconButton, Icon } from "@mui/material";
import { DrawerApp } from "../components/drawer/DrawerApp";
import { useDrawerContext } from "../context";





interface ILayoutBase{
    children:React.ReactNode;
    tools?:React.ReactNode
    title:string
}
export const LayoutBase:React.FC<ILayoutBase>=({children,tools,title})=>{
    const theme=useTheme()
    const smDown=useMediaQuery(()=>theme.breakpoints.down('sm'))
    const mdDown=useMediaQuery(()=>theme.breakpoints.down('md'))
    const {handleToggleOpen}=useDrawerContext()
    return(
        <Box display='flex' flexDirection='column' padding={1}  >
            <Box display='flex' gap={2} alignItems='center' >
                { smDown&&(
                    <IconButton onClick={handleToggleOpen}><Icon>menu</Icon></IconButton>
                )}
                <Typography variant={smDown?'h5':mdDown?'h4':'h3'}>{title}</Typography>
            </Box>
            {tools && (
                <Box component={Paper} variant='outlined' width='100%' display='flex'  alignItems='center' height={smDown?theme.spacing(6):mdDown?theme.spacing(8):theme.spacing(10)}>{tools}</Box>
            )}

            <Box flex={1}>{children}</Box>
        </Box>
    )
}