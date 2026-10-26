import AppLayout from "./components/layout/AppLayout"
import AccountOverview from "./components/accounts/AccountOverview"
import TransactionList from "./components/transactions/TransactionList"
import "./App.css"

function App() {
  return (
    <AppLayout>
      <div className="dashboard">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back!</p>
          </div>
        </header>

        <section className="dashboard-overview">
          <h2>Overview</h2>
          <AccountOverview />
        </section>

        <section className="dashboard-transactions">
          <h2>Recent Transactions</h2>
          <TransactionList />
        </section>
      </div>
    </AppLayout>
  );
}

export default App