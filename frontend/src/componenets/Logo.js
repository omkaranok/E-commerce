import React from 'react'

const Logo = ({w,h}) => {
  return (
    <svg
    width={w}
    height={h}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="50"
      cy="50"
      r="45"
      stroke="black"
      strokeWidth="10"
      fill="none"
    />
    <text
      x="50"
      y="60"
      fontFamily="'Lucida Calligraphy', 'Brush Script MT', cursive"
      fontSize="50"
      textAnchor="middle"
      fill="black"
      fontWeight="bold"
    >
      M
    </text>
  </svg>
  )
}

export default Logo