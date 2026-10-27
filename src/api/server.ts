import express from "express"
import accountRoutes from "./account-routes"
import transactionRoutes from "./transaction-routes"

const app = express()
const port = process.env.port ?? 3000

app.use(express.json())
app.use("/api/accounts", accountRoutes)
app.use("/api/transactions", transactionRoutes)

app.listen(port, () => {
        console.log(`GildedGoose API is running on port ${port}`)
})