interface User {
    id: number
    name: string
    email: string
}

interface Account {
    id: number
    userId: number
    name: string
    balance: number
    createdAt: Date
}

interface Transaction {
    id: number
    accountId: number
    categoryId: number | null
    description: string
    type: TransactionType
    amount: number
    date: Date
}

interface Category {
    id: number
    userId: number
    type: CategoryType
}

interface Budget {
    id: number
    userId: number
    categoryId: number
    spendingLimit: number
    remainingBalance: number
    year: number
    month: number
}

type CategoryType = "income" | "expense"
type TransactionType = "income" | "expense" | "transfer"

const sampleUser: User = {
    id: 0,
    name: "Miguel",
    email: "maguila0225@gmail.com"
}

const mainAccount: Account = {
    id: 0,
    userId: 0,
    name: "Main Checking",
    balance: 50000,
    createdAt: new Date(2026, 10, 15)
}

const foodCategory: Category = {
    id: 0,
    userId: 0,
    type: "expense"
}

const groceryTransaction: Transaction = {
    id: 0,
    accountId: 0,
    categoryId: 0,
    description: "Monthly grocery",
    type: "expense",
    amount: 5000,
    date: new Date(2026, 10, 15)
}

const octoberBudget: Budget = {
    id: 0,
    userId: 0,
    categoryId: 0,
    spendingLimit: 8000,
    remainingBalance: 8000,
    year: 2026,
    month: 10
}

function calculateRemainingBalance(currentBalance: number,
                                     transactionType: TransactionType,
                                     amount: number): number {
    if(transactionType === "income") {
        return currentBalance + amount
    } else if (transactionType === "expense") {
        return currentBalance - amount
    } 
    return currentBalance
}

function isWithinBudget(budget: Budget,
                        expense: number): boolean {
     return (budget.remainingBalance - expense) >= 0
}

function inputTransaction(budget: Budget,
                            transaction: Transaction): void {
    if(transaction.type === "expense") {
         budget.remainingBalance = calculateRemainingBalance(budget.remainingBalance,
                                                        transaction.type,
                                                        transaction.amount)
    }
}

console.log("Before:", octoberBudget.remainingBalance)

inputTransaction(octoberBudget, groceryTransaction)

console.log("After:", octoberBudget.remainingBalance)
console.log("Within budget:", isWithinBudget(octoberBudget, 0))

console.log("Can spend 2000:", isWithinBudget(octoberBudget, 2000))
console.log("Can spend 4000:", isWithinBudget(octoberBudget, 4000))