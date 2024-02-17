/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';

export function SortingButton({caption, sortInitialValue, onSort}) {
  const [isAscending, setIsAscending] = useState(sortInitialValue.isAscending);
  const buttonWasClicked = useRef(false);

    useEffect(() => {
        if (!buttonWasClicked.current)  // activate callback only on explicit user-click
            return;
        onSort(sortInitialValue.key, isAscending); 
    }, [isAscending])

    const toggleSorting = (event) => {
        event.preventDefault();
        buttonWasClicked.current = true;
        setIsAscending((prevAscending) => !prevAscending);
    };

  return (
    <button className="filter-button-style sort-button" onClick={toggleSorting}>
      {isAscending ? '▴' : '▾'}{caption}
    </button>
  )
}


