import Link from "next/link";
import React, { useState } from "react";
import { createUser } from "@/utils/FirebaseConfig";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
function SignUp() {
  const [error, setError] = useState(null)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [{}, dispatch] = useStateProvider();
  const router = useRouter();


const handleSignUp = async () => {
  try{
    const user = await createUser(email, password, username)
    // console.log(user)  
    dispatch({ type: reducerCases.SET_USER_INFO, payload: user });
    router.push('/lobby')
  }catch(error){
    setError(error.message)
    setTimeout(() => setError(null),3000)
  }
}


    return <div className="w-full h-[100vh] flex flex-col justify-center items-center">
    <p className="text-[40px] font-bold mb-6">
      Sign Up to start Collaborating!
    </p>
    <div className="flex flex-col w-[30%] p-4">
      <span className="text-lg font-semibold font-[montserrat]]">Username</span>
      <input
        className="w-full h-[50px] border-black border-[3px] rounded-md mb-4 px-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <span className="text-lg font-semibold font-[montserrat]]">Email</span>
      <input
        className="w-full h-[50px] border-black border-[3px] rounded-md mb-4 px-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <span className="text-lg font-semibold font-[montserrat]]">
        Password
      </span>
      <input
        className="w-full h-[50px] border-black border-[3px] rounded-md mb-4 px-2"
        type="password"
         value={password} 
         onChange={(e) => setPassword(e.target.value)} 
      />

      {error && <p className="text-red-500">{error}</p>}
      <div className="flex gap-4 my-4">
        <button
          className="w-full h-[50px] border-black border-[3px] rounded-md shadow-custom-black font-semibold"
          onClick={handleSignUp} 
        >
          Sign Up
        </button>
       {/*  <button
          className="w-full h-[50px] border-black border-[3px] rounded-md shadow-custom-black flex justify-center items-center font-semibold"
          onClick={googleSignIn}
        >
          <FcGoogle className="mr-2 text-lg" /> Sign in with Google
        </button> */}
      </div>
      <p>Already have an account? <Link href="/login" className="font-semibold font-underline hover:font-bold">Login</Link></p>
    </div>
  </div>
}

export default SignUp