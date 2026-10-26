import Sidebar from "./Sidebar"

type AppLayoutProps = {
    children: React.ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
    return(
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                {children}
            </main>
        </div>
    )
}

export default AppLayout
