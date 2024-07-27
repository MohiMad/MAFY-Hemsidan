import React, {useEffect, useState} from 'react';
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import Utility from "../../Utility.js";
import './Statistik.css';
import Button from "../../components/Button/Button.js";
import {NavLink} from "react-router-dom";

function Statistik(props) {
    const [mathStats, setMathStats] = useState([]);
    const [physicsStats, setPhysicsStats] = useState([]);

    useEffect(() => {
        const groupedMathKeywords = Utility.getNumberedKeywords(true);
        const mathStatsArray = Array.from(groupedMathKeywords, ([key, value]) => ({name: key, value: value}));
        setMathStats(mathStatsArray);

        const groupedPhysicsKeywords = Utility.getNumberedKeywords();
        const physicsStatsArray = Array.from(groupedPhysicsKeywords, ([key, value]) => ({name: key, value: value}));
        setPhysicsStats(physicsStatsArray);
    }, []);

    const colors = [
        "#C71585", "#FF6347", "#FF4500", "#2E8B57", "#4682B4", "#9400D3", "#8B0000",
        "#FF8C00", "#483D8B", "#556B2F", "#FF1493", "#1E90FF", "#008B8B", "#B8860B",
        "#9932CC", "#8FBC8F", "#B22222", "#DAA520", "#CD5C5C", "#006400"
    ];

    return (
        <div className="statistics-container">
            <h2>Statistik för uppgifter</h2>
            <p>Nedan har vi, med hjälp av ChatGPT klassificierad de olika provuppgifterna baserat på vilka ämnen de handlar om. Hoovra över delarna av tårtdiagrammet för att se vilket område det är samt hur många frågor det har kommit om ämnet totalt. Genom att titta på tårtdiagrammen nedan kan du stratigera ditt pluggande och se till att du spetsar dig i dem områden som är mest relevanta!</p>
            <br />
            <p>OBS: Statistiken är prelimär och kommer uppdateras kontinuerligt.</p>
            <div className="math-physics-div">
                <div className="math">
                    <h3>Matematik</h3>
                    <div className="PieChart-responsive">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mathStats}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="80%"
                                    labelLine={false}
                                    dataKey="value"
                                >
                                    {mathStats.map((entry, index) => (
                                        <Cell key={`cell-${ index }`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="physics">
                    <h3>Fysik</h3>
                    <div className="PieChart-responsive">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={physicsStats}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="80%"
                                    labelLine={false}
                                    dataKey="value"
                                >
                                    {physicsStats.map((entry, index) => (
                                        <Cell key={`cell-${ index }`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <h3>Känner dig osäker på ett visst område? </h3>
            <p>Inga problem! Tryck på knapparna nedan för att filtrera matematik- eller fysikfrågor utifrån ämne!</p>
            <div className="btn-divider">
                <NavLink onClick={() => Utility.toTop(window)} to="../matematik/ämne"><Button>Filtrera Matematikfrågor</Button></NavLink>
                <NavLink onClick={() => Utility.toTop(window)} to="../fysik/ämne"><Button>Filtrera Fysikfrågor</Button></NavLink>
            </div>
        </div>
    );
}

export default Statistik;
