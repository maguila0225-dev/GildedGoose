import { Transaction } from "../src/models"
import { Category } from "../src/models"
import { TransactionType } from "../src/models"

import { Account } from "../src/models"
import { getAccountById } from "../src/services"
import { updateAccountBalance } from "../src/services"

let transactions: Transaction[] = []
let nextTransaction = 0

export function createTransaction(accountId: number,
                                  description: string | null,
                                  type: TransactionType,
                                  amount: number,
                                  date: Date): Transaction | null {
    const account = getAccountById(accountId)
    if (account && isValidTransaction(account, type, amount)) {
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
        updateAccountBalance(accountId, amount, type)
        return transaction
    } else {
        return null
    }
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
