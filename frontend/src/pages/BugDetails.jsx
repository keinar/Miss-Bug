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
    <main className="bug-details main-layout">
      <h1>Bug Details 🐛</h1>
      <h2>{bug.title}</h2>
      <p>
        <strong>Severity:</strong> <span>{bug.severity}</span>
      </p>
      <p>
        <strong>Description:</strong> <span>{bug.description}</span>
      </p>
      {bug.labels && (
        <p>
          <strong>Labels:</strong> <span>{bug.labels ? bug.labels.map((label, index) => <span key={index}>{"#" + label + " "}</span>) : ""}</span>
        </p>
      )}
      <p>
        <strong>Created At: </strong>
        <span>{new Date(bug.createdAt).toLocaleString()}</span>
      </p>
      <button className="btn-btl">
        <Link to="/bug">Back to List</Link>
      </button>
    </main>
  )
}
