import { useState, useEffect } from "react"
import { ImgUploader } from "./ImgUploader"
import { userService } from "../services/user.service.js"
import { useSelector } from "react-redux"
import { signup, login, logout } from "../store/actions/user.actions"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

export function LoginSignup() {
  const [credentials, setCredentials] = useState(userService.getEmptyUser())
  const [isSignup, setIsSignup] = useState(false)
  const users = useSelector(storeState => storeState.userModule.users)
  const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

  function clearState() {
    setCredentials(userService.getEmptyUser())
    setIsSignup(false)
  }

  function handleChange(ev) {
    const field = ev.target.name
    const value = ev.target.value
    setCredentials(prevCredentials => ({ ...prevCredentials, [field]: value }))
  }

  async function onSubmitForm(ev = null) {
    if (ev) ev.preventDefault()

    if (isSignup) {
      if (!credentials.username || !credentials.password || !credentials.fullname) return

      try {
        signup(credentials)
        showSuccessMsg(`Welcome ${credentials.username}`)
      } catch (err) {
        console.log("Cannot signup :", err)
        showErrorMsg(`Cannot signup`)
      }
    } else {
      if (!credentials.username) return

      try {
        login(credentials)
        showSuccessMsg(`Welcome ${credentials.username}`)
      } catch (err) {
        console.log("Cannot login :", err)
        showErrorMsg(`Cannot login`)
      }
    }
    clearState()
  }

  async function onLogout() {
    logout()
  }

  function toggleSignup() {
    setIsSignup(prevIsSignup => !prevIsSignup)
  }

  function onUploaded(imgUrl) {
    setCredentials(prevCredentials => ({ ...prevCredentials, imgUrl }))
  }

  return (
    <>
      {!loggedinUser && (
        <div className="login-page">
          <button className="btn-link" onClick={toggleSignup}>
            {!isSignup ? "Not a user? Signup" : "Already a user? Login"}
          </button>
          {!isSignup && (
            <form className="login-form" onSubmit={onSubmitForm}>
              <select name="username" value={credentials.username} onChange={handleChange}>
                <option value="">Select User</option>
                {users &&
                  users.length > 0 &&
                  users.map(user => (
                    <option key={user._id} value={user.username}>
                      {user.fullname}
                    </option>
                  ))}
              </select>
              {/* <input
                        type="text"
                        name="username"
                        value={username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    /> */}
              <button>Login!</button>
            </form>
          )}
          <div className="signup-section">
            {isSignup && (
              <form className="signup-form" onSubmit={onSubmitForm}>
                <input type="text" name="fullname" value={credentials.fullname} placeholder="Fullname" onChange={handleChange} required />
                <input type="text" name="username" value={credentials.username} placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" value={credentials.password} placeholder="Password" onChange={handleChange} required />
                <ImgUploader onUploaded={onUploaded} />
                <button>Signup!</button>
              </form>
            )}
          </div>
        </div>
      )}
      {loggedinUser && (
        <div className="user-preview">
          <h3>
            Hello {loggedinUser.fullname}
            <button onClick={onLogout}>Logout</button>
          </h3>
        </div>
      )}
    </>
  )
}
