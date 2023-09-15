import React from "react";

function Pointer({xCoord, yCoord, }) {
    return <div className={`bg-red-500 absolute left-[${xCoord}] top-[${yCoord}]`} ></div>
}