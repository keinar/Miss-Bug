import React, { useState } from "react"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { LoginSignup } from "./LoginSignUp"

export default function AuthenticationArea() {
  const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())

  async function onLogin(credentials) {
    try {
      const user = await userService.login(credentials)
      setLoggedinUser(user)
      showSuccessMsg(`Welcome ${user.fullname}`)
    } catch (err) {
      showErrorMsg("Cannot login")
    }
  }

  async function onSignup(credentials) {
    console.log(credentials)
    try {
      const user = await userService.signup(credentials)
      setLoggedinUser(user)
      showSuccessMsg(`Welcome ${user.fullname}`)
    } catch (err) {
      console.log("Cannot signup :", err)
      showErrorMsg(`Cannot signup`)
    }
    // add signup
  }

  return (
    <section className="login-signup-container">
      {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

      {loggedinUser && (
        <div className="user-preview">
          <h3>
            Hello {loggedinUser.fullname}
            <button onClick={onLogout}>Logout</button>
          </h3>
        </div>
      )}
    </section>
  )
}
