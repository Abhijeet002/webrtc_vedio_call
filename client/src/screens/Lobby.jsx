import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";

function LobbyScreen() {
  const [Email, setEmail] = useState("");
  const [Room, setRoom] = useState("");

  const socket = useSocket()
  const navigate = useNavigate()
  console.log(socket)

  const handleSubmit = useCallback((e)=>{
    e.preventDefault();
    if (!socket || !socket.connected) {
      console.error("Socket is not connected. Cannot join room.");
      return;
    }
    socket.emit('room:join',{Email,Room})
    console.log({Email,Room})
  },[Email, Room, socket])

  const handleJoinRoom = useCallback((data)=>{
    console.log("Received room join event:", data); // Debugging log
    // const {Email,Room} = data; 
    navigate(`/room/${Room}`)
    console.log(`Email:${Email}, Room:${Room}`)
  },[navigate,Email,Room])
  
  useEffect(()=>{
    if (!socket || !socket.connected) return;
    socket.off("room:join", handleJoinRoom)
    socket.on("room:join", handleJoinRoom);
    return()=>{
      socket.off("room:join", handleJoinRoom);
    }
  },[socket,handleJoinRoom]);

  return (
    <div className="flex flex-row flex-wrap bg-slate-900 items-center text-slate-50 ">
      <div className="flex flex-wrap justify-center items-center flex-col bg-slate-950 h-screen w-2/5 p-5  ">
        <div className="m-5">
          <h1 className="text-3xl ">Hello</h1>
        </div>

        <div className="flex flex-wrap justify-center items-center w-full m-5">
          <form onSubmit={handleSubmit}  className="w-4/5">
            <label className="text-xl pt-5 block w-full  " htmlFor="email">
              Email :
            </label>
            <input
              id="email"
              type="email"
              autoComplete="off"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="border block w-full rounded-md h-10 bg-gray-300 text-slate-950 p-5 tracking-wide"
            />
            <label className="text-xl pt-5 block w-full " htmlFor="room">
              Room :
            </label>
            <input
              id="room"
              type="text"
              autoComplete="off"
              value={Room}
              onChange={(e) => setRoom(e.target.value)}
              className="border block w-full rounded-md h-10 bg-gray-300 text-slate-950 p-5 tracking-wide"
            />
            <br />
            <button className="cursor-pointer bg-green-700 p-2 tracking-widest px-5 rounded-md">
              Join
            </button>
          </form> 
        </div>
      </div>
      <div className="flex flex-wrap justify-center bg-slate-900 items-center p-10 h-screen w-3/5 border-zinc-200">
        <h1 className="flex items-center text-4xl font-extralight justify-center leading-tight -tracking-tight">
          Enter your room code, and <br></br>enjoy chatting
        </h1>
      </div>
    </div>
  );
}

export default LobbyScreen;
