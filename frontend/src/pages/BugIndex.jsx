import { bugService } from "../services/bug.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { BugList } from "../cmps/BugList.jsx"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import BugFilter from "../cmps/BugFilter.jsx"
import { AddBugForm } from "../cmps/AddBugForm.jsx"
import BugSorting from "../cmps/BugSorting.jsx"
import Pagination from "../assets/style/cmps/Pagination.jsx"
import jsPDF from "jspdf"
import DownloadPDF from "../cmps/downloadPDF.jsx"
import { utilService } from "../services/util.service.js"

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [bugsToDisplay, setBugsToDisplay] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
  const debouncedSetFilterBy = useCallback(utilService.debounce(onSetFilterBy, 500), [])
  const [sortObj, setSortObj] = useState(bugService.getDefaultSort())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadBugsToDisplay()
  }, [filterBy, sortObj])

  useEffect(() => {
    loadBugs()
  }, [])

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

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  function onOpenDialog() {
    setIsDialogOpen(true)
  }

  const onCloseDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <main className="main-layout">
      <h3>Bugs App</h3>
      <section>
        <BugSorting setSortObj={setSortObj} />
        <BugFilter bugs={bugs} filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy} />
        <button onClick={onOpenDialog}>Add Bug 🐞</button>
        {isDialogOpen && (
          <dialog open={isDialogOpen} className="dialog">
            <AddBugForm setBugsToDisplay={setBugsToDisplay} setIsDialogOpen={setIsDialogOpen} />
            <button onClick={onCloseDialog}>Close</button>
          </dialog>
        )}
        <DownloadPDF bugsToDisplay={bugsToDisplay} />
        <BugList bugsToDisplay={bugsToDisplay} setBugsToDisplay={setBugsToDisplay} />
      </section>
      <Pagination filterBy={filterBy} setFilterBy={setFilterBy} bugsToDisplay={bugsToDisplay} />
    </main>
  )
}
