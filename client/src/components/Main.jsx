import React, { useContext, useEffect, useRef, useState } from "react";
import LanguagesDropdown from "./LanguagesDropdown";
import CodeEditorWindow from "./CodeEditorWindow";
import ThemesDropdown from "./ThemesDropdown";
import { defineTheme } from "@/lib/defineTheme";
import axios from "axios";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import { languageOptions } from "@/constants/languageOptions";
import Lobby from "../pages/lobby";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import reducer from "@/context/StateReducers";
import { SocketContext } from "@/context/SocketContext";

function Main() {
  const editorRef = useRef(null);
  const defaultLanguage = "Javascript";
  const [language, setLanguage] = useState(languageOptions[0]);
  const [code, setCode] = useState("");
  const [theme, setTheme] = useState({ value: "oceanic-next", label: "Oceanic Next" });
  const [processing, setProcessing] = useState(false);
  const [outputDetails, setOutputDetails] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [currentRoom, setCurrentRoom] = useState(false);
  const router = useRouter();
  const [{ room, userInfo, users }, dispatch] = useStateProvider();
  const socket = useContext(SocketContext)

  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  useEffect(() => {
    console.log("inside use effect at line 39 in Main: ",code);
    if (socket) {
      socket.on("new-user", (data) => {
        dispatch({ type: reducerCases.SET_USERS, payload: data.users });
        console.log("reached update-state");
        const updateData = {
          code: code,
          customInput: customInput,
          outputDetails: outputDetails,
          processing: processing,
          theme: theme,
          language: language,
        };
        socket.emit("update-state", updateData);
        console.log("users: ", users);
      });

      socket.on("initial-update", ({ data }) => {
        console.log("received updates on joining.");
        console.log(data);

        setCode(data.code);
        setCustomInput(data.customInput);
        setOutputDetails(data.outputDetails);
        setProcessing(data.processing);
        setTheme(data.theme);
        setLanguage(data.language);
      });

      socket.on("editor-changed", (data) => {
        console.log(data)
        setCode(data.data)
      })
      socket.on("custom-input-changed", (data) => {
        console.log(data)
        setCustomInput(data.data)
      })
      socket.on("compile", () => {
        handleCompile()
      })
      socket.on("theme-change", ({data}) => {
        console.log(data)
        setTheme(data)
      })
      socket.on("language-change", ({data}) => {
        console.log(data)
        setLanguage(data)
      })
    }

    return () => {
      socket.off("new-user", (data) => {
        dispatch({ type: reducerCases.SET_USERS, payload: data.users });
        console.log("reached update-state");
        const updateData = {
          code: code,
          customInput: customInput,
          outputDetails: outputDetails,
          processing: processing,
          theme: theme,
          language: language,
        };
        socket.emit("update-state", updateData);
        console.log("users: ", users);
      })
      socket.off("initial-update", ({ data }) => {
        console.log("received updates on joining.");
        console.log(data);

        setCode(data.code);
        setCustomInput(data.customInput);
        setOutputDetails(data.outputDetails);
        setProcessing(data.processing);
        setTheme(data.theme);
        setLanguage(data.language);
      })
    }
  }, [socket]);

  useEffect(() => {
    console.log("Socket update : ", code)
  },[socket])

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        console.log(code);
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const onLanguageChange = (language) => {
    setLanguage(language);
  };

  const onThemeChange = (theme) => {
    setTheme(theme);
    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  };

  const handleCompile = () => {
    socket.emit("compile")
    setProcessing(true);
    const formData = {
      language_id: language.id,
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.NEXT_PUBLIC_RAPID_API_URL,
      params: { base64_encoded: true, fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then((response) => {
        console.log({ data: response.data });
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        setProcessing(false);
        console.log(error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.NEXT_PUBLIC_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;
      if (statusId === 1 || statusId === 2) {
        //still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        //showSuccessToast(`Compiled Successfully!`)
        console.log("response.data: ", response.data);
        return;
      }
    } catch (error) {
      console.log(error);
      setProcessing(false);
      //showErrorToast
    }
  };

  useEffect(() => {
    if (!room) {
      router.push("/lobby");
    }
    setCurrentRoom(room);
  }, [room]);
  return (
    <div>
      <div className="action-bar p-4 flex gap-5">
        <LanguagesDropdown
          onLanguageChange={onLanguageChange}
          selectedLanguage={language}
        />
        <ThemesDropdown onThemeChange={onThemeChange} selectedTheme={theme} />
        {users.map((name, index) => (
          <p key={index}>{name}</p>
        ))}
      </div>
      <section className="grid grid-cols-main h-full m-4">
        <CodeEditorWindow
          language={language}
          theme={theme}
          code={code}
          onChange={onChange}
        />
        <div className="flex flex-col flex-shrink-0 justify-start items-center w-full px-4 gap-2">
          <OutputWindow outputDetails={outputDetails} />
          <div className="w-full flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />

            <button
              onClick={handleCompile}
              disabled={!code}
              className="px-4 py-2 border-black border-[3px] rounded-md mt-4 shadow-custom-black"
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </section>
    </div>
  );
}

export default Main;
