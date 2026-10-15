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
     return (budget.remainingBalance - expense) >= 0 && expense >= 0
}

function inputTransaction(account: Account,
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

function inputTransfer(accountA: Account, accountB: Account, transaction: Transaction) {
    if(transaction.type === "transfer" 
        && isValidTransaction(transaction)
        && isValidTransfer(accountA, transaction)) {
        accountA.balance -= transaction.amount
        accountB.balance += transaction.amount
    }
}

function isValidTransfer(sourceAccount: Account, transaction: Transaction): boolean {
    return sourceAccount.balance >= transaction.amount
}

function isValidTransaction(transaction: Transaction): boolean {
    return transaction.amount > 0
}


function runFinanceTests(): void {
    let passed = 0
    let failed = 0

    function check(testName: string, condition: boolean): void {
        if (condition) {
            console.log(`✅ PASS: ${testName}`)
            passed++
        } else {
            console.log(`❌ FAIL: ${testName}`)
            failed++
        }
    }

    // Test 1: Expense reduces account balance and updates budget
    const expenseAccount: Account = {
        id: 1,
        userId: 1,
        name: "Checking",
        balance: 50000,
        createdAt: new Date()
    }

    const expenseBudget: Budget = {
        id: 1,
        userId: 1,
        categoryId: 1,
        name: "Groceries",
        spendingLimit: 8000,
        totalSpent: 0,
        remainingBalance: 8000,
        year: 2026,
        month: 9
    }

    const expense: Transaction = {
        id: 1,
        accountId: 1,
        categoryId: 1,
        description: "Groceries",
        type: "expense",
        amount: 2500,
        date: new Date()
    }

    inputTransaction(expenseAccount, expenseBudget, expense)

    check("Expense reduces account balance",
        expenseAccount.balance === 47500)

    check("Expense reduces remaining budget",
        expenseBudget.remainingBalance === 5500)

    check("Expense increases total spent",
        expenseBudget.totalSpent === 2500)


    // Test 2: Income increases account balance
    const incomeAccount: Account = {
        id: 2,
        userId: 1,
        name: "Checking",
        balance: 50000,
        createdAt: new Date()
    }

    const incomeBudget: Budget = {
        ...expenseBudget,
        totalSpent: 0,
        remainingBalance: 8000
    }

    const income: Transaction = {
        id: 2,
        accountId: 2,
        categoryId: null,
        description: "Salary",
        type: "income",
        amount: 10000,
        date: new Date()
    }

    inputTransaction(incomeAccount, incomeBudget, income)

    check("Income increases account balance",
        incomeAccount.balance === 60000)

    check("Income does not change budget",
        incomeBudget.remainingBalance === 8000 &&
        incomeBudget.totalSpent === 0)


    // Test 3: Valid transfer moves money between accounts
    const sourceAccount: Account = {
        id: 3,
        userId: 1,
        name: "Checking",
        balance: 50000,
        createdAt: new Date()
    }

    const destinationAccount: Account = {
        id: 4,
        userId: 1,
        name: "Savings",
        balance: 20000,
        createdAt: new Date()
    }

    const transfer: Transaction = {
        id: 3,
        accountId: 3,
        categoryId: null,
        description: "Move to savings",
        type: "transfer",
        amount: 5000,
        date: new Date()
    }

    inputTransfer(sourceAccount, destinationAccount, transfer)

    check("Transfer reduces source balance",
        sourceAccount.balance === 45000)

    check("Transfer increases destination balance",
        destinationAccount.balance === 25000)

    check("Transfer preserves combined balance",
        sourceAccount.balance + destinationAccount.balance === 70000)


    // Test 4: Transfer is rejected if funds are insufficient
    const poorSource: Account = {
        id: 5,
        userId: 1,
        name: "Checking",
        balance: 1000,
        createdAt: new Date()
    }

    const untouchedDestination: Account = {
        id: 6,
        userId: 1,
        name: "Savings",
        balance: 2000,
        createdAt: new Date()
    }

    const expensiveTransfer: Transaction = {
        id: 4,
        accountId: 5,
        categoryId: null,
        description: "Too expensive",
        type: "transfer",
        amount: 1500,
        date: new Date()
    }

    inputTransfer(poorSource, untouchedDestination, expensiveTransfer)

    check("Unaffordable transfer leaves source unchanged",
        poorSource.balance === 1000)

    check("Unaffordable transfer leaves destination unchanged",
        untouchedDestination.balance === 2000)


    // Test 5: Zero-amount transaction is rejected
    const zeroAccount: Account = {
        id: 7,
        userId: 1,
        name: "Checking",
        balance: 5000,
        createdAt: new Date()
    }

    const zeroBudget: Budget = {
        ...expenseBudget,
        totalSpent: 0,
        remainingBalance: 8000
    }

    const zeroExpense: Transaction = {
        id: 5,
        accountId: 7,
        categoryId: 1,
        description: "Zero expense",
        type: "expense",
        amount: 0,
        date: new Date()
    }

    inputTransaction(zeroAccount, zeroBudget, zeroExpense)

    check("Zero-amount transaction is rejected",
        zeroAccount.balance === 5000 &&
        zeroBudget.remainingBalance === 8000 &&
        zeroBudget.totalSpent === 0)


    // Test 6: Negative-amount transaction is rejected
    const negativeAccount: Account = {
        id: 8,
        userId: 1,
        name: "Checking",
        balance: 5000,
        createdAt: new Date()
    }

    const negativeBudget: Budget = {
        ...expenseBudget,
        totalSpent: 0,
        remainingBalance: 8000
    }

    const negativeExpense: Transaction = {
        id: 6,
        accountId: 8,
        categoryId: 1,
        description: "Negative expense",
        type: "expense",
        amount: -500,
        date: new Date()
    }

    inputTransaction(negativeAccount, negativeBudget, negativeExpense)

    check("Negative-amount transaction is rejected",
        negativeAccount.balance === 5000 &&
        negativeBudget.remainingBalance === 8000 &&
        negativeBudget.totalSpent === 0)


    // Test 7: Budget status checks
    check("Expense within budget returns true",
        isWithinBudget(expenseBudget, 2000))

    check("Expense exceeding budget returns false",
        !isWithinBudget(expenseBudget, 9000))

    check("Negative expense returns false",
        !isWithinBudget(expenseBudget, -100))


    // Summary
    console.log("-------------------------")
    console.log(`Tests passed: ${passed}`)
    console.log(`Tests failed: ${failed}`)
    console.log("-------------------------")
}

runFinanceTests()



