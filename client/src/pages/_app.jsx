import Head from "next/head"
import "../styles/global.css"
import { StateProvider } from "@/context/StateContext"
import reducer, { initialState } from "@/context/StateReducers"
import { SocketContext, socket } from "@/context/SocketContext"


export default function App({Component, pageProps}) {
    return (
        <SocketContext.Provider value={socket}>
        <StateProvider initialState={initialState} reducer={reducer}>
            <Head>
                <title>Collabinator</title>
                <link rel="shortcut icon" href="./whatsapp.png"/>
            </Head>
            <Component {...pageProps} />
        </StateProvider>
        </SocketContext.Provider>
    )
    
}