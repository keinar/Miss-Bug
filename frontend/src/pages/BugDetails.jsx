import { useState } from "react"
import { showErrorMsg } from "../services/event-bus.service.js"
import { useNavigate, useParams } from "react-router"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { bugService } from "../services/bug.service.js"

export function BugDetails() {
  const [bug, setBug] = useState(null)
  const { bugId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadBug()
  }, [])

  async function loadBug() {
    try {
      const bug = await bugService.getById(bugId)
      setBug(bug)
    } catch (err) {
      showErrorMsg(err.response.data)
      navigate("/bug")
    }
  }

  if (!bug) return <h1>loadings....</h1>
  return (
    <div className="bug-details main-layout">
      <h3>Bug Details 🐛</h3>
      <h4>{bug.title}</h4>
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
      <Link to="/bug">Back to List</Link>
    </div>
  )
}
