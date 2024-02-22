import { useEffect, useState } from "react"
import { UserMsg } from "./UserMsg"
import { NavLink } from "react-router-dom"
import AuthenticationArea from "./AuthenticationArea"
import { userService } from "../services/user.service"
import { loadUsers, logout, setLoggedinUser } from "../store/actions/user.actions"
import { useSelector } from "react-redux"

export function AppHeader() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

  useEffect(() => {
    loadUsers()
  }, [])

  function openAuthDialog() {
    setIsAuthDialogOpen(true)
  }

  function closeAuthDialog() {
    setIsAuthDialogOpen(false)
  }

  async function onLogout() {
    console.log("logout")
    try {
      logout()
      setLoggedinUser(null)
    } catch (err) {
      console.log("can not logout")
    }
    // add logout
  }

  return (
    <header className="app-header">
      <div className="header-container">
        <UserMsg />
        <nav className="app-nav">
          <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |<NavLink to="/user">Users</NavLink> |<NavLink to="/about">About</NavLink>
          {!loggedinUser && <button onClick={openAuthDialog}>Log In</button>}
          {isAuthDialogOpen && (
            <dialog open={isAuthDialogOpen} className="auth-dialog">
              <AuthenticationArea loggedinUser={loggedinUser} setLoggedinUser={setLoggedinUser} />
              <button onClick={closeAuthDialog}>Close</button>
            </dialog>
          )}
          {loggedinUser && (
            <div className="user-preview">
              <h3>
                Hello {loggedinUser.fullname}
                <button onClick={onLogout}>Logout</button>
              </h3>
            </div>
          )}
        </nav>
        <h1>Bugs are Forever</h1>
      </div>
    </header>
  )
}
