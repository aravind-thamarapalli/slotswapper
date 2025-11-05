import React from 'react'

export function cn(...inputs) {
  const clsx = (...classes) => {
    return classes
      .flat()
      .filter(Boolean)
      .join(' ')
  }

  const twMerge = (classString) => {
    // Simple implementation for merging tailwind classes
    return classString
  }

  return twMerge(clsx(inputs))
}
