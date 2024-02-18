import React, { useEffect, useState } from "react"

export default function BugFilter({ bugs, filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
  const [uniqueLabels, setUniqueLabels] = useState([])

  useEffect(() => {
    onSetFilterBy(filterByToEdit)
  }, [filterByToEdit])

  useEffect(() => {
    const labels = bugs
      .map(bug => bug.labels) // Map to labels
      .filter(Boolean) // Remove undefined
      .flat() // Flatten the array
      .filter((value, index, self) => self.indexOf(value) === index) // Deduplicate
    setUniqueLabels(labels)
  }, [bugs])

  function handleChange({ target }) {
    let { name: field, value } = target
    setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
  }

  const { txt, severity } = filterByToEdit
  return (
    <section className="bug-filter">
      <h2>Filter Bugs</h2>
      <form>
        <label htmlFor="txt">Text: </label>
        <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

        <label htmlFor="severity">Severity: </label>
        <input value={severity} onChange={handleChange} type="number" placeholder="By Severity" id="severity" name="severity" />

        <label htmlFor="labels" className="labels">
          Labels:
        </label>
        <select id="labels" name="labels" onChange={handleChange}>
          <option value="">All Labels</option>
          {uniqueLabels.map(label => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </form>
    </section>
  )
}
