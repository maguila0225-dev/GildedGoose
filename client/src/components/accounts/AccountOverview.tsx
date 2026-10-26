import type { Account} from "../../models/account"

const accounts: Account[] = [
  {
    id: 0,
    name: "Main Checking",
    userId: 0,
    balance: 50000,
    isActive: true,
  },
  {
    id: 1,
    name: "Savings",
    userId: 0,
    balance: 10000,
    isActive: true,
  },
  {
    id: 2,
    name: "Travel Fund",
    userId: 0,
    balance: 5000,
    isActive: true,
  },
];

function formatCurrency(amount: number): string {
    return Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(amount)
}

function AccountOverview() {
    const activeAccounts = accounts.filter((account) => account.isActive)
    const totalBalance = activeAccounts.reduce((total, account) => account.balance + total, 0)
    
    return(
    <section className="account-overview">
      <div className="account-summary">
        <article className="summary-card">
          <h3>Total Balance</h3>
          <p className="summary-value">{formatCurrency(totalBalance)}</p>
        </article>

        <article className="summary-card">
          <h3>Active Accounts</h3>
          <p className="summary-value">{activeAccounts.length}</p>
        </article>
      </div>

      <div className="account-list">
        {activeAccounts.map((account) => (
          <article className="account-card" key={account.id}>
            <h3>{account.name}</h3>
            <p>{formatCurrency(account.balance)}</p>
          </article>
        ))}
      </div>
    </section>
    )
}

export default AccountOverview