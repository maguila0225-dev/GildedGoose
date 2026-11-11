import { Router } from "express"
import {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from "../services/transaction-service"

const router = Router()

router.get("/", (_req, res) => {
    const transactions = getAllTransactions()
    res.status(200).json(transactions)
})

router.get("/:id", (req, res) => {
    const id = Number(req.params.id)

    if  (!isValidTransactionId(id)) {
        res.status(400).json({ error: "Invalid transaction ID" })
        return
    }

    const transaction = getTransactionById(id)

    if (transaction === null ) {
        res.status(404).json({ error: "Transaction not found" })
        return
    }

    res.status(200).json(transaction)
})

router.post("/", (req, res) => {
    try {
        const { accountId, description, type, amount, date} = req.body
        const transaction = createTransaction(accountId,
                                              description, 
                                              type, 
                                              amount, 
                                              new Date(date))
        if(transaction === null) {
            res.status(400).json({ error: "Bad Request"})
            return
        }
        res.status(201).json(transaction)
    } catch (error) {
        const message = error instanceof Error
            ? error.message : "Unable to create the transaction"
        
            res.status(400).json({error:message})
    }
})

router.patch("/:id", (req, res) => {
    const id = Number(req.params.id)

    if (!isValidTransactionId(id)) {
        res.status(400).json({ error: "Invalid transaction ID" })
        return
    }
    try {
        const updates = {...req.body}
        if (updates.date !== undefined) {
            updates.date = new Date(updates.date)
        }
        const transaction = updateTransaction(id, updates)
        if(transaction === null) {
             res.status(404).json({ error: "Bad Request" })
             return
        }
        res.status(200).json(transaction)
    } catch (error) {
            const message = error instanceof Error
            ? error.message : "Unable to update the transaction"
        
            res.status(400).json({error:message})
    }
})

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id)

    if (!isValidTransactionId(id)) {
        res.status(400).json({ error: "Invalid transaction ID" })
        return
    }

    if (deleteTransaction(id)) {
        res.status(204).send()
    } else {
        res.status(400).json({ error: "Transaction delete failed" })
    }
})


function isValidTransactionId(id: number): boolean {
    return Number.isInteger(id) && id >= 0
}

export default router