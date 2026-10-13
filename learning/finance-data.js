const accounts = [
    {
        id: 1,
        name: "Main Checking",
        type: "bank"
    },
    {
        id: 2,
        name: "Savings",
        type: "bank"
    },
    {
        id: 3,
        name: "Credit Card",
        type: "credit"
    }
];

const categories = [
    {
        id: 1,
        name: "Food",
        type: "expense"
    },
    {
        id: 2,
        name: "Transportation",
        type: "expense"
    },
    {
        id: 3,
        name: "Entertainment",
        type: "expense"
    },
    {
        id: 4,
        name: "Salary",
        type: "income"
    },
    {
        id: 5,
        name: "Freelance",
        type: "income"
    }
];

const transactions = [
    {
        id: 1,
        accountId: 1,
        categoryId: 4,
        type: "income",
        amount: 50000,
        description: "Monthly Salary"
    },
    {
        id: 2,
        accountId: 1,
        categoryId: 1,
        type: "expense",
        amount: 2500,
        description: "Groceries"
    },
    {
        id: 3,
        accountId: 1,
        categoryId: 2,
        type: "expense",
        amount: 1500,
        description: "Gas"
    },
    {
        id: 4,
        accountId: 3,
        categoryId: 3,
        type: "expense",
        amount: 800,
        description: "Movie Tickets"
    },
    {
        id: 5,
        accountId: 1,
        categoryId: 5,
        type: "income",
        amount: 5000,
        description: "Freelance Project"
    },
    {
        id: 6,
        accountId: 3,
        categoryId: 1,
        type: "expense",
        amount: 1200,
        description: "Restaurant"
    },
    {
        id: 7,
        accountId: 1,
        categoryId: 3,
        type: "expense",
        amount: 3000,
        description: "Magic Cards"
    },
    {
        id: 8,
        accountId: 2,
        categoryId: 1,
        type: "expense",
        amount: 1000,
        description: "Groceries"
    }
];

const budgets = [
    {
        id: 1,
        categoryId: 1,
        amount: 5000
    },
    {
        id: 2,
        categoryId: 2,
        amount: 3000
    },
    {
        id: 3,
        categoryId: 3,
        amount: 4000
    }
];

function getCategoryTotal(categoryId) {
    return transactions.filter(transaction => {
        return transaction.categoryId === categoryId
    })
    .reduce((total, transaction) => {
        return total + transaction.amount
    }, 0)
}

function getTotalIncome() {
    return transactions.filter(transaction => {
        return transaction.type === "income"
    })
    .reduce((total, transaction) => {
        return total + transaction.amount
    }, 0)
}


function getTotalExpense() {
    return transactions.filter(transaction => {
        return transaction.type === "expense"
    })
    .reduce((total, transaction) => {
        return total + transaction.amount
    }, 0)
}

function getBalance() {
    return getTotalIncome() - getTotalExpense()
}

function getTotalByType(type) {
    return transactions.filter(transaction => {
        return transaction.type === type
    })
    .reduce((total, transaction) => {
        return total + transaction.amount
    }, 0)
}

console.log(getTotalByType("refund"));