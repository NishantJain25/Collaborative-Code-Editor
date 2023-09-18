import React, { useState, useRef } from "react";


function AccountsCircle({name, color}) {
    const [hover, setHover] = useState(false)
    console.log(name)
    return <div className={`p-[10px] ml-[-10px] border-[3px] bg-${color} border-black rounded-full flex items-center justify-center self-end transition-all overflow-hidden`}  onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}><p className="p-0">{hover ? name : name[0].toUpperCase()}</p></div>
}

export default AccountsCircle