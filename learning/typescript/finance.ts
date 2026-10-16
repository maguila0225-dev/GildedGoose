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

interface Transfer {
    id: number
    senderId: number
    receiverId: number
    amount: number
    date: Date
}

interface Category {
    id: number
    userId: number
    name: string
    type: CategoryType
}

interface Budget {
    id: number
    userId: number
    name: string
    categoryId: number
    spendingLimit: number
    remainingBalance: number
    totalSpent: number
    year: number
    month: number
}

type CategoryType = "income" | "expense"
type TransactionType = "income" | "expense"

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

const savingsAccount: Account = {
    id: 1,
    userId: 0,
    name: "Savings",
    balance: 30000,
    createdAt: new Date(2026, 10, 15)
}

const foodCategory: Category = {
    id: 0,
    userId: 0,
    name: "Food",
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

const sampleTransfer: Transfer = {
    id: 0,
    senderId: 0,
    receiverId: 1,
    amount: 10000,
    date: new Date(2026, 10, 15)
}

const octoberBudget: Budget = {
    id: 0,
    userId: 0,
    name: "October Food Budget",
    categoryId: 0,
    spendingLimit: 8000,
    remainingBalance: 8000,
    totalSpent: 0,
    year: 2026,
    month: 10
}

export function calculateRemainingBalance(currentBalance: number,
                                     transactionType: TransactionType,
                                     amount: number): number {
    if(transactionType === "income") {
        return currentBalance + amount
    } else if (transactionType === "expense") {
        return currentBalance - amount
    } 
    return currentBalance
}

export function isWithinBudget(budget: Budget,
                        expense: number): boolean {
     return (budget.remainingBalance - expense) >= 0 && expense >= 0
}

export function inputTransaction(account: Account,
                            budget: Budget,
                            transaction: Transaction): void {
    if(transaction.type === "expense" && isValidTransaction(transaction)) {
        account.balance = calculateRemainingBalance(account.balance, transaction.type, transaction.amount)
        budget.remainingBalance = calculateRemainingBalance(budget.remainingBalance,
                                                        transaction.type,
                                                        transaction.amount)

        budget.totalSpent += transaction.amount
    } else if(transaction.type === "income" && isValidTransaction(transaction)) {
        account.balance = calculateRemainingBalance(account.balance, transaction.type, transaction.amount)
    }
}

export function inputTransfer(accountA: Account, accountB: Account, transfer: Transfer) {
    if(isValidTransfer(accountA, accountB, transfer)) {
        accountA.balance -= transfer.amount
        accountB.balance += transfer.amount
    }
}

export function isValidTransfer(sourceAccount: Account, receiverAccount: Account, transfer: Transfer): boolean {
    return sourceAccount.balance >= transfer.amount && 
            transfer.amount > 0 && 
            sourceAccount.id !== receiverAccount.id && 
            Number.isFinite(transfer.amount) &&
            sourceAccount.id === transfer.senderId &&
            receiverAccount.id === transfer.receiverId
}

export function isValidTransaction(transaction: Transaction): boolean {
    return Number.isFinite(transaction.amount) && transaction.amount > 0
}

export function getTotalByType(type: TransactionType,
                        transactions: Transaction[]): number {
    return transactions.filter(transaction => { return transaction.type === type})
                                          .reduce((total, transaction) => { return total + transaction.amount}, 0)
} 

export function getAccountBalance(account: Account,
                           transactions: Transaction[],
                           transfers: Transfer[]): number {
    
    let balance = account.balance
    const accountTransactions = transactions.filter(transaction => { return transaction.accountId === account.id })
    const accountTransfers = transfers.filter(transfer => { return transfer.senderId === account.id || transfer.receiverId === account.id })

    accountTransactions.forEach(transaction => {
        balance = calculateRemainingBalance(balance, transaction.type, transaction.amount)
    })
    
    accountTransfers.forEach(transfer => {
          if(account.id === transfer.senderId) {
            balance = balance - transfer.amount
        } else {
           balance = balance + transfer.amount
        }
    })

    return balance
}