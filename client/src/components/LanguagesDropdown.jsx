import React, { useState } from "react";
import { languageOptions } from "@/constants/languageOptions";
import {BsCaretDownFill,BsCaretUpFill} from "react-icons/bs"
import { socket } from "@/context/SocketContext";


function LanguagesDropdown({ onLanguageChange, selectedLanguage }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleDropdown = () => {
        setIsDropdownOpen((currentState) => !currentState)
    }

    const handleClick = (language) => {
        onLanguageChange(language)
        socket.emit("language-change", {data: language})
        setIsDropdownOpen(false)
    }
  return(
  <div className="custom-select cursor-pointer">
    <div className="dropdown-header" onClick={handleDropdown}>
        <span>{selectedLanguage.name}</span>
        <BsCaretDownFill style={{transform: `rotate(${isDropdownOpen ? "180deg" : 0})`, transition: "all 0.3s ease"}}/>
    </div>
    <div className="dropdown-options" style={{display: `${isDropdownOpen ? "flex" : "none"}`}}>
        {languageOptions.map((language, index) => <button key={index} className={`dropdown-list-item ${language.name === selectedLanguage.name ? "selected" : "" }`} onClick={() => handleClick(language)}>{language.name}</button>)}
    </div>
  </div>)
}

export default LanguagesDropdown;
