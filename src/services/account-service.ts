import { Account } from "../models/account"

let nextAccountId = 0
export let accounts: Account[] = []

export function createAccount(name: string,
                              userId: number,
                              openingBalance: number): Account {
    if (!Number.isInteger(userId) || userId < 0) {
        throw new Error("User ID must be a non-negative integer")
    }

    if (isNameValid(name)) {
        throw new Error("Account name cannot be empty")
    }

    if (!Number.isFinite(openingBalance)) {
        throw new Error("Opening balance must be a valid amount")
    }

    const account: Account = {
        id: nextAccountId,
        name: name.trim(),
        userId: userId,
        balance: openingBalance
    }

    nextAccountId++
    accounts.push(account)
    return account
}

export function getAccountById(id: number): Account | null {
    const account = accounts.find(account => { return account.id === id })
    return account ?? null
}

export function getUserAccoounts(userId: number): Account[] {
    return accounts.filter(account => {return account.userId === userId})
}

export function updateAccountBalance(id: number,
                                     transactionAmount: number,
                                     transactionType: TransactionType): Account | null {
    const account = getAccountById(id)
    if (account) {
        if (type === "expense") {
            account.balance -= transactionAmount
        } else {
            account.balance += transactionAmount
        }
        return account
    } else {
        return null
    }
}

export function deleteAccount(id: number): boolean {
    const account = getAccountById(id)
    if (account) {
        const index = accounts.indexOf(account)
        accounts.splice(index, 1)
        return true
    } else {
        return false
    }
}

export function renameAccount(id: number, newName: string): Account | null {
    const account = getAccountById(id) 
    if (account && isNameValid(newName)) {
        account.name = newName.trim()
        return account
    } else if (account === null){
        return null
    } else {
        throw new Error("Input name is invalid")
    }
}

function isNameValid(name: string): boolean {
    return name.trim().length !== 0
}

export function getTotalAccountBalance(userId: number): number {
    return accounts.filter(account => { return account.userId === userId})
                   .reduce((total, account) => { return total + account.balance}, 0)
}

export function getAccountCount(userId: number): number {
    const userAccounts = accounts.filter(account => { return account.userId === userId})
    return userAccounts.length
}

export function transfer(senderAccountId: number,
                         receiverAccountId: number,
                         amount: number): boolean {
    const sender = getAccountById(senderAccountId)
    const receiver = getAccountById(receiverAccountId)
    if (sender === null) {
        throw new Error("Transfer failed: Invalid sender")
    } else if (receiver === null) {
        throw new Error("Transfer failed: Invalid receiver")
    } else if (!isValidTransfer(sender, receiver, amount)) {
        throw new Error("Transfer failed: Invalid transfer")
    } 
    else {
        sender.balance -= amount
        receiver.balance += amount
        return true
    }
}

function isValidTransfer(sender: Account, receiver: Account, amount: number): boolean {
    if (Number.isFinite(amount) &&
        sender.balance >= amount && 
        amount > 0 && 
        sender !== receiver ) {
        return true
    } else {
        return false
    }
}

export function getAllAccounts(): Account[] {
    return accounts
}

export function getAccountByName(accountName: string, userId: number): Account | null {
    return accounts.filter(account => { return account.userId === userId})
                   .find(account => { 
                    return account.name.toLowerCase() === accountName.trim().toLowerCase()
                }) ?? null
}