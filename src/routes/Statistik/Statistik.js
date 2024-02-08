import React, {useEffect, useState} from 'react';
import math from "../../assets/json/physics.json";
import {PieChart, Pie, Cell, Tooltip, Legend} from 'recharts';

function PageNotFound(props) {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const keywordAliases = {
            'mekanik': ['mekanik'],
            "kvantmekanik": [],
            'elektromagnetism': ['elektromagnetism'],
            'termodynamik': [],
            'optik': ['optik', 'stråloptik'],
            'kvantfysik': [],
            'vågrörelse': [],
            'relativitet': ['relativitetsteorin', 'speciell relativitetsteori'],
            'kärnfysik': [],
            'astronomi': ['astronomi'],
            'partikelfysik': [],
            'statisk elektricitet': [],
            'akustik': []
        };

        // Inverting the keywordAliases for easy lookup
        const aliasToGeneric = {};
        Object.entries(keywordAliases).forEach(([generic, aliases]) => {
            aliases.forEach(alias => {
                aliasToGeneric[alias] = generic;
            });
        });

        const sumObj = {};

        for(const q of math) {
            for(const keyword of q.keywords) {
                const genericKeyword = aliasToGeneric[keyword.toLowerCase()] || keyword.toLowerCase();
                if(genericKeyword in keywordAliases) { // Only count if it's a generic keyword
                    sumObj[genericKeyword] = sumObj[genericKeyword] ? sumObj[genericKeyword] + 1 : 1;
                }
            }
        }

        setStats(Object.keys(sumObj).map((x) => ({name: x, value: sumObj[x]})));
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="statistics-container">
            <h1>Statistik</h1>
            <PieChart width={400} height={400}>
                <Pie
                    data={stats}
                    cx={200}
                    cy={200}
                    labelLine={false}
                    label={({name, percent}) => `${ name } ${ (percent * 100).toFixed(0) }%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {stats.map((entry, index) => (
                        <Cell key={`cell-${ index }`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}

export default PageNotFound;
