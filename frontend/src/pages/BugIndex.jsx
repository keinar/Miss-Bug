import { bugService } from "../services/bug.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { BugList } from "../cmps/BugList.jsx"
import { useRef, useState } from "react"
import { useEffect } from "react"
import BugFilter from "../cmps/BugFilter.jsx"
import { SortingButton } from "../cmps/SortingButton.jsx"
import { BugForm } from "../cmps/BugForm.jsx"

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [bugsToDisplay, setBugsToDisplay] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
  const [sortObj, setSortObj] = useState(bugService.getDefaultSort())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const sortInitialValues = useRef(bugService.getInitialSortValues())

  useEffect(() => {
    loadBugsToDisplay()
  }, [filterBy, sortObj])

  useEffect(() => {
    loadBugs()
  }, [bugs])

  // load bugs without filtering
  async function loadBugs() {
    const bugs = await bugService.query()
    setBugs(bugs)
  }

  // load bugs with filtering
  async function loadBugsToDisplay() {
    const bugsToDisplay = await bugService.query(filterBy, sortObj)
    setBugsToDisplay(bugsToDisplay)
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log("Deleted Succesfully!")
      setBugsToDisplay(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
      showSuccessMsg("Bug removed")
    } catch (err) {
      console.log("Error from onRemoveBug ->", err)
      showErrorMsg("Cannot remove bug")
    }
  }

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

  async function onEditBug(bug) {
    const severity = +prompt("New severity?")
    const bugToSave = { ...bug, severity }
    try {
      const savedBug = await bugService.save(bugToSave)
      console.log("Updated Bug:", savedBug)
      setBugsToDisplay(prevBugs => prevBugs.map(currBug => (currBug._id === savedBug._id ? savedBug : currBug)))
      showSuccessMsg("Bug updated")
    } catch (err) {
      console.log("Error from onEditBug ->", err)
      showErrorMsg("Cannot update bug")
    }
  }
  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  function onChangePageIdx(pageIdx) {
    setFilterBy(prevFilter => ({ ...prevFilter, pageIdx }))
  }

  function onSetSortObj(key, isAscending) {
    const sortDir = isAscending ? 1 : -1 // Ascending = 1, Descending = -1
    setSortObj({ sortBy: key, sortDir })
  }

  function onOpenDialog() {
    setIsDialogOpen(true)
  }

  const onCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const { title: titleInitialValue, severity: severityInitialValue, createdAt: createdAtInitialValue } = sortInitialValues.current

  return (
    <main className="main-layout">
      <h3>Bugs App</h3>
      <section>
        <div>
          <h2>Sorting</h2>
          <SortingButton caption="Created" sortInitialValue={createdAtInitialValue} onSort={onSetSortObj} />
          <SortingButton caption="Severity" sortInitialValue={severityInitialValue} onSort={onSetSortObj} />
          <SortingButton caption="Title" sortInitialValue={titleInitialValue} onSort={onSetSortObj} />
        </div>
        <BugFilter bugs={bugs} filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <button onClick={onOpenDialog}>Add Bug 🐞</button>
        {isDialogOpen && (
          <dialog open={isDialogOpen} className="dialog">
            <BugForm onAddBug={onAddBug} />
            <button onClick={onCloseDialog}>Close</button>
          </dialog>
        )}
        <BugList bugsToDisplay={bugsToDisplay} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </section>
      <section className="pagination">
        <button onClick={() => onChangePageIdx(filterBy.pageIdx - 1)} disabled={filterBy.pageIdx === 0}>
          -
        </button>
        <span>{filterBy.pageIdx + 1}</span>
        <button onClick={() => onChangePageIdx(filterBy.pageIdx + 1)} disabled={bugsToDisplay.length < 6}>
          +
        </button>
      </section>
    </main>
  )
}
