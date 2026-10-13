const accounts = [
    {   
        id: 0,
        name: "Main Checking",
         balance: 50000
    },
    {
        id: 1,
        name: "Savings",
        balance: 20000
    }
]

const transactions = [
    { id: 1, description: "Salary", type: "income", amount: 50000 },
    { id: 2, description: "Groceries", type: "expense", amount: 2500 },
    { id: 3, description: "Gas", type: "expense", amount: 1500 }
];


function getAccounts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(accounts)
        }, 2000)
    })
}

function getTransactions() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(transactions)
        }, 2000)
    })
}

async function main() {
    console.log("Loading data .....")
    try {
         const accounts = await getAccounts()
         const transactions = await getTransactions()
         console.log(`accounts: ${JSON.stringify(accounts, null, 2)}`);
         console.log(`transactions: ${JSON.stringify(transactions, null, 2)}`)
    } catch(error) {
        console.log("Something went wrong")
        console.log(error.message)
    }
}

main()

