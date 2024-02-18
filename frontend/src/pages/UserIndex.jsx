import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { UserList } from "../cmps/UserList.jsx"
import { useState, useEffect } from "react"

export function UserIndex() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const users = await userService.query()
    setUsers(users)
  }

  async function onRemoveUser(userId) {
    try {
      await userService.remove(userId)
      console.log("Deleted Succesfully!")
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
      showSuccessMsg("User removed")
    } catch (err) {
      console.log("Error from onRemoveUser ->", err)
      showErrorMsg("Cannot remove user")
    }
  }

  async function onAddUser() {
    const user = {
      username: prompt("username?") || "",
      fullname: prompt("fullname?") || "",
      score: +prompt("User score?") || 0,
    }
    try {
      const savedUser = await userService.save(user)
      console.log("Added User", savedUser)
      setUsers(prevUsers => [...prevUsers, savedUser])
      showSuccessMsg("User added")
    } catch (err) {
      console.log("Error from onAddUser ->", err)
      showErrorMsg("Cannot add user")
    }
  }

  async function onEditUser(user) {
    const score = +prompt("New score?")
    const userToSave = { ...user, score }
    try {
      const savedUser = await userService.save(userToSave)
      console.log("Updated User:", savedUser)
      setUsers(prevUsers => prevUsers.map(currUser => (currUser._id === savedUser._id ? savedUser : currUser)))
      showSuccessMsg("User updated")
    } catch (err) {
      console.log("Error from onEditUser ->", err)
      showErrorMsg("Cannot update user")
    }
  }

  return (
    <main className="main-layout">
      <h3>Users App</h3>
      <main>
        <button onClick={onAddUser}>Add User</button>
        <UserList users={users} onRemoveUser={onRemoveUser} onEditUser={onEditUser} />
      </main>
    </main>
  )
}
