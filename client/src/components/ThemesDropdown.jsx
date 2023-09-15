import React, { useState } from "react";
import {BsCaretDownFill,BsCaretUpFill} from "react-icons/bs"
import monacoThemes from "monaco-themes/themes/themelist"
import { socket } from "@/context/SocketContext";

function ThemesDropdown({ onThemeChange, selectedTheme }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleDropdown = () => {
        setIsDropdownOpen((currentState) => !currentState)
    }

    const handleClick = (theme) => {
        console.log(theme)
        socket.emit("theme-change", {data: theme})
        onThemeChange(theme)
        setIsDropdownOpen(false)
    }
  return(
  <div className="custom-select cursor-pointer">
    <div className="dropdown-header" onClick={handleDropdown}>
        <span>{selectedTheme.label}</span>
        <BsCaretDownFill style={{transform: `rotate(${isDropdownOpen ? "180deg" : 0})`, transition: "all 0.3s ease"}}/>
    </div>
    <div className="dropdown-options" style={{display: `${isDropdownOpen ? "flex" : "none"}`}}>
        {Object.entries(monacoThemes).map(([themeId, themeName]) => <button key={themeId} className={`dropdown-list-item ${themeId === selectedTheme ? "selected" : "" }`} onClick={() => handleClick({value: themeId, label: themeName})}>{themeName}</button>)}
    </div>
  </div>)
}

export default ThemesDropdown;
