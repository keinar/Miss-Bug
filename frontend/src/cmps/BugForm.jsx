import React, { useState } from "react"
import { bugService } from "../services/bug.service"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export function BugForm({ setBugsToDisplay, setIsDialogOpen }) {
  // State to hold form inputs
  const [bugTitle, setBugTitle] = useState("")
  const [bugDescription, setBugDescription] = useState("")
  const [bugLabels, setBugLabels] = useState("")
  const [bugSeverity, setBugSeverity] = useState("")

  async function onAddBug(bug) {
    try {
      const savedBug = await bugService.save(bug)
      console.log("Added Bug", savedBug)
      setBugsToDisplay(prevBugs => [...prevBugs, savedBug])
      showSuccessMsg("Bug added")
      setIsDialogOpen(false)
    } catch (err) {
      console.log("Error from onAddBug ->", err)
      showErrorMsg("Cannot add bug")
    }
  }

  // Handler for form submission
  const handleSubmit = async event => {
    event.preventDefault()

    // Construct the bug object
    const bug = {
      title: bugTitle,
      description: bugDescription,
      labels: bugLabels.split(",").map(label => label.trim()),
      severity: parseInt(bugSeverity, 10),
    }

    // Call the provided onAddBug function with the new bug
    await onAddBug(bug)

    // Clear the form
    setBugTitle("")
    setBugDescription("")
    setBugLabels("")
    setBugSeverity("")
  }

  return (
    <form onSubmit={handleSubmit} className="bug-form">
      <div>
        <label htmlFor="bugTitle">Title:</label>
        <input id="bugTitle" value={bugTitle} onChange={e => setBugTitle(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="bugDescription">Description:</label>
        <textarea id="bugDescription" value={bugDescription} onChange={e => setBugDescription(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="bugLabels">Labels:</label>
        <input id="bugLabels" value={bugLabels} onChange={e => setBugLabels(e.target.value)} />
      </div>
      <div>
        <label htmlFor="bugSeverity">Severity:</label>
        <input id="bugSeverity" type="number" value={bugSeverity} onChange={e => setBugSeverity(e.target.value)} required />
      </div>
      <button type="submit">Add Bug</button>
    </form>
  )
}
