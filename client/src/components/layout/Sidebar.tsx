function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>GildedGoose</h1>
      </div>

      <nav className="sidebar-nav">
        <a href="#" className="sidebar-link active">
          Dashboard
        </a>

        <a href="#" className="sidebar-link">
          Accounts
        </a>

        <a href="#" className="sidebar-link">
          Transactions
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
