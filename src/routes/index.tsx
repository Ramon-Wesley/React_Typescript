import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Citie } from "../pages/cities/Cities";
import { CityDetail } from "../pages/cities/CityDetail";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { PersonDetail } from "../pages/person";
import { People } from "../pages/person/Person";
import { Login } from "../shared/components/login/Login";
import { useDrawerContext } from "../shared/context";

export const AppRoutes = () => {
  const { handleOptions } = useDrawerContext();

  useEffect(() => {
    handleOptions([
      {
        icon: "home",
        label: "Pagina inicial",
        path: "/pagina-inicial",
      },
      {
        icon: "location_city",
        label: "Cidades",
        path: "/cidades",
      },
      {
        icon: "people",
        label: "Pessoas",
        path: "/pessoas",
      },
    ]);
  }, []);

  //  <Route path="*" element={<Navigate to="/pagina-inicial" />} />
  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />
      <Route path="/pessoas" element={<People />} />
      <Route path='/cidades' element={<Citie/>}/>
      <Route path="/pessoas/detalhe/:id" element={<PersonDetail />} />
      <Route path="/cidades/detalhe/:id" element={<CityDetail />} />
      <Route path='*' element={<Navigate to='/pagina-inicial'/>}/>
    </Routes>
  );
};
