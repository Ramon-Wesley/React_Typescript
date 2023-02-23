import {Box,Button,Icon,Divider,Skeleton} from '@mui/material'



interface IDetailTools{
    textNew?:string

    onclickSave?:()=>void;
    onclickSaveAndBack?:()=>void
    onclickBack?:()=>void
    onclickNew?:()=>void
    onclickDelete?:()=>void

    onNew?:boolean
    onBack?:boolean
    onSaveAndBack?:boolean
    onSave?:boolean
    onDelete?:boolean

    isLoading?:boolean

   

}
export const DetailsTools:React.FC<IDetailTools>=(
    {
         textNew='Novo',
         isLoading=false,
         onBack,
         onNew,
         onSave,
         onSaveAndBack,
         onDelete,
         onclickBack, 
         onclickNew, 
         onclickSave, 
         onclickDelete,
         onclickSaveAndBack
    }
)=>{

    return(
        <Box  display='flex' padding={2} gap={2}>

<Skeleton component={Button} >
    
            </Skeleton>
            <Button 
            onClick={onclickSave}
            variant='contained'
            startIcon={<Icon>save</Icon>}
            >Salvar</Button>

            <Button 
            onClick={onclickSaveAndBack}
            variant='contained'
            startIcon={<Icon>save</Icon>}
            >Salvar e voltar</Button>



            <Button 
            onClick={onclickDelete}
            variant='contained'
            startIcon={<Icon>delete</Icon>}
            >Apagar</Button>

            <Button 
            onClick={onclickBack}
            variant='contained'
            startIcon={<Icon>arrow_back</Icon>}
            >voltar</Button>
<Divider />
            <Button 
            onClick={onclickNew}
            variant='contained'
            ><Icon>add</Icon>{textNew}</Button>
        </Box>
    )
}