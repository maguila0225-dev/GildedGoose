
import { Transaction, TransactionType } from "../models/transaction"
import { Account } from "../models/account"
import { getAccountById,
         updateAccountBalance } from "../services/account-service"

let transactions: Transaction[] = []
let nextTransaction = 0

export function createTransaction(
    accountId: number,
    description: string | null,
    type: TransactionType,
    amount: number,
    date: Date): Transaction | null {
    const account = getAccountById(accountId)

    if (
        account &&
        isValidTransaction(account, type, amount) &&
        isValidDate(date) &&
        updateBalance(accountId, amount, type)
    ) {
        const transaction: Transaction = {
            id: nextTransaction,
            accountId,
            description,
            type,
            amount,
            date: new Date(date.getTime())
        }

        nextTransaction++
        transactions.push(transaction)

        return copyTransaction(transaction)
    }

    return null
}

function updateBalance(
    accountId: number,
    amount: number,
    type: TransactionType): boolean {
    return updateAccountBalance(accountId, amount, type) !== null
}

function isValidDate(date: unknown): date is Date {
    return date instanceof Date && !isNaN(date.getTime())
}

function isValidTransaction(
    account: Account,
    type: TransactionType,
    amount: number): boolean {
    if (
        !isPositiveFinite(amount) ||
        (type === "income" &&
            !Number.isFinite(account.balance + amount)) ||
        (type === "expense" &&
            !Number.isFinite(account.balance - amount)) ||
        (type !== "income" && type !== "expense") ||
        !account.isActive
    ) {
        return false
    }

    return true
}

function isPositiveFinite(value: unknown): value is number {
    return Number.isFinite(value) && (value as number) > 0
}

function copyTransaction(transaction: Transaction): Transaction {
    return {
        ...transaction,
        date: new Date(transaction.date.getTime())
    }
}

export function getTransactionById(id: number): Transaction | null {
    const transaction = transactions.find(
        transaction => transaction.id === id
    )

    return transaction === undefined
        ? null
        : copyTransaction(transaction)
}

export function getTransactionsByAccountId(id: number): Transaction[] {
    return transactions
        .filter(transaction => transaction.accountId === id)
        .map(copyTransaction)
}

export function getAllTransactions(): Transaction[] {
    return transactions.map(copyTransaction)
}

export function __resetForTests(): void {
    transactions = []
    nextTransaction = 0
}

export function deleteTransaction(id: number): boolean {
    const index = transactions.findIndex(transaction => transaction.id === id)
    const deleteTransaction = transactions[index]
    if(deleteTransaction === undefined ) {
        throw new Error("Invalid transaction")
    } 
    const account = getAccountById(deleteTransaction.accountId)
    if(account === null) {
        throw new Error("Invalid account")
    } 

    if(deleteTransaction.type === "expense" && 
       updateBalance(account.id, deleteTransaction.amount, "income")) {
       transactions.splice(index, 1)
       return true
    } else if(deleteTransaction.type === "income" && 
       updateBalance(account.id, deleteTransaction.amount, "expense")){
        transactions.splice(index, 1)
        return true
    } else {
        return false
    } 
}
