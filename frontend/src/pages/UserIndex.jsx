import { useEffect } from "react"
import { UserList } from "../cmps/UserList.jsx"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { useSelector } from "react-redux"
import { loadUsers, updateUser, removeUser } from "../store/actions/user.actions"

export function UserIndex() {
  const users = useSelector(storeState => storeState.userModule.users)

  async function onRemoveUser(userId) {
    try {
      removeUser(userId)
      showSuccessMsg("User removed")
    } catch (err) {
      console.log("Error from onRemoveUser ->", err)
      showErrorMsg("Cannot remove user")
    }
  }

  async function onEditUser(user) {
    const fullname = prompt("User fullname?")
    const username = prompt("User username?")
    const password = prompt("User password?")
    const score = +prompt("User score?")

    const userToSave = {
      ...user,
      fullname,
      username,
      password,
      score,
    }

    try {
      updateUser(userToSave)
      showSuccessMsg("User updated")
    } catch (err) {
      console.log("Error from onEditUser ->", err)
      showErrorMsg("Cannot update user")
    }
  }

  if (!users) return <div>Loading...</div>
  if (users.length === 0) return <div>No users have registered yet</div>

  return (
    <main className="main-layout">
      <h3>Users</h3>
      <main>
        <UserList onRemoveUser={onRemoveUser} onEditUser={onEditUser} />
      </main>
    </main>
  )
}
