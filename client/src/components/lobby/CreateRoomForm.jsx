import React from "react";

function CreateRoomForm({room, setRoom, handleClick}) {
    
  return (
    <div>
      <span className="text-black text-lg font-semibold">Room: </span>
      <input
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="w-full h-[50px] border-black border-[3px] rounded-md mb-4 px-2"
      />
      <button
        onClick={handleClick}
        className="w-full h-[50px] bg-white border-black border-[3px] rounded-md shadow-custom-black font-semibold"
      >
        Enter
      </button>
    </div>
  );
}

export default CreateRoomForm;
