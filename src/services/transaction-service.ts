import { Transaction } from "../models/transaction"
import { TransactionType } from "../models/transaction"

import { Account } from "../models/account"
import { getAccountById } from "../services/account-service"
import { updateAccountBalance } from "../services/account-service"

let transactions: Transaction[] = []
let nextTransaction = 0

export function createTransaction(accountId: number,
                                  description: string | null,
                                  type: TransactionType,
                                  amount: number,
                                  date: Date): Transaction | null {
    const account = getAccountById(accountId)
    if (account &&
        isValidTransaction(account, type, amount) &&
        isValidDate(date) &&
        updateBalance(accountId, amount, type)) {
        const transaction: Transaction = {
            id: nextTransaction,
            accountId: accountId,
            description: description,
            type: type,
            amount: amount,
            date: date
        }
        nextTransaction++
        transactions.push(transaction)
        return transaction
    } else {
        return null
    }
}

function updateBalance(accountId: number, amount: number, type: TransactionType): boolean {
    return updateAccountBalance(accountId, amount, type) !== null
}

function isValidDate(date: unknown): date is Date {
    return date instanceof Date && !isNaN(date.getTime())
}

function isValidTransaction(account: Account,
                            type: TransactionType,
                            amount: number): boolean {
    if (!isPositiveFinite(amount) ||
        (type === "expense" && !isWithinBalance(account.balance, amount))) {
        return false
    } else {
        return true
    }
}

function isWithinBalance(balance: number, amount: number): boolean {
    return (balance - amount) >= 0
}

function isPositiveFinite(value: unknown): value is number {
  return Number.isFinite(value) && (value as number) > 0;
}

export function getTransactionById(id: number): Transaction | null {
    return transactions.find(transaction => { return transaction.id === id}) ?? null
}

export function getTransactionsByAccountId(id: number): Transaction[] {
    return transactions.filter(transaction => { return transaction.accountId === id})
}

export function getAllTransactions(): Transaction[] {
    const allTransactions = transactions.filter( transaction => { return true })
    return allTransactions
}

