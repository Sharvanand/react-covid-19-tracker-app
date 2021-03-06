import React,{ useState, useEffect } from 'react'
import numeral from 'numeral';
import { Line } from 'react-chartjs-2';


const options ={
    legend:{
        display:false
    },
    elements:{
        point:{
            radius:0
        }
    },
    maintainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect:false,
        callback:{
            label:function(tooltipItem,data){
                return numeral(tooltipItem.value("+0,0"))
            }
        }
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time:{
                    format:"MM/DD/YY",
                    tooltipFormat:'ll'
                }
            }
        ],
        yAxes:[
            {
                gridLines:{
                    display: false,
                },
                ticks:{
                    callback:function(value, index, values){
                        return numeral(value).format("0a")
                    }

                }
            }
        ]
    }
}

function LineGraph({casesType = "cases"}) {

    const [data, setData] = useState({})

    const buildChartData =  (data,casesType ='cases')=>{
        const chartData = [];
        let lastDataPoint;
        for(let date in data.cases){
            if(lastDataPoint){
                const newDataPoint = {
                    x:date,
                    y:data[casesType][date] - lastDataPoint
                } 
                chartData.push(newDataPoint);
            } 
            lastDataPoint = data[casesType][date]
         }
        return chartData;
     }
    useEffect(() => {

       const fetchData = async ()=>
       await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=30')
        .then(response => response.json())
        .then(data => {
            const chartData = buildChartData(data, 'cases');
            setData(chartData);
        })
        fetchData();
        },[casesType]);
            return(
                <div>
                { data?.length > 0 && (
                <Line 
                data={{
                    datasets:[{
                        backgroundColor:'rgba(204,16,52,0.5)',
                        borderColor:'#cc1034',
                        data:data}]
                }}
                options={options}
                /> )}
                 </div>
                )
    }

export default LineGraph;
