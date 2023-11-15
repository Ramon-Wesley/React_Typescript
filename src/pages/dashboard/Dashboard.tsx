import { SearchTools } from "../../shared/components/searchTools/SearchTools";
import { LayoutBase } from "../../shared/layouts";
import {
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { IPersons, PersonService } from "../../shared/services/api/cliente";
import { CitiesService } from "../../shared/services/api/cities/CitiesService";
import { VendasService } from "../../shared/services/api/vendas/Vendas";
import { ComprasService } from "../../shared/services/api/compras/Compras";
import { api } from "../../shared/services/api/axios";
import { IDataCountPdf, valueSearch } from "../../shared/services/api/pdf/PdfService";
import { Graficos, IGraficoData } from "../../shared/grafico/Grafico";

export const Dashboard = () => {
  const [compra, setCompra] = useState<IGraficoData>({} as IGraficoData);
  const [valoresCompra,setValoresCompra]=useState<number[]>([0,0,0,0,0,0,0]);
  const [citiesCount, setCitiesCount] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const dataAtual = new Date();
  var ano = dataAtual.getFullYear();
  var mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // Adiciona um zero à esquerda, se necessário
  var dia = dataAtual.getDate().toString().padStart(2, '0'); // Adiciona um zero à esquerda, se necessário
  var dataFormatadaInicio = new Date(ano + '-' + mes + '-' + dia);
  const dataUmaSemanaAtras = new Date();
  dataUmaSemanaAtras.setDate(dataUmaSemanaAtras.getDate() - 7);
  ano = dataUmaSemanaAtras.getFullYear();
  mes = (dataUmaSemanaAtras.getMonth() + 1).toString().padStart(2, '0'); // Adiciona um zero à esquerda, se necessário
  dia = dataUmaSemanaAtras.getDate().toString().padStart(2, '0');
  var dataFormatadaFinal =new Date(ano + '-' + mes + '-' + dia);
  const valuesDate={
    dataFinal:"2023-10-31" ,
    dataInicio:"2023-10-20" 
  }
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

const searchCompras=useCallback(async()=>{
 const {data}= await api.post<IDataCountPdf>(`/compras/relatorio`,valuesDate)
if(data){ 
 
  data.data.forEach((e) => {
    if(e.data){
      const diaSemana = new Date(e.data).getDay();
      if(diaSemana ){
        valoresCompra[diaSemana]= e?.valortotal || 0;
        
      }
    }
  });
  console.log(valoresCompra)
  
  setCompra({

      labels: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      datasets: [
        {
          label: "Compras",
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.4)',
          hoverBorderColor: 'rgba(75,192,192,1)',
          data: [0,0,0,0,0,0,0]
        },
      ],
    
  })
 


}

},[])
  

const searchVendas=useCallback(async()=>{
  console.log(valuesDate)
  const {data}=  await api.post<IDataCountPdf>(`vendas/relatorio`,valuesDate)
},[])

  useEffect(() => {
    setIsLoading(true);
    searchCompras()
    searchVendas()
  }, []);

 

  return (
    <LayoutBase title="Dashboard">
      <Box>
        <Grid container spacing={2} gap={1}>
          <Grid
            item
            xs={12}
            sm={5}
            md={5}
            lg={4}
            xl={2}
            gap={2}
            padding={2}
            component={Paper}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant={smDown ? "h4" : mdDown ? "h5" : "h6"}>
              Compras
            </Typography>

                    
          </Grid>
          <Grid
            item
            component={Paper}
            xs={12}
            sm={5}
            md={5}
            lg={4}
            xl={2}
            gap={2}
            padding={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
             <Typography variant={smDown ? "h4" : mdDown ? "h5" : "h6"}>Cidades</Typography>
             <Typography variant={smDown ? "h4" : mdDown ? "h5" : "h6"}>{citiesCount}</Typography>
          </Grid>
        </Grid>
      </Box>
    </LayoutBase>
  );
};
