import CreateRoomForm from "@/components/lobby/CreateRoomForm";
import { SocketContext } from "@/context/SocketContext";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef, useContext } from "react";

function Lobby() {
  const [room, setRoom] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const socket = useContext(SocketContext);
  const [{ userInfo }, dispatch] = useStateProvider();

  useEffect(() => {
    console.log(userInfo);
    if (!socket || !userInfo) {
      console.log("pushing from lobby to login");
      router.push("/login");
    }
  }, [userInfo]);

  const handleClick = (e) => {
    if (index == 0) {
      const data = {
        type: "create",
        params: {
          code: room,
          userName: userInfo.displayName,
        },
      };
      socket.emit("room-message", data);
    } else if (index == 1) {
      const data = {
        type: "join",
        params: {
          code: room,
          userName: userInfo.displayName,
        },
      };
      socket.emit("room-message", data);
    }
    setLoading(true);
    socket.on("room-joined", (data) => {
      dispatch({ type: reducerCases.SET_ROOM, payload: data.room });
      dispatch({ type: reducerCases.SET_USERS, payload: data.users });
      setLoading(false);
      console.log("pushing to main");
      console.log(data.users);
      router.push("/");
    });
    socket.on("room-error", (data) => {
      alert(data.error);
      setLoading(false);
    });
  };

  return (
    <div className="h-[100vh] w-full flex flex-col justify-center items-center">
      <div className="w-[30%] bg-slate-200 rounded-xl">
        <div className="w-full relative flex items-center justify-center">
          <div
            className={`slider absolute top-0 left-0 bg-slate-400 w-[50%] h-[50px] rounded-t-xl z-0 translate-x-[${
              index * 100
            }%] transition-all duration-300 before:absolute before:h-[10px] before:block before:w-[20px] before:bg-transparent before:rounded-bl-[10px] before:shadow-slider-shadow ${
              index == 0 ? "before:right-[-20px]" : "before:left-[-20px]"
            } before:scale-x-[${index * -1}] before:bottom-0`}
          ></div>
          <div
            className={`w-[50%] h-[50px] ${
              index == 0 && "font-semibold"
            } rounded-t-xl flex justify-center items-center bg-transparent z-10`}
            onClick={() => setIndex((prev) => 0)}
          >
            <p className={`p-0 text-${index == 0 ? "white" : "slate-400"}`}>
              Create New Room
            </p>
          </div>
          <div
            className={`w-[50%] h-[50px] ${
              index == 1 && "font-semibold"
            } rounded-t-xl flex justify-center items-center z-10`}
            onClick={() => setIndex((prev) => 1)}
          >
            <p className={`p-0 text-${index == 1 ? "white" : "slate-400"}`}>
              Join Room
            </p>
          </div>
        </div>
        <div className="w-full px-8 py-10 rounded-b-xl bg-slate-400">
          <CreateRoomForm
            room={room}
            setRoom={setRoom}
            handleClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
}

export default Lobby;
