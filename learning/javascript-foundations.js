const transactions = [
{
    id: 1,
    type: "income",
    amount: 50000,
    category: "Salary",
    description: "Monthly Salary"
},
{
    id: 2,
    type: "expense",
    amount: 5000,
    category: "Food",
    description: "Groceries"
},
{
    id: 3,
    type: "expense",
    amount: 8000,
    category: "Transport",
    description: "Gas"
},
{
    id: 1,
    type: "expense",
    amount: 4000,
    category: "Utilities",
    description: "Electric"
},
{
    id: 1,
    type: "income",
    amount: 5000,
    category: "Freelance",
    description: "Freelance Project"
}
]

const expense = transactions.filter(transactions => transactions.type === "expense")
console.log(expense)

const salary = transactions.find(transactions => transactions.category === "Salary")
console.log(salary)

const descriptions = transactions.map(transactions => transactions.description)
console.log(descriptions)

const totalIncome = transactions.reduce((total, transaction) => {
    if(transaction.type === "income") {
        return total + transaction.amount
    }

    return total
}, 0)

console.log(totalIncome)

const totalExpense = transactions.reduce((total, transaction) => {
    if(transaction.type === "expense") {
        return total + transaction.amount
    }

    return total
}, 0)

console.log(totalExpense)

const balance = totalIncome - totalExpense

console.log(balance)

function calculateIncome(transactions) {
    return transactions.reduce((total, transaction) => {
        if(transaction.type === "income") {
            return total + transaction.amount
        }
        return total
    }, 0)
}

function calculateExpense(transactions) {
    return transactions.reduce((total, transaction) => {
        if(transaction.type === "expense") {
            return total + transaction.amount
        }
        return total
    }, 0)
}

function calculateTotals(transactions) {
    const income = calculateIncome(transactions)
    const expense = calculateExpense(transactions)

    return income - expense
}

console.log("----- GildedGoose Summary -----");
console.log(`Income: ${calculateIncome(transactions)}`);
console.log(`Expenses: ${calculateExpense(transactions)}`);
console.log(`Balance: ${calculateTotals(transactions)}`);