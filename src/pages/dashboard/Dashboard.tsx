import { SearchTools } from "../../shared/components/searchTools/SearchTools"
import { LayoutBase } from "../../shared/layouts"




export const Dashboard=()=>{

    return(<LayoutBase
    title="Dashboard"
        tools={<SearchTools
        textButton="Nova"
        />}
    >Dashboard</LayoutBase>
    )
}