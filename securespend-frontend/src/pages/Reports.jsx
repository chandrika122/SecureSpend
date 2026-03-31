import { useEffect, useState } from "react";

import {
PieChart,
Pie,
Cell,
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
LineChart,
Line,
ResponsiveContainer
} from "recharts";

import jsPDF from "jspdf";

import "./Reports.css";

function Reports(){

const [expenses,setExpenses]=useState([]);

const token=localStorage.getItem("token");

useEffect(()=>{

fetch("http://localhost:8080/api/expenses",{

headers:{
Authorization:"Bearer "+token
}

})
.then(res=>res.json())
.then(data=>setExpenses(data))
.catch(()=>setExpenses([]));

},[]);

const getRiskLevel=(exp)=>{

let score=0;

if(exp.amount>7000) score+=50;

if(exp.paymentMethod==="Credit Card")
score+=25;

if(exp.category==="Shopping")
score+=15;

if(exp.amount>3000)
score+=10;

if(score>70) return "High";

if(score>40) return "Medium";

return "Low";

};

const highCount=
expenses.filter(e=>
getRiskLevel(e)==="High"
).length;

const mediumCount=
expenses.filter(e=>
getRiskLevel(e)==="Medium"
).length;

const lowCount=
expenses.filter(e=>
getRiskLevel(e)==="Low"
).length;

const totalCount=expenses.length;

const riskData=[

{name:"High",value:highCount},
{name:"Medium",value:mediumCount},
{name:"Low",value:lowCount}

];

const paymentCounts={};

expenses.forEach(exp=>{

const method=
exp.paymentMethod||"Other";

paymentCounts[method]=
(paymentCounts[method]||0)+1;

});

const paymentData=
Object.keys(paymentCounts).map(key=>({

name:key,
value:paymentCounts[key]

}));

const monthlyCounts={};

expenses.forEach(exp=>{

const month=
new Date(exp.date)
.toLocaleString("default",
{month:"short"});

monthlyCounts[month]=
(monthlyCounts[month]||0)
+exp.amount;

});

const monthly=
Object.keys(monthlyCounts)
.map(key=>({

name:key,
value:monthlyCounts[key]

}));

const COLORS=[
"#ff5252",
"#ff9800",
"#4caf50"
];

const exportPDF=()=>{

const doc=new jsPDF();

doc.setFontSize(18);

doc.text(
"SecureSpend Fraud Intelligence Report",
20,
20
);

doc.save("SecureSpend_Report.pdf");

};

return(

<div className="dashboard-layout">

{/* MAIN CONTENT */}

<div className="reports-page">

<div className="reports-header">

<h1>Fraud Intelligence Reports</h1>

<button
className="pdf-btn"
onClick={exportPDF}
>

Export Report PDF

</button>

</div>

{/* GRID */}

<div className="report-grid">

{/* RISK */}

<div className="report-card">

<h3>Risk Distribution</h3>

<div className="card-content">

<div className="chart-area">

<ResponsiveContainer
width="100%"
height="100%"
>

<PieChart>

<Pie
data={riskData}
dataKey="value"
outerRadius={80}
>

{riskData.map((entry,index)=>(

<Cell
key={index}
fill={COLORS[index]}
/>

))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

<div className="chart-info">

<h2>{totalCount} Transactions</h2>

<p>🚨 High → {highCount}</p>

<p>⚠ Medium → {mediumCount}</p>

<p>✅ Low → {lowCount}</p>

</div>

</div>

</div>

{/* PAYMENT */}

<div className="report-card">

<h3>Payment Analytics</h3>

<div className="card-content">

<div className="chart-area">

<ResponsiveContainer
width="100%"
height="100%"
>

<BarChart data={paymentData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="value" fill="#2196f3"/>

</BarChart>

</ResponsiveContainer>

</div>

<div className="chart-info">

<h2>{expenses.length} Payments</h2>

{paymentData.map((p,i)=>(

<p key={i}>
{p.name}: {p.value}
</p>

))}

</div>

</div>

</div>

{/* TREND */}

<div className="report-card">

<h3>Transaction Trend</h3>

<div className="card-content">

<div className="chart-area">

<ResponsiveContainer
width="100%"
height="100%"
>

<LineChart data={monthly}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="value"
stroke="#4CAF50"
/>

</LineChart>

</ResponsiveContainer>

</div>

<div className="chart-info">

<h2>Monthly Pattern</h2>

{monthly.map((m,i)=>(

<p key={i}>
{m.name}: ₹{m.value}
</p>

))}

</div>

</div>

</div>

{/* ALERT */}

<div className="report-card">

<h3>Fraud Alerts</h3>

<div className="chart-info-full">

<p>🚨 High : {highCount}</p>

<p>⚠ Medium : {mediumCount}</p>

<p>✅ Safe : {lowCount}</p>

</div>

</div>

</div>

</div>

</div>

);

}

export default Reports;