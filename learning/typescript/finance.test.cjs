
const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
    calculateRemainingBalance,
    isWithinBudget,
    inputTransaction,
    inputTransfer,
    isValidTransfer,
    isValidTransaction,
    getTotalByType,
    getAccountBalance
} = require("../../dist/typescript/finance.js");

function createAccount(id, balance) {
    return {
        id,
        userId: 0,
        name: `Account ${id}`,
        balance,
        createdAt: new Date(2026, 9, 15)
    };
}

function createBudget() {
    return {
        id: 0,
        userId: 0,
        name: "Food Budget",
        categoryId: 0,
        spendingLimit: 8000,
        remainingBalance: 8000,
        totalSpent: 0,
        year: 2026,
        month: 10
    };
}

function createTransaction(overrides = {}) {
    return {
        id: 1,
        accountId: 0,
        categoryId: 0,
        description: "Test transaction",
        type: "expense",
        amount: 1000,
        date: new Date(2026, 9, 15),
        ...overrides
    };
}

function createTransfer(overrides = {}) {
    return {
        id: 1,
        senderId: 0,
        receiverId: 1,
        amount: 1000,
        date: new Date(2026, 9, 15),
        ...overrides
    };
}

// calculateRemainingBalance

test("subtracts an expense from the balance", () => {
    assert.equal(calculateRemainingBalance(5000, "expense", 1000), 4000);
});

test("adds income to the balance", () => {
    assert.equal(calculateRemainingBalance(5000, "income", 2000), 7000);
});

// isWithinBudget

test("accepts an expense within the remaining budget", () => {
    assert.equal(isWithinBudget(createBudget(), 3000), true);
});

test("rejects an expense exceeding the remaining budget", () => {
    assert.equal(isWithinBudget(createBudget(), 9000), false);
});

test("rejects a negative expense", () => {
    assert.equal(isWithinBudget(createBudget(), -100), false);
});

// isValidTransaction

test("accepts a positive transaction amount", () => {
    assert.equal(isValidTransaction(createTransaction()), true);
});

test("rejects a zero transaction amount", () => {
    assert.equal(
        isValidTransaction(createTransaction({ amount: 0 })),
        false
    );
});

test("rejects a non-finite transaction amount", () => {
    assert.equal(
        isValidTransaction(createTransaction({ amount: Infinity })),
        false
    );
});

// isValidTransfer

test("accepts a valid transfer", () => {
    assert.equal(
        isValidTransfer(
            createAccount(0, 5000),
            createAccount(1, 3000),
            createTransfer()
        ),
        true
    );
});

test("rejects a transfer exceeding the source balance", () => {
    assert.equal(
        isValidTransfer(
            createAccount(0, 500),
            createAccount(1, 3000),
            createTransfer({ amount: 1000 })
        ),
        false
    );
});

test("rejects a transfer between the same account ID", () => {
    assert.equal(
        isValidTransfer(
            createAccount(0, 5000),
            createAccount(0, 3000),
            createTransfer()
        ),
        false
    );
});

test("rejects a non-finite transfer amount", () => {
    assert.equal(
        isValidTransfer(
            createAccount(0, 5000),
            createAccount(1, 3000),
            createTransfer({ amount: Infinity })
        ),
        false
    );
});

// inputTransaction

test("applies an expense to the account and budget", () => {
    const account = createAccount(0, 5000);
    const budget = createBudget();

    inputTransaction(account, budget, createTransaction({ amount: 1000 }));

    assert.equal(account.balance, 4000);
    assert.equal(budget.remainingBalance, 7000);
    assert.equal(budget.totalSpent, 1000);
});

test("applies income to the account without changing the budget", () => {
    const account = createAccount(0, 5000);
    const budget = createBudget();

    inputTransaction(
        account,
        budget,
        createTransaction({ type: "income", amount: 2000 })
    );

    assert.equal(account.balance, 7000);
    assert.equal(budget.remainingBalance, 8000);
    assert.equal(budget.totalSpent, 0);
});

test("does not change balances for an invalid transaction", () => {
    const account = createAccount(0, 5000);
    const budget = createBudget();

    inputTransaction(account, budget, createTransaction({ amount: -100 }));

    assert.equal(account.balance, 5000);
    assert.equal(budget.remainingBalance, 8000);
    assert.equal(budget.totalSpent, 0);
});

// inputTransfer

test("transfers money between two accounts", () => {
    const sender = createAccount(0, 5000);
    const receiver = createAccount(1, 3000);

    inputTransfer(sender, receiver, createTransfer({ amount: 1000 }));

    assert.equal(sender.balance, 4000);
    assert.equal(receiver.balance, 4000);
});

test("does not transfer more than the sender can afford", () => {
    const sender = createAccount(0, 500);
    const receiver = createAccount(1, 3000);

    inputTransfer(sender, receiver, createTransfer({ amount: 1000 }));

    assert.equal(sender.balance, 500);
    assert.equal(receiver.balance, 3000);
});

// getTotalByType

test("calculates the total expenses", () => {
    const transactions = [
        createTransaction({ amount: 1000, type: "expense" }),
        createTransaction({ id: 2, amount: 500, type: "expense" }),
        createTransaction({ id: 3, amount: 2000, type: "income" })
    ];

    assert.equal(getTotalByType("expense", transactions), 1500);
});

test("returns zero when there are no matching transactions", () => {
    assert.equal(getTotalByType("income", []), 0);
});

// getAccountBalance

test("calculates an account balance from its opening balance and history", () => {
    const account = createAccount(0, 50000);

    const transactions = [
        createTransaction({ accountId: 0, amount: 5000 })
    ];

    const transfers = [
        createTransfer({ senderId: 0, receiverId: 1, amount: 10000 })
    ];

    assert.equal(getAccountBalance(account, transactions, transfers), 35000);
});

test("adds incoming transfers to the account balance", () => {
    const account = createAccount(1, 30000);

    const transfers = [
        createTransfer({ senderId: 0, receiverId: 1, amount: 10000 })
    ];

    assert.equal(getAccountBalance(account, [], transfers), 40000);
});


test("does not modify the account when calculating its balance", () => {
    const account = createAccount(1, 50000);

    const transactions = [
        createTransaction({
            accountId: 1,
            type: "expense",
            amount: 5000
        })
    ];

    const transfers = [];

    const firstBalance = getAccountBalance(
        account,
        transactions,
        transfers
    );

    const secondBalance = getAccountBalance(
        account,
        transactions,
        transfers
    );

    assert.equal(firstBalance, 45000);
    assert.equal(secondBalance, 45000);
    assert.equal(account.balance, 50000);
});

test("ignores transactions belonging to other accounts", () => {
    const account = createAccount(1, 50000);

    const transactions = [
        createTransaction({
            accountId: 2,
            type: "expense",
            amount: 10000
        })
    ];

    const transfers = [];

    assert.equal(
        getAccountBalance(account, transactions, transfers),
        50000
    );
});


test("rejects a transfer with a mismatched sender ID", () => {
    const source = createAccount(1, 50000);
    const receiver = createAccount(2, 30000);

    const transfer = createTransfer({
        senderId: 3,
        receiverId: 2,
        amount: 10000
    });

    assert.equal(
        isValidTransfer(source, receiver, transfer),
        false
    );
});

test("rejects a transfer with a mismatched receiver ID", () => {
    const source = createAccount(1, 50000);
    const receiver = createAccount(2, 30000);

    const transfer = createTransfer({
        senderId: 1,
        receiverId: 3,
        amount: 10000
    });

    assert.equal(
        isValidTransfer(source, receiver, transfer),
        false
    );
});


