import React, { useEffect } from "react";
import AccountsCircle from "./AccountCircle";
import { useRouter } from "next/router";
import { socket } from "@/context/SocketContext";
import { useStateProvider } from "@/context/StateContext";

function AccountsBar() {
  const router = useRouter()
  const [{users}] = useStateProvider()
  useEffect(() => {
    console.log(users)
  },[users])
  const colors = ["pastel-blue", "pastel-green"];
  const leaveRoom = () => {
    socket.emit("leave-room")
    router.replace('/lobby')
  }
  
  return (
    <div className="flex gap-5">
      <div className="flex">
        {users.map((user, index) => (
          <AccountsCircle name={user.name} color={colors[index]} key={index} />
        ))}
      </div>
      <button className="px-4 py-2 border-black border-[3px] rounded-md shadow-custom-black" onClick = {leaveRoom}>
        Leave Room
      </button>
    </div>
  );
}

export default AccountsBar;
