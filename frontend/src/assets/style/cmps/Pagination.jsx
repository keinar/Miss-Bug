import React from "react"

export default function Pagination({ filterBy, bugsToDisplay, setFilterBy }) {
  function onChangePageIdx(pageIdx) {
    setFilterBy(prevFilter => ({ ...prevFilter, pageIdx }))
  }
  return (
    <section className="pagination">
      <button onClick={() => onChangePageIdx(filterBy.pageIdx - 1)} disabled={filterBy.pageIdx === 0}>
        -
      </button>
      <span>{filterBy.pageIdx + 1}</span>
      <button onClick={() => onChangePageIdx(filterBy.pageIdx + 1)} disabled={bugsToDisplay.length < 6}>
        +
      </button>
    </section>
  )
}
