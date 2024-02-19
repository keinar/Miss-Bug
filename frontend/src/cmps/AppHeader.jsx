import { useEffect, useState } from "react"
import { UserMsg } from "./UserMsg"
import { NavLink } from "react-router-dom"
import AuthenticationArea from "./AuthenticationArea"

export function AppHeader() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())

  useEffect(() => {
    // component did mount when dependancy array is empty
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
      await userService.logout()
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
