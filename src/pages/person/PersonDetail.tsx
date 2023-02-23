import { useParams } from "react-router-dom"
import { DetailsTools } from "../../shared/components/detailsTools/DetailsTools"
import { LayoutBase } from "../../shared/layouts"





export const PersonDetail:React.FC=()=>{
    const {id}=useParams()

    return(
        <LayoutBase
        title={id === 'nova' ? 'Cadastro de pessoa' : 'ok'}
        tools={<DetailsTools/>}
        >
            ok
        </LayoutBase>
    )
}