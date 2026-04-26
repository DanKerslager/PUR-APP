export default function Topbar({ isAuthenticated, user, onLogin, onLogout, onRegister }) {
  return (
    <header className="topbar">
      <span className="topbar-title">Počasí</span>
      <div className="topbar-auth">
        {isAuthenticated && user && <span className="user-greeting">Hello, {user.name}</span>}
        {!isAuthenticated && <button className="btn btn-ghost" onClick={onRegister}>Register</button>}
        {!isAuthenticated && <button className="btn btn-primary" onClick={onLogin}>Login</button>}
        {isAuthenticated && <button className="btn btn-ghost" onClick={onLogout}>Logout</button>}
      </div>
    </header>
  )
}
