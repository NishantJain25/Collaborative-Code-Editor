import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { auth, provider, signIn } from "@/utils/FirebaseConfig";
import { signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [{userInfo}, dispatch] = useStateProvider();
  const router = useRouter();

  useEffect(() => {
    if(userInfo){
      router.push('/lobby')
    }
  },[userInfo])
  const handleLogIn = async () => {
    try {
      const { user } = await signIn(email, password);
      console.log(user);
      dispatch({ type: reducerCases.SET_USER_INFO, payload: user });
      

    } catch (error) {
        console.log(error)
      showError(error);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const googleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Google user : ", user);
        dispatch({ type: reducerCases.SET_USER_INFO, payload: user });
        router.push("/lobby");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const showError = (error) => {
    console.log(error.code)
    switch(error.code){
        case "auth/wrong-password":
            setError("Wrong password")
            break
        case "auth/user-not-found":
            setError("User was not found. Try creating a new account")
            break
    }
  }
  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center">
      <p className="text-[40px] font-bold mb-6">
        Login to start Collaborating!
      </p>
      <div className="flex flex-col w-[30%] p-4">
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
            onClick={handleLogIn}
          >
            Log In
          </button>
          <button
            className="w-full h-[50px] border-black border-[3px] rounded-md shadow-custom-black flex justify-center items-center font-semibold"
            onClick={googleSignIn}
          >
            <FcGoogle className="mr-2 text-lg" /> Sign in with Google
          </button>
        </div>
        <p>Don&apos;t have an account? <Link href="/signup" className="font-semibold font-underline hover:font-bold">Sign up</Link></p>
      </div>
    </div>
  );
}

export default Login;
