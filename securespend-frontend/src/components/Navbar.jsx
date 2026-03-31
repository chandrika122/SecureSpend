import { useState } from "react";

function Navbar(){

const [showAlerts,setShowAlerts]=useState(false);

const alerts=[
"₹600 Unusual Food Spending",
"₹5000 Large Shopping Transaction"
];

return(

<div className="navbar">

<div className="nav-right">

<div className="notification">

<button onClick={()=>setShowAlerts(!showAlerts)}>
 {alerts.length}
</button>

{showAlerts && (

<div className="alert-dropdown">

<h4>Fraud Alerts</h4>

{alerts.map((alert,index)=>(
<p key={index}>{alert}</p>
))}

</div>

)}

</div>



</div>

</div>

);

}

export default Navbar;