
const { test, beforeEach, describe } = require("node:test")
const assert = require("node:assert/strict")

const accountService = require("../../dist/services/account-service.js")
const transactionService = require("../../dist/services/transaction-service.js")

const {
    accounts,
    createAccount,
    getAccountById,
    deactivateAccount
} = accountService

const {
    createTransaction,
    getTransactionById,
    getTransactionsByAccountId,
    getAllTransactions,
    deleteTransaction,
    __resetForTests
} = transactionService

// Reset module state before every test.
beforeEach(() => {
    accounts.length = 0
    __resetForTests()
})

function makeAccount(name = "Checking", userId = 0, balance = 1000) {
    return createAccount(name, userId, balance)
}

function makeTransaction(
    accountId,
    description = "Test transaction",
    type = "income",
    amount = 100,
    date = new Date("2026-01-15T12:00:00.000Z")
) {
    return createTransaction(accountId, description, type, amount, date)
}

// Transaction creation

test("creates an income transaction and updates the account balance", () => {
    const account = makeAccount()
    const transaction = makeTransaction(account.id)

    assert.ok(transaction)
    assert.equal(transaction.id, 0)
    assert.equal(transaction.accountId, account.id)
    assert.equal(transaction.description, "Test transaction")
    assert.equal(transaction.type, "income")
    assert.equal(transaction.amount, 100)
    assert.equal(transaction.date.toISOString(), "2026-01-15T12:00:00.000Z")
    assert.equal(getAccountById(account.id).balance, 1100)
})

test("creates an expense transaction and updates the account balance", () => {
    const account = makeAccount()
    const transaction = makeTransaction(
        account.id,
        "Groceries",
        "expense",
        250
    )

    assert.ok(transaction)
    assert.equal(transaction.type, "expense")
    assert.equal(getAccountById(account.id).balance, 750)
})

test("allows a null description", () => {
    const account = makeAccount()
    const transaction = makeTransaction(account.id, null)

    assert.ok(transaction)
    assert.equal(transaction.description, null)
})

test("allows an empty description", () => {
    const account = makeAccount()
    const transaction = makeTransaction(account.id, "")

    assert.ok(transaction)
    assert.equal(transaction.description, "")
})

test("assigns sequential transaction IDs starting at zero", () => {
    const account = makeAccount()

    const first = makeTransaction(account.id)
    const second = makeTransaction(account.id)

    assert.equal(first.id, 0)
    assert.equal(second.id, 1)
})

// Validation

test("returns null for a missing account", () => {
    assert.equal(makeTransaction(-1), null)
})

test("returns null for an inactive account", () => {
    const account = makeAccount()
    deactivateAccount(account.id)

    assert.equal(makeTransaction(account.id), null)
})

test("rejects zero, negative, and non-finite amounts", () => {
    const account = makeAccount()

    for (const amount of [0, -10, NaN, Infinity, -Infinity]) {
        assert.equal(
            makeTransaction(account.id, "Invalid", "income", amount),
            null
        )
    }
})

test("rejects unsupported transaction types", () => {
    const account = makeAccount()

    assert.equal(
        makeTransaction(account.id, "Invalid", "transfer", 100),
        null
    )
})

test("rejects invalid dates", () => {
    const account = makeAccount()

    assert.equal(
        createTransaction(
            account.id,
            "Invalid date",
            "income",
            100,
            new Date("invalid")
        ),
        null
    )

    assert.equal(
        createTransaction(
            account.id,
            "Not a date",
            "income",
            100,
            "2026-01-15"
        ),
        null
    )
})

test("rejects an expense that would overflow the resulting balance", () => {
    const account = makeAccount("Checking", 0, -Number.MAX_VALUE)

    const transaction = makeTransaction(
        account.id,
        "Overflow",
        "expense",
        Number.MAX_VALUE
    )

    assert.equal(transaction, null)
})

test("rejects an income that would overflow the resulting balance", () => {
    const account = makeAccount("Checking", 0, Number.MAX_VALUE)

    const transaction = makeTransaction(
        account.id,
        "Overflow",
        "income",
        Number.MAX_VALUE
    )

    assert.equal(transaction, null)
})

// Failed transactions must not mutate balances or create records.

test("does not create a record or change balance for a failed transaction", () => {
    const account = makeAccount()

    const transaction = makeTransaction(
        account.id,
        "Invalid amount",
        "income",
        -100
    )

    assert.equal(transaction, null)
    assert.equal(getAccountById(account.id).balance, 1000)
    assert.equal(getAllTransactions().length, 0)
})

// Retrieval

test("retrieves a transaction by ID", () => {
    const account = makeAccount()
    const created = makeTransaction(account.id)

    assert.deepEqual(getTransactionById(created.id), created)
})

test("returns null for a missing transaction ID", () => {
    assert.equal(getTransactionById(-1), null)
})

test("retrieves transactions for a specific account", () => {
    const firstAccount = makeAccount("Checking", 0, 1000)
    const secondAccount = makeAccount("Savings", 0, 1000)

    makeTransaction(firstAccount.id, "First")
    makeTransaction(secondAccount.id, "Second")
    makeTransaction(firstAccount.id, "Third")

    const result = getTransactionsByAccountId(firstAccount.id)

    assert.equal(result.length, 2)
    assert.ok(
        result.every(transaction => transaction.accountId === firstAccount.id)
    )
})

test("returns all transaction records", () => {
    const firstAccount = makeAccount("Checking", 0, 1000)
    const secondAccount = makeAccount("Savings", 0, 1000)

    makeTransaction(firstAccount.id, "First")
    makeTransaction(secondAccount.id, "Second")

    assert.equal(getAllTransactions().length, 2)
})

test("returns an empty array when no transactions exist", () => {
    assert.deepEqual(getAllTransactions(), [])
})

describe("deleteTransaction", () => {
    let account;

    beforeEach(() => {
        __resetForTests();
        accounts.length = 0;

        account = createAccount("Checking", 0, 1000);
    });

    test("deletes an expense and restores the account balance", () => {
        const transaction = createTransaction(
            account.id, "Groceries", "expense", 200, new Date()
        );

        const result = deleteTransaction(transaction.id);

        assert.equal(result, true);
        assert.equal(getAccountById(account.id).balance, 1000);
        assert.equal(getTransactionById(transaction.id), null);
    });

    test("deletes an income and reverses the account balance", () => {
        const transaction = createTransaction(
            account.id, "Salary", "income", 500, new Date()
        );

        const result = deleteTransaction(transaction.id);

        assert.equal(result, true);
        assert.equal(getAccountById(account.id).balance, 1000);
        assert.equal(getTransactionById(transaction.id), null);
    });

    test("throws when the transaction does not exist", () => {
        assert.throws(
            () => deleteTransaction(999),
            /Invalid transaction/
        );
    });

    test("throws when the account does not exist", () => {
        const transaction = createTransaction(
            account.id, "Groceries", "expense", 200, new Date()
        );

        accounts.length = 0;

        assert.throws(
            () => deleteTransaction(transaction.id),
            /Invalid account/
        );
    });

    test("keeps the transaction if the balance reversal fails", () => {
        const transaction = createTransaction(
            account.id, "Groceries", "expense", 200, new Date()
        );

        deactivateAccount(account.id);

        const result = deleteTransaction(transaction.id);

        assert.equal(result, false);
        assert.notEqual(getTransactionById(transaction.id), null);
    });

    test("removes the transaction from account transaction history", () => {
        const transaction = createTransaction(
            account.id, "Groceries", "expense", 200, new Date()
        );

        deleteTransaction(transaction.id);

        assert.equal(getTransactionsByAccountId(account.id).length, 0);
    });
});