import { useEffect } from "react"
import { Routes,Route,Navigate } from "react-router-dom"
import { Dashboard } from "../pages/dashboard/Dashboard"
import { PersonDetail } from "../pages/person"
import { People } from "../pages/person/Person"
import { useDrawerContext } from "../shared/context"





export const AppRoutes=()=>{

    const {handleOptions}= useDrawerContext()
    
    useEffect(()=>{
        handleOptions([
            {
                icon:'home',
                label:'Pagina inicial',
                path:'/pagina-inicial',
            },
            {
                icon:'people',
                label:'Pessoas',
                path:'/pessoas'
            }
        ])
    },[])

    return(
        <Routes>
            <Route path='/pagina-inicial' element={<Dashboard/>}/>
            <Route path='/pessoas' element={<People/>}/>
            <Route path='/pessoas/detalhe/:id' element={<PersonDetail/>}/>
            <Route path='*' element={<Navigate to='/pagina-inicial'/>}/>
        </Routes>
    )
}