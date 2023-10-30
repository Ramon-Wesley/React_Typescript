import { api } from "../axios";

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";



export interface IPdf{
    nome?:string
    quantidade?:number
    valor?:number
    data?:Date
    valortotal?:number
}

export interface valueSearch{
    dataInicio:Date,
    dataFinal:Date
}
interface IRodape{
 text:string,
 alignment:string,
 fontSize:number,
 bold?:boolean,
 margin:number[]
}

interface IDataCount {
    data: IPdf[] 
    totalCount: {count:number};
  }

 export type TLink="relatorio/produto" | "relatorio"
export type TTipo="compras"| "vendas"

export const createPdf= async(datas:valueSearch,tipos:TTipo,link:TLink):Promise<pdfMake.TCreatedPdf | Error> =>{

    try {
    const {data}=  await api.post<IDataCount>(`/${tipos}/${link}`,datas)
    console.log(data)
    if(data) {
        (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

        const Title=
            {
                text:tipos,
                fontSize:15,
                bold: true,
                margin:[15,20,0,45]
            }
        
        const rodape={

            text:data.totalCount.toString() + "/"+data.totalCount.toString(),
            alignment:"right",
            fontSize:9,
            margin:[0,10,20,0]
        }

       
        let detalhe=[{}] as Content
        if(link === "relatorio/produto"){
             detalhe=[{
                table:{
                    
                    headerRows:1,
                    widths:["*","*","*"],
                    body:[
                        [ {text:"nome",style:"tableHeader",fontSize:10},{text:"quantidade",style:"tableHeader",fontSize:10},{text:"valor",style:"tableHeader",fontSize:10}],
                        ...data.data.map((e)=>{
                            return[
                                {text:e?.nome,fontSize:9, margin:[0,2,0,2]},
                                {text:e?.quantidade,fontSize:9,margin:[0,2,0,2]},
                                {text:e?.valor,fontSize:9,margin:[0,2,0,2]},
                            ]
                        })
                    ],
                },
                layout:"lightHorizontalLines"
            }]
        }else{
            detalhe=[{
                table:{
                    
                    headerRows:1,
                    widths:["*","*"],
                    body:[
                        [ {text:"data",style:"tableHeader",fontSize:10},{text:"valor",style:"tableHeader",fontSize:10}],
                        ...data.data.map((e)=>{
                            return[
                                {text:e?.data,fontSize:9, margin:[0,2,0,2]},
                                {text:e?.valortotal,fontSize:9,margin:[0,2,0,2]},
                            ]
                        })
                    ],
                },
                layout:"lightHorizontalLines"
            }]
        }

        const docDefinidos:TDocumentDefinitions ={
            pageSize: 'A4',
            pageMargins:[15,50,15,40],
            
            header:[{
                text:tipos+`\n Periodo: ${datas.dataInicio.toISOString()} / ${datas.dataFinal.toISOString()} `,
                fontSize:15,
                bold: true,
                margin:[15,20,0,45]
            }],
            content: [detalhe],
            footer:[{
            text:data.totalCount.toString() + "/"+data.totalCount.toString(),
            alignment:"right",
            fontSize:9,
            margin:[0,10,20,0]
            }]
              }
        

       return  pdfMake.createPdf(docDefinidos)
    }
  
    return new Error('Erro ao cadastrar o registro')
    } catch (error) {
      return new Error((error as {message:string}).message || 'Erro ao cadastrar o registro!')
      
    }
  }

 