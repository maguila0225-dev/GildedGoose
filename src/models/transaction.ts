export interface Transaction {
    id: number
    accountId: number
    categoryId: number | null
    description: string
    type: TransactionType
    amount: number
    date: Date
}

export interface Category {
    id: number
    userId: number
    name: string
    type: TransactionType
}

export type TransactionType = "income" | "expense"
