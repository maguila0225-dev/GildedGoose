import { Account } from "../models/account"
import { TransactionType } from "../models/transaction"

let nextAccountId = 0
export let accounts: Account[] = []

export function createAccount(
    name: string,
    userId: number,
    openingBalance: number
): Account {
    if (!Number.isInteger(userId) || userId < 0) {
        throw new Error("User ID must be a non-negative integer")
    }

    if (!isNameValid(name)) {
        throw new Error("Account name cannot be empty")
    }

    if (!Number.isFinite(openingBalance)) {
        throw new Error("Opening balance must be a valid amount")
    }

    const account: Account = {
        id: nextAccountId,
        name: name.trim(),
        userId,
        balance: openingBalance,
        isActive: true
    }

    nextAccountId++
    accounts.push(account)

    return { ...account }
}

export function getAccountById(id: number): Account | null {
    const account = accounts.find(account => account.id === id)

    if (account === undefined) {
        return null
    }

    return { ...account }
}

export function updateAccountBalance(
    id: number,
    transactionAmount: number,
    transactionType: TransactionType
): Account | null {
    const account = getAccountById(id)

    if (
        account === null ||
        !isValidUpdate(account, transactionType, transactionAmount)
    ) {
        return null
    }

    return performBalanceUpdate(id, transactionType, transactionAmount)
}

function performBalanceUpdate(
    accountId: number,
    transactionType: TransactionType,
    amount: number
): Account | null {
    const accountIndex = accounts.findIndex(
        account => account.id === accountId
    )

    if (accountIndex === -1) {
        return null
    }

    const account = accounts[accountIndex]

    if (account === undefined) {
        return null
    }

    if (transactionType === "income") {
        account.balance += amount
    } else if (transactionType === "expense") {
        account.balance -= amount
    } else {
        return null
    }

    return { ...account }
}

function isValidUpdate(
    account: Account,
    type: TransactionType,
    amount: number
): boolean {
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

export function deactivateAccount(id: number): boolean {
    const index = accounts.findIndex(account => account.id === id)

    if (index === -1) {
        return false
    }

    const account = accounts[index]

    if (account === undefined) {
        return false
    }

    account.isActive = false
    return true
}

export function renameAccount(
    id: number,
    newName: string
): Account | null {
    const index = accounts.findIndex(account => account.id === id)

    if (index === -1) {
        return null
    }

    const account = accounts[index]

    if (account === undefined) {
        return null
    }

    if (!isNameValid(newName)) {
        throw new Error("Input name is invalid")
    }

    account.name = newName.trim()
    return { ...account }
}

function isNameValid(name: string): boolean {
    return name.trim().length !== 0
}

export function getTotalAccountBalance(userId: number): number {
    return accounts
        .filter(account => account.userId === userId)
        .filter(account => account.isActive)
        .reduce((total, account) => total + account.balance, 0)
}

export function getAccountCount(userId: number): number {
    const userAccounts = accounts
        .filter(account => account.userId === userId)
        .filter(account => account.isActive)

    return userAccounts.length
}

export function transfer(
    senderAccountId: number,
    receiverAccountId: number,
    amount: number
): boolean {
    const sender = getAccountById(senderAccountId)
    const receiver = getAccountById(receiverAccountId)

    if (sender === null || !sender.isActive) {
        throw new Error("Transfer failed: Invalid sender")
    }

    if (receiver === null || !receiver.isActive) {
        throw new Error("Transfer failed: Invalid receiver")
    }

    if (!isValidTransfer(sender, receiver, amount)) {
        throw new Error("Transfer failed: Invalid transfer")
    }

    performTransfer(sender.id, receiver.id, amount)
    return true
}

function performTransfer(
    senderId: number,
    receiverId: number,
    amount: number
): void {
    const senderIndex = accounts.findIndex( account => account.id === senderId )
    const receiverIndex = accounts.findIndex( account => account.id === receiverId )
    const sender = accounts[senderIndex]
    const receiver = accounts[receiverIndex]

    if (sender === undefined || receiver === undefined) {
        throw new Error("Transfer failed: Account not found")
    }

    sender.balance -= amount
    receiver.balance += amount
}

function isValidTransfer(
    sender: Account,
    receiver: Account,
    amount: number
): boolean {
    return (
        Number.isFinite(amount) &&
        sender.balance >= amount &&
        amount > 0 &&
        sender.id !== receiver.id &&
        Number.isFinite(sender.balance - amount) &&
        Number.isFinite(receiver.balance + amount)
    )
}

export function getAllAccounts(): Account[] {
    return accounts.map(account => ({ ...account }))
}

export function getAllActiveAccounts(): Account[] {
    return accounts
        .filter(account => account.isActive)
        .map(account => ({ ...account }))
}

export function getUserAccounts(userId: number): Account[] {
    return accounts
        .filter(account => account.userId === userId && account.isActive)
        .map(account => ({ ...account }))
}

export function getAccountByName(
    accountName: string,
    userId: number
): Account | null {
    const nameAccount = accounts
        .filter(account => account.userId === userId)
        .find(
            account =>
                account.name.toLowerCase() ===
                accountName.trim().toLowerCase()
        )

    if (nameAccount === undefined) {
        return null
    }

    return { ...nameAccount }
}
