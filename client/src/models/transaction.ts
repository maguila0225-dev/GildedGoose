export interface Transaction {
    id: number
    accountId: number
    description: string | null
    type: TransactionType
    amount: number
    date: Date
}

export type TransactionType = "income" | "expense"
