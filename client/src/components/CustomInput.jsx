import { socket } from "@/context/SocketContext";
import React from "react";

function CustomInput({customInput, setCustomInput}) {
    const handleTextAreaChange = (e) => {
        socket.emit("custom-input-change", {data: e.target.value})
        setCustomInput(e.target.value)
    }
    return <>
        <textarea placeholder="Custom Input" className="w-full h-full border-black border-[3px] rounded-md p-4 shadow-custom-black focus:outline-none active:outline-none" value={customInput} onChange={handleTextAreaChange}/>
    </>
}

export default CustomInput