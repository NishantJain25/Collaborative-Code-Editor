import Main from "@/components/Main";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { onAuthStateChangeListener } from "@/utils/FirebaseConfig";
import { useRouter } from "next/router";
import React, { useEffect } from "react";


function index() {
    const router = useRouter()
    const [{room},dispatch] = useStateProvider()
    useEffect(() => {
		const unsubscribe = onAuthStateChangeListener((user) => {
			if(!user){
                router.push('/login')
            }else if(!room){
                dispatch({type: reducerCases.SET_USER_INFO, payload: user})
                router.push('/lobby')
            }else{
                router.push('/')
            }
		})
		return unsubscribe
	}, [])
    return <Main />
}

export default index