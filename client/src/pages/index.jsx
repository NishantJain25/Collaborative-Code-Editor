import Main from "@/components/Main";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { onAuthStateChangeListener } from "@/utils/FirebaseConfig";
import { useRouter } from "next/router";
import React, { useEffect } from "react";


function index() {
    console.log("Inside Index")
    return <Main />
}

export default index