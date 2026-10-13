type TransactionType = "income" | "expense"
const transactionAmount: number = 2500
const currentBalance: number = 10000
const transactionType: TransactionType = "expense"

function calculateRemainingBalance(currentBalance: number,
                                     transactionType: TransactionType,
                                     amount: number): number {
    if(transactionType === "income") {
        return currentBalance + amount
    } else {
        return currentBalance - amount
    }  
}

const remainingBalance = calculateRemainingBalance(currentBalance, transactionType, transactionAmount)

console.log(`Transaction type: ${transactionType}`)
console.log(`Transaction amount: ${transactionAmount}`)
console.log(`Remaining balance: ${remainingBalance}`)

