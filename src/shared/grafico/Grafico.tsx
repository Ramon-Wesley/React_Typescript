import { ChartDataset } from 'chart.js/auto';
import {Bar} from "react-chartjs-2"



export interface IGraficoData {
    labels: string[],
    datasets: [{
        label: string,
        backgroundColor: string,
        borderColor: string,
        borderWidth:number,
        hoverBackgroundColor: string,
        hoverBorderColor: string,
        data: number[],
      },
    ]
    
  } 
  

export const Graficos:React.FC<IGraficoData>=({datasets,labels})=>{

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  return(
    <Bar data={{datasets:datasets,labels:labels}} options={options}/>
      )


}