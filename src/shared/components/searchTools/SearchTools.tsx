import { Box, TextField,Button,Icon } from "@mui/material"






interface ISearchTools{
    textButton?:string;
    valueTextInput?:string
    onclickButton?:()=>void;
    onchangeInput?:(text:string)=>void
}
export const SearchTools:React.FC<ISearchTools>=({
    textButton='Novo',
    onclickButton,
    onchangeInput,
    valueTextInput=''
})=>{

    return(
        <Box display='flex' width='100%' alignItems='center' justifyContent='space-between' paddingX={2}>
            <TextField 
            size="small"
            placeholder="Pesquisar..."
            onChange={(e)=>onchangeInput?.(e.target.value)}
            value={valueTextInput}

            />
    <Button variant='contained' startIcon={<Icon>add</Icon>} onClick={onclickButton}>
        {textButton}
    </Button>
        </Box>
    )
}