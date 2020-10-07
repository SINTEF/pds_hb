import React, { useEffect } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useClickOutside: (
  ref: React.RefObject<HTMLElement>,
  onClickOutside: () => void
) => void = (ref, onClickOutside) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside()
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClickOutside])
}
