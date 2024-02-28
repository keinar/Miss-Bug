import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useParams } from "react-router"
import { userService } from "../services/user.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"
import { bugService } from "../services/bug.service.js"
import { BugList } from "../cmps/BugList.jsx"

export function UserDetails() {
  const [user, setUser] = useState(null)
  const [bugs, setBugs] = useState(null)

  const { userId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
    loadBugs()
  }, [userId])

  async function loadUser() {
    try {
      const user = await userService.getById(userId)
      setUser(user)
    } catch (err) {
      console.log(err.response.data)
      showErrorMsg("Cannot load user")
      navigate("/user")
    }
  }

  async function loadBugs() {
    const bugs = await bugService.query({ owner: userId })
    setBugs(bugs)
  }

  if (!user || !bugs) return <h1>loadings....</h1>

  return (
    <main className="user-details main-layout">
      <h2>My Profile</h2>
      <section className="user-profile">
        <img src={user.imgUrl} alt="user" width={200} />
        <article>
          <h3>{user.fullname}</h3>
          <p>
            Usename: <span>{user.username}</span>
          </p>
          {user.score && (
            <p>
              Score: <span>{user.score}</span>
            </p>
          )}
          <p>
            Bugs Count: <span>{user.bugsCount}</span>
          </p>
          {user.isAdmin && <Link to="/user">Back to List</Link>}
        </article>
      </section>

      <h3>User's Bugs</h3>
      <section className="user-bugs">
        {!bugs && <div>Loading...</div>}
        {bugs && bugs.length === 0 && <div>No bugs reported</div>}
        {bugs && bugs.length > 0 && <BugList bugsToDisplay={bugs} />}
      </section>
    </main>
  )
}
