import React, {useEffect, useState} from 'react';
import math from "../../assets/json/physics.json";
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;


function PageNotFound(props) {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const sumObj = {};

        for(const q of math) {
            for(const category of q.keywords) {
                sumObj[category] = sumObj[category] ? sumObj[category] + 1 : 1;
            }
        }



        setStats(Object.keys(sumObj).map((x) => ({label: x, y: sumObj[x]})));
        console.log(Object.keys(sumObj).map((x) => ({x: x, y: sumObj[x]})));
    }, []);

    return (
        <div className="statistics-container">
            <h1>Statistik</h1>
            <CanvasJSChart options={
                {
                    animationEnabled: true,
                    theme: "light2", //"light1", "dark1", "dark2"
                    title: {
                        text: "Simple Column Chart with Index Labels"
                    },
                    axisY: {
                        includeZero: true
                    },
                    data: [{
                        type: "pie", //change type to bar, line, area, pie, etc
                        //indexLabel: "{y}", //Shows y value on all Data Points
                        indexLabelFontColor: "#5A5757",
                        indexLabelPlacement: "outside",
                        dataPoints: stats.filter(x => x.y >= 15)
                    }]
                }
            } />
        </div>
    );
}

export default PageNotFound;