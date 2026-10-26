
import type { Transaction } from "../../models/transaction";

type TransactionEntry = Transaction & {
  accountName: string;
};

const transactions: TransactionEntry[] = [
  {
    id: 0,
    description: "Monthly Salary",
    type: "income",
    amount: 45000,
    accountId: 0,
    date: new Date("2026-10-25"),
    accountName: "Main Checking",
  },
  {
    id: 1,
    description: "Groceries",
    type: "expense",
    amount: 2500,
    accountId: 0,
    date: new Date("2026-10-24"),
    accountName: "Main Checking",
  },
  {
    id: 2,
    description: "Monthly Savings",
    type: "expense",
    amount: 5000,
    accountId: 0,
    date: new Date("2026-10-22"),
    accountName: "Main Checking",
  },
  {
    id: 3,
    description: "Freelance Project",
    type: "income",
    amount: 8000,
    accountId: 1,
    date: new Date("2026-10-20"),
    accountName: "Savings",
  },
  {
    id: 4,
    description: "Coffee",
    type: "expense",
    amount: 180,
    accountId: 0,
    date: new Date("2026-10-18"),
    accountName: "Main Checking",
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function TransactionList() {
  const sortedTransactions = [...transactions].sort(
    (first, second) => second.date.getTime() - first.date.getTime(),
  );

  return (
    <div className="transaction-list">
      {sortedTransactions.map((transaction) => (
        <article className="transaction-row" key={transaction.id}>
          <div className="transaction-details">
            <h3>{transaction.description || "Untitled Transaction"}</h3>
            <p>
              {formatDate(transaction.date)} · {transaction.accountName}
            </p>
          </div>

          <div className="transaction-amount">
            <span className={`transaction-type ${transaction.type}`}>
              {transaction.type}
            </span>
            <p className={transaction.type}>
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default TransactionList;
