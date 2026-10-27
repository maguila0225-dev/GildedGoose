import { Router } from "express"
import {
    createAccount,
    getAllActiveAccounts,
    getAccountById,
    renameAccount,
    deactivateAccount
} from "../services/account-service"

const router = Router()

router.get("/", (_req, res) => {
    const accounts = getAllActiveAccounts()
    res.status(200).json(accounts)
})

router.post("/", (req, res) => {
    try {
        const { name, userId, openingBalance} = req.body
        const account = createAccount(name, userId, openingBalance)
        res.status(200).json(account)
    } catch (error) {
        const message = error instanceof Error
            ? error.message : "Unable to create an account"
        
            res.status(400).json({error:message})
    }
})

router.get("/:id", (req, res) => {
    const id = Number(req.params.id)

    if  (!isValidAccountNumber(id)) {
        res.status(400).json({ error: "Invalid account ID" })
        return
    }

    const account = getAccountById(id)

    if (account === null || !account.isActive) {
        res.status(404).json({ error: "Account not found" })
        return
    }

    res.status(200).json(account)
})

router.patch("/:id", (req, res) => {
    const id = Number(req.params.id)

    if (!isValidAccountNumber(id)) {
        res.status(400).json({ error: "Invalid account ID" })
        return
    }
    try {
        const { name } = req.body
        
        const account = renameAccount(id, name)

        if (account === null) {
            res.status(404).json({ error: "Account not found" })
            return
        }
        res.status(200).json(account)
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to rename account"

        res.status(400).json({ error: message }) 
    }
})

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id)

    if (!isValidAccountNumber(id)) {
        res.status(400).json({ error: "Invalid account ID" })
        return
    }

    if (deactivateAccount(id)) {
        res.status(204).send()
    } else {
        res.status(400).json({ error: "Account Deactivation failed" })
    }
})



function isValidAccountNumber(id: number): boolean {
    if (!Number.isInteger(id) || id < 0) {
        return false
    } else {
        return true
    }
}

export default router