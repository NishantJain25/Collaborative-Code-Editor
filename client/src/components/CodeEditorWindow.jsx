import { socket } from "@/context/SocketContext";
import { Editor } from "@monaco-editor/react";
import React, { useEffect, useState } from "react";

function CodeEditorWindow({ language, onChange, theme, code }) {
  
  useEffect(()=>{
    console.log("code changed")
  },[code])
  const handleEditorChange = (data) => {
    socket.emit("editor-change", {data})
    onChange("code", data);
  };
  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height={"85vh"}
        language={language || "javascript"}
        value={code}
        theme={theme.value}
        defaultValue="//Start writing code"
        onChange={handleEditorChange}
      />
    </div>
  );
}

export default CodeEditorWindow;
