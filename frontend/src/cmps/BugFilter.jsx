import React, { useEffect, useState } from "react"

export default function BugFilter({ filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  useEffect(() => {
    console.log("filterByToEdit: ", filterByToEdit)
    onSetFilterBy(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    let { name: field, value } = target

    switch (target.type) {
      case "number":
      case "range":
        value = +value || ""
        break

      case "checkbox":
        value = target.checked
        break
      default:
        break
    }
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
      </form>
    </section>
  )
}
