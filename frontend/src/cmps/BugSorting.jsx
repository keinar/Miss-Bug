import React, { useRef } from "react"
import { SortingButton } from "./SortingButton"
import { bugService } from "../services/bug.service"

export default function BugSorting({ setSortObj }) {
  const sortInitialValues = useRef(bugService.getInitialSortValues())
  const { title: titleInitialValue, severity: severityInitialValue, createdAt: createdAtInitialValue } = sortInitialValues.current

  function onSetSortObj(key, isAscending) {
    const sortDir = isAscending ? 1 : -1 // Ascending = 1, Descending = -1
    setSortObj({ sortBy: key, sortDir })
  }

  return (
    <div>
      <h2>Sorting</h2>
      <SortingButton caption="Created" sortInitialValue={createdAtInitialValue} onSort={onSetSortObj} />
      <SortingButton caption="Severity" sortInitialValue={severityInitialValue} onSort={onSetSortObj} />
      <SortingButton caption="Title" sortInitialValue={titleInitialValue} onSort={onSetSortObj} />
    </div>
  )
}
