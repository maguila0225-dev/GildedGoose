class Transaction {
    constructor(id, description, type, amount, accountId, category) {
        this.id = id;
        this.description = description;
        this.type = type;
        this.amount = amount;
        this.accountId = accountId;
        this.category = category;
    }
}

class Account {
    constructor(id, name, balance) {
        this.id = id
        this.name = name
        this.balance = balance
    }
}

const accounts = [
    new Account(1, "Main Checking", 50000),
    new Account(2, "Savings", 20000)
];

const transactions = [
    new Transaction(1, "Salary", "income", 50000, 1, "Salary"),
    new Transaction(2, "Groceries", "expense", 2500, 1, "Food"),
    new Transaction(3, "Gas", "expense", 1500, 1, "Transportation"),
    new Transaction(4, "Movie Tickets", "expense", 800, 2, "Entertainment"),
    new Transaction(5, "Freelance Project", "income", 5000, 1, "Freelance"),
    new Transaction(6, "Restaurant", "expense", 1200, 2, "Food"),
    new Transaction(7, "Magic Cards", "expense", 3000, 1, "Entertainment")
];

function getTotalByType(type, transactions) {
    return transactions
        .filter(transaction => transaction.type === type)
        .reduce((total, transaction) => transaction.amount + total, 0)
}

function getAccountBalance(accountId, transactions) {
    const account = accounts.find(account => account.id === accountId)

    if(!account) {
        return 0
    }

    const accountTransactions = transactions.filter(transaction => transaction.accountId === accountId)
    const income = accountTransactions
                    .filter(transaction => transaction.type === "income")
                    .reduce((total, transaction) => total + transaction.amount, 0)
    const expense = accountTransactions
                    .filter(transaction => transaction.type === "expense")
                    .reduce((total, transaction) => total + transaction.amount, 0)

    const accountChange = income - expense
    return account.balance + accountChange
}


function addTransaction({description, type, amount, accountId, category}, transactions) {
    const highestId = transactions.reduce((highest, transaction) => Math.max(highest, transaction.id), 0)
    const newTransaction = new Transaction(
        highestId + 1,
        description,
        type,
        amount,
        accountId,
        category
    )
    transactions.push(newTransaction)

    return newTransaction
}

function getCategories() {
    const categories = transactions
    .filter(transaction => transaction.type === "expense")
    .map(transaction => transaction.category)

    return [... new Set(categories)]
}


function getTotalByCategorySet() {
    const categories = getCategories()
    categories.forEach(category => {
        const total = transactions
        .filter(transaction => transaction.category === category)
        .reduce((total, transaction) => transaction.amount + total, 0)
         console.log(`${category}: ${total}`)
    });
}

function getTotalByCategory(category) {
    return transactions
    .filter(transaction => transaction.category === category)
    .reduce((total, transaction) => transaction.amount + total, 0)
}

addTransaction({
    description: "Allowance",
    type: "income",
    amount: 10000,
    accountId: 2,
    category: "Allowance"
}, transactions);

console.log("Total income:", getTotalByType("income", transactions));
console.log("Total expenses:", getTotalByType("expense", transactions));

console.log("Main Checking balance:", getAccountBalance(1, transactions));
console.log("Savings balance:", getAccountBalance(2, transactions));

console.log("Food expenses:", getTotalByCategory("Food"));