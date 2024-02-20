import { Link } from "react-router-dom"
import { BugPreview } from "./BugPreview"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { bugService } from "../services/bug.service"
import { userService } from "../services/user.service"

export function BugList({ bugsToDisplay, setBugsToDisplay }) {
  const loggedinUser = userService.getLoggedinUser()
  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log("Deleted Succesfully!")
      setBugsToDisplay(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
      showSuccessMsg("Bug removed")
    } catch (err) {
      // console.log("Error from onRemoveBug ->", err)
      showErrorMsg("Cannot remove bug")
    }
  }

  function isAllowed(bug) {
    return bug.owner?._id === loggedinUser?._id || loggedinUser?.isAdmin
  }

  async function onEditBug(bug) {
    const severity = +prompt("New severity?")
    if (typeof severity !== "number" || !severity || severity < 1 || severity > 5) {
      return alert(`Invalid severity: ${severity}, please set a number between 1 and 5`)
    }
    const bugToSave = { ...bug, severity }
    try {
      const savedBug = await bugService.save(bugToSave)

      setBugsToDisplay(prevBugs => prevBugs.map(currBug => (currBug._id === savedBug._id ? savedBug : currBug)))
      showSuccessMsg("Bug updated")
    } catch (err) {
      // console.log("Error from onEditBug ->", err)
      showErrorMsg("Cannot update bug")
    }
  }

  return (
    <ul className="bug-list">
      {bugsToDisplay.map(bug => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            {isAllowed(bug) && (
              <button
                onClick={() => {
                  onRemoveBug(bug._id)
                }}
              >
                x
              </button>
            )}
            {isAllowed(bug) && (
              <button
                onClick={() => {
                  onEditBug(bug)
                }}
              >
                Edit
              </button>
            )}
          </div>
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
