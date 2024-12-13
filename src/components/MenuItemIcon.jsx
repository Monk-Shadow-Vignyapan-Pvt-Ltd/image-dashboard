import React from 'react'
import { UnFillCircle } from './Icons/UnFillCircle'

const MenuItemIcon = () => {
  return (
    <div className="icon-lg flex items-center justify-center rounded-lg"> {/* bg-cardBg */}
        <UnFillCircle width={12} height={12} fill={"none"}  />
    </div>
  )
}

export default MenuItemIcon