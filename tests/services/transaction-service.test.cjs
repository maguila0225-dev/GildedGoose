
const { test } = require("node:test");
const assert = require("node:assert/strict");

const { createUser } = require("../../dist/services/user-service.js");

const {
    createAccount,
    getTotalAccountBalance
} = require("../../dist/services/account-service.js");

const {
    createTransaction,
    getTransactionById,
    getTransactionsByAccountId,
    getAllTransactions
} = require("../../dist/services/transaction-service.js");

test("creates an income transaction and updates the account balance", () => {
    const testUser = createUser("Income Test User");
    const testAccount = createAccount("Income Test Account", testUser.id, 1000);

    const transaction = createTransaction(
        testAccount.id,
        "Test Income",
        "income",
        250,
        new Date()
    );

    assert.notEqual(transaction, null);
    assert.equal(transaction.type, "income");
    assert.equal(transaction.amount, 250);
    assert.equal(getTotalAccountBalance(testUser.id), 1250);
    assert.deepEqual(getTransactionById(transaction.id), transaction);
    assert.deepEqual(getTransactionsByAccountId(testAccount.id), [transaction]);
});

test("creates an expense transaction and updates the account balance", () => {
    const testUser = createUser("Expense Test User");
    const testAccount = createAccount("Expense Test Account", testUser.id, 1000);

    const transaction = createTransaction(
        testAccount.id,
        "Test Expense",
        "expense",
        750,
        new Date()
    );

    assert.notEqual(transaction, null);
    assert.equal(transaction.type, "expense");
    assert.equal(transaction.amount, 750);
    assert.equal(getTotalAccountBalance(testUser.id), 250);
    assert.deepEqual(getTransactionById(transaction.id), transaction);
    assert.deepEqual(getTransactionsByAccountId(testAccount.id), [transaction]);
});

test("rejects zero, negative, NaN, and infinite transaction amounts", () => {
    const testUser = createUser("Invalid Amount User");
    const testAccount = createAccount("Invalid Amount Account", testUser.id, 1000);
    const balanceBefore = getTotalAccountBalance(testUser.id);
    const historyBefore = getTransactionsByAccountId(testAccount.id);

    const invalidAmounts = [0, -5, NaN, Infinity, -Infinity];

    for (const amount of invalidAmounts) {
        const transaction = createTransaction(
            testAccount.id,
            "Invalid Amount",
            "expense",
            amount,
            new Date()
        );

        assert.equal(transaction, null);
    }

    assert.equal(getTotalAccountBalance(testUser.id), balanceBefore);
    assert.deepEqual(getTransactionsByAccountId(testAccount.id), historyBefore);
});

test("rejects an invalid date without changing balance or history", () => {
    const testUser = createUser("Invalid Date User");
    const testAccount = createAccount("Invalid Date Account", testUser.id, 1000);
    const balanceBefore = getTotalAccountBalance(testUser.id);
    const historyBefore = getTransactionsByAccountId(testAccount.id);

    const transaction = createTransaction(
        testAccount.id,
        "Invalid Date",
        "expense",
        100,
        new Date("Invalid Date")
    );

    assert.equal(transaction, null);
    assert.equal(getTotalAccountBalance(testUser.id), balanceBefore);
    assert.deepEqual(getTransactionsByAccountId(testAccount.id), historyBefore);
});

test("rejects an expense exceeding the account balance without side effects", () => {
    const testUser = createUser("Insufficient Funds User");
    const testAccount = createAccount("Insufficient Funds Account", testUser.id, 500);
    const balanceBefore = getTotalAccountBalance(testUser.id);
    const historyBefore = getTransactionsByAccountId(testAccount.id);

    const transaction = createTransaction(
        testAccount.id,
        "Too Expensive",
        "expense",
        501,
        new Date()
    );

    assert.equal(transaction, null);
    assert.equal(getTotalAccountBalance(testUser.id), balanceBefore);
    assert.deepEqual(getTransactionsByAccountId(testAccount.id), historyBefore);
});

test("rejects a transaction for an unknown account without side effects", () => {
    const transactionsBefore = getAllTransactions();

    const transaction = createTransaction(
        500000,
        "Unknown Account",
        "expense",
        100,
        new Date()
    );

    assert.equal(transaction, null);
    assert.deepEqual(getAllTransactions(), transactionsBefore);
});

test("rejects invalid transactions without adding transaction records", () => {
    const testUser = createUser("History Test User");
    const testAccount = createAccount("History Test Account", testUser.id, 100);
    const historyBefore = getTransactionsByAccountId(testAccount.id);

    createTransaction(testAccount.id, "Zero", "expense", 0, new Date());
    createTransaction(testAccount.id, "Negative", "expense", -10, new Date());
    createTransaction(testAccount.id, "NaN", "expense", NaN, new Date());
    createTransaction(testAccount.id, "Invalid Date", "income", 10, new Date("Invalid Date"));
    createTransaction(testAccount.id, "Insufficient", "expense", 101, new Date());

    assert.deepEqual(getTransactionsByAccountId(testAccount.id), historyBefore);
});

test("rejected transactions do not consume transaction IDs", () => {
    const testUser = createUser("Transaction ID User");
    const testAccount = createAccount("Transaction ID Account", testUser.id, 1000);

    const firstTransaction = createTransaction(
        testAccount.id,
        "First Valid Transaction",
        "income",
        100,
        new Date()
    );

    assert.notEqual(firstTransaction, null);

    const invalidTransaction = createTransaction(
        testAccount.id,
        "Invalid Transaction",
        "expense",
        0,
        new Date()
    );

    assert.equal(invalidTransaction, null);

    const nextTransaction = createTransaction(
        testAccount.id,
        "Second Valid Transaction",
        "income",
        100,
        new Date()
    );

    assert.notEqual(nextTransaction, null);
    assert.equal(nextTransaction.id, firstTransaction.id + 1);
});
