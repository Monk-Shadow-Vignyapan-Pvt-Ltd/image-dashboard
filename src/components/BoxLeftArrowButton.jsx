import React from 'react'
import { WithStrokeUpArrow } from './Icons/WithStrokeUpArrow'

const BoxLeftArrowButton = () => {
  return (
    <button className="icon-lg flex items-center justify-center bg-cardBg rounded-lg -rotate-90">
        <WithStrokeUpArrow width={20} height={20} fill={"none"} stroke={"#f05f23"} />
    </button>
  )
}

export default BoxLeftArrowButton