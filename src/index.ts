import { createAccount } from "./services/account-service"
import { createUser } from "./services/user-service"
import { getAccountById } from "./services/account-service"

function main(): void {
    console.log("Welcome to GildedGoose!")
    console.log("Your finance tracker is ready for development")
    console.log("")

    const userMiguel = createUser("Miguel Aguila")
    const accountChecking = createAccount("Main Checking", userMiguel.id, 50000)
    const accountSavings = createAccount("Savings", userMiguel.id, 10000)

    console.log(`User ${userMiguel.name} created`)
    console.log(`Account ${accountChecking.id}: ${accountChecking.name} created with staring balance ${accountChecking.balance}`)
    console.log(`Account ${accountSavings.id}: ${accountSavings.name} created with staring balance ${accountSavings.balance}`)

    const foundAccount = getAccountById(99)

    if (foundAccount !== null) {
        console.log(`Found account: ${foundAccount.name}`)
    } else {
        console.log("Account not found")
    }

}

main()