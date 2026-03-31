import { useEffect, useState } from "react";
import "./Expenses.css";
import "../pages/dashboard.css";

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState(null);

    // Fetch expenses
    useEffect(() => {
        fetch("http://localhost:8080/api/expenses", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((data) => setExpenses(data));
    }, []);

    // Add or Update
    const addExpense = async () => {
        let url = "http://localhost:8080/api/expenses";
        let method = "POST";

        if (editing) {
            url += "/" + editing.id;
            method = "PUT";
        }

        const expenseData = {
            title,
            amount,
            category,
            paymentMethod,
            date: new Date(),
        };

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify(expenseData),
        });

        if (response.ok) {
            alert(editing ? "Transaction Updated" : "Transaction Added");
            window.location.reload();
        }
    };

    // Delete
    const deleteExpense = async (id) => {
        await fetch("http://localhost:8080/api/expenses/" + id, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        });
        setExpenses(expenses.filter((e) => e.id !== id));
    };

    // Edit
    const editExpense = (exp) => {
        setEditing(exp);
        setTitle(exp.title);
        setAmount(exp.amount);
        setCategory(exp.category);
        setPaymentMethod(exp.paymentMethod);
    };

    // Risk + Fraud score
    const getRisk = (exp) => {
        let score = 0;
        if (exp.amount > 7000) score += 50;
        if (exp.paymentMethod === "Credit Card") score += 25;
        if (exp.category === "Shopping") score += 15;
        if (exp.amount > 3000) score += 10;

        let risk = "Low";
        if (score > 70) risk = "High";
        else if (score > 40) risk = "Medium";

        return (
            <div>
                <div>
                    {risk === "High" && <span className="risk-high">High</span>}
                    {risk === "Medium" && <span className="risk-medium">Medium</span>}
                    {risk === "Low" && <span className="risk-low">Low</span>}
                </div>
                <div style={{ fontSize: "12px" }}>Fraud Score: {score}%</div>
            </div>
        );
    };

    // Fraud flag
    const fraudCheck = (exp) => {
        if (exp.amount > 7000) return "🚨 Possible Fraud";
        if (exp.paymentMethod === "Credit Card" && exp.amount > 4000)
            return "⚠ Card Risk";
        return "Safe";
    };

    // Search filter
    const filtered = expenses.filter((exp) =>
        exp.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="expenses-page">
            <h1>Transaction Surveillance</h1>

            {/* FORM */}
            <div className="expense-form">
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option>Payment</option>
                    <option>UPI</option>
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Wallet</option>
                </select>

                <button className="add-btn" onClick={addExpense}>
                    {editing ? "Update" : "Add"} Transaction
                </button>
            </div>

            {/* SEARCH */}
            <input
                className="search"
                placeholder="Search transactions..."
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* TABLE */}
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Payment</th>
                        <th>Date</th>
                        <th>Risk</th>
                        <th>Fraud Check</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.map((exp) => (
                        <tr key={exp.id}>
                            <td>{exp.title}</td>
                            <td>₹{exp.amount}</td>
                            <td>{exp.category}</td>
                            <td>{exp.paymentMethod}</td>
                            <td>{new Date(exp.date).toLocaleDateString()}</td>
                            <td>{getRisk(exp)}</td>
                            <td>{fraudCheck(exp)}</td>
                            <td>
                                <button className="edit-btn" onClick={() => editExpense(exp)}>
                                    Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteExpense(exp.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Expenses;