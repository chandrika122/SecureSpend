function FraudPopup({amount,category,onClose}){

return(

<div className="fraud-overlay">

<div className="fraud-popup">

<h2>⚠ Fraud Risk Alert</h2>
<h2 style={{color:"red"}}>
⚠ Fraud Risk Alert
</h2>

<p><b>Transaction:</b> ₹{amount}</p>

<p><b>Category:</b> {category}</p>

<p>This transaction looks unusual.</p>

<button onClick={onClose}>
Dismiss
</button>

</div>

</div>

);

}

export default FraudPopup;