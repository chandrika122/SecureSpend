import { useEffect, useState } from "react";
import "./dashboard.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
PieChart,
Pie,
Cell,
Tooltip,
Legend,
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
ResponsiveContainer
} from "recharts";

function Dashboard(){

const navigate = useNavigate();
const location = useLocation();

const [expenses,setExpenses]=useState([]);
const [title,setTitle]=useState("");
const [amount,setAmount]=useState("");
const [category,setCategory]=useState("");
const [filter,setFilter]=useState("All");
const [fraudAlert,setFraudAlert]=useState(null);
const [editingExpense,setEditingExpense]=useState(null);
const [editTitle,setEditTitle]=useState("");
const [editAmount,setEditAmount]=useState("");
const [editCategory,setEditCategory]=useState("");
const [paymentMethod,setPaymentMethod]=useState("");

const token=localStorage.getItem("token");

useEffect(()=>{

fetch("http://localhost:8080/api/expenses",{

headers:{ Authorization:`Bearer ${token}` }

})
.then(res=>res.json())
.then(data=>setExpenses(data));

},[]);

const deleteExpense=(id)=>{

fetch(`http://localhost:8080/api/expenses/${id}`,{

method:"DELETE",
headers:{ Authorization:`Bearer ${token}` }

}).then(()=>{

setExpenses(expenses.filter(exp=>exp.id!==id));

});

};

const startEdit=(exp)=>{

setEditingExpense(exp.id);
setEditTitle(exp.title);
setEditAmount(exp.amount);
setEditCategory(exp.category);

};

const updateExpense=()=>{

fetch(`http://localhost:8080/api/expenses/${editingExpense}`,{

method:"PUT",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({

title:editTitle,
amount:editAmount,
category:editCategory

})

})
.then(res=>res.json())
.then(data=>{

setExpenses(

expenses.map(exp=>
exp.id===editingExpense?data:exp
)

);

setEditingExpense(null);

});

};

const totalAmount=
expenses.reduce((sum,exp)=>sum+exp.amount,0);

const averageExpense=
expenses.length===0?0:totalAmount/expenses.length;

const addExpense=()=>{

fetch("http://localhost:8080/api/expenses",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({

title,
amount:Number(amount),
category,
paymentMethod

})

})
.then(res=>res.json())
.then(data=>{

setExpenses([...expenses,data]);

if(data.amount>averageExpense*3){

setFraudAlert({

amount:data.amount,
category:data.category,
average:averageExpense.toFixed(2)

});

}

setTitle("");
setAmount("");
setCategory("");

});

};

const categoryData={};

expenses.forEach(exp=>{

if(categoryData[exp.category]){

categoryData[exp.category]+=exp.amount;

}else{

categoryData[exp.category]=exp.amount;

}

});

const chartData=
Object.keys(categoryData).map(key=>({

name:key,
value:categoryData[key]

}));

const monthlyData={};

expenses.forEach(exp=>{

const month=
new Date(exp.date)
.toLocaleString("default",{month:"short"});

if(monthlyData[month]){

monthlyData[month]+=exp.amount;

}else{

monthlyData[month]=exp.amount;

}

});

const monthlyChartData=
Object.keys(monthlyData).map(key=>({

month:key,
amount:monthlyData[key]

}));

return(

<div className="dashboard">

{/* SIDEBAR */}

<div className="sidebar">

<div className="logo">
SecureSpend
</div>

<ul>

<li
className={location.pathname==="/dashboard"?"active":""}
onClick={()=>navigate("/dashboard")}
>
Dashboard
</li>

<li
className={location.pathname==="/expenses"?"active":""}
onClick={()=>navigate("/expenses")}
>
Expenses
</li>

<li
className={location.pathname==="/reports"?"active":""}
onClick={()=>navigate("/reports")}
>
Reports
</li>

<li
onClick={()=>{

localStorage.removeItem("token");
navigate("/");

}}
>
Logout
</li>

</ul>

</div>

{/* MAIN CONTENT */}

<div className="main">

<h1>Expense Dashboard</h1>

{/* rest of your code stays SAME */}

{/* RISK */}

{(()=>{

const highRiskExp=
expenses.find(exp=>exp.amount>7000);

if(!highRiskExp) return null;

return(

<div className="high-risk-banner">

<strong>
High Risk Transaction Detected
</strong>

<p>
{highRiskExp.title}
— ₹{highRiskExp.amount}
</p>

</div>

);

})()}

{/* CARDS */}

<div className="cards">

<div className="card">
<h3>Total Expenses</h3>
<p>₹ {totalAmount}</p>
</div>

<div className="card">
<h3>Total Transactions</h3>
<p>{expenses.length}</p>
</div>

<div className="card">
<h3>Average Expense</h3>
<p>₹ {averageExpense.toFixed(2)}</p>
</div>

</div>

{/* CHARTS */}

<div className="charts">

<div className="chart-box">

<h2>Monthly Expenses</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={monthlyChartData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="amount" fill="#6c63ff"/>

</BarChart>

</ResponsiveContainer>

</div>

<div className="chart-box">

<h2>Expense Distribution</h2>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={chartData}
dataKey="value"
nameKey="name"
outerRadius={100}
>

{chartData.map((entry,index)=>(

<Cell
key={index}
fill={
["#6c63ff","#00c49f",
"#ffbb28","#ff8042"]
[index%4]
}
/>

))}

</Pie>

<Tooltip/>

<Legend/>

</PieChart>

</ResponsiveContainer>

</div>

</div>

{/* ADD EXPENSE */}

<div className="add-expense">

<input
placeholder="Expense Title"
value={title}
onChange={e=>setTitle(e.target.value)}
/>

<input
type="number"
placeholder="Amount"
value={amount}
onChange={e=>setAmount(e.target.value)}
/>

<select
value={category}
onChange={e=>setCategory(e.target.value)}
>

<option value="">Select Category</option>

<option>Food</option>
<option>Groceries</option>
<option>Transport</option>
<option>Shopping</option>

</select>

<select
value={paymentMethod}
onChange={e=>setPaymentMethod(e.target.value)}
>

<option value="">Payment Method</option>

<option>UPI</option>
<option>Credit Card</option>
<option>Debit Card</option>

</select>

<button onClick={addExpense}>
Add Expense
</button>

</div>

{/* FILTER */}

<div className="filter-box">

<label>Filter:</label>

<select
onChange={e=>setFilter(e.target.value)}
>

<option>All</option>
<option>Food</option>
<option>Groceries</option>

</select>

</div>

{/* TABLE */}

<div className="table-box">

<table>

<thead>

<tr>

<th>Title</th>
<th>Amount</th>
<th>Category</th>
<th>Action</th>
<th>Payment</th>

</tr>

</thead>

<tbody>

{expenses

.filter(exp=>
filter==="All"||
exp.category===filter
)

.map(exp=>(

<tr key={exp.id}>

<td>{exp.title}</td>

<td>₹{exp.amount}</td>

<td>{exp.category}</td>

<td>

<button onClick={()=>startEdit(exp)}>
Edit
</button>

<button onClick={()=>deleteExpense(exp.id)}>
Delete
</button>

</td>

<td>
{exp.paymentMethod}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

);

}

export default Dashboard;