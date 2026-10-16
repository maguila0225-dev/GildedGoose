import { User } from "../models/user"

let nextUserId = 0

export function createUser(name: string) {
    if (name.trim().length === 0) {
        throw new Error("User name cannot be empty")
    }

    const user: User = {
        id: nextUserId,
        name: name.trim()
    }

    nextUserId++

    return user
}