import { useEffect, useState } from "react"
import { UserMsg } from "./UserMsg"
import { NavLink } from "react-router-dom"
import AuthenticationArea from "./AuthenticationArea"

export function AppHeader() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)

  useEffect(() => {
    // component did mount when dependancy array is empty
  }, [])

  function openAuthDialog() {
    setIsAuthDialogOpen(true)
  }

  function closeAuthDialog() {
    setIsAuthDialogOpen(false)
  }
  return (
    <header className="app-header">
      <div className="header-container">
        <UserMsg />
        <nav className="app-nav">
          <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |<NavLink to="/user">Users</NavLink> |<NavLink to="/about">About</NavLink>
          <button onClick={openAuthDialog}>Log In</button>
          {isAuthDialogOpen && (
            <dialog open={isAuthDialogOpen} className="auth-dialog">
              <AuthenticationArea />
              <button onClick={closeAuthDialog}>Close</button>
            </dialog>
          )}
        </nav>
        <h1>Bugs are Forever</h1>
      </div>
    </header>
  )
}
