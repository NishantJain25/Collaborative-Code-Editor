import Link from "next/link";
import React from "react";

function SignUp() {
    return <div className="w-full h-[100vh] flex flex-col justify-center items-center">
    <p className="text-[40px] font-bold mb-6">
      Sign Up to start Collaborating!
    </p>
    <div className="flex flex-col w-[30%] p-4">
      <span className="text-lg font-semibold font-[montserrat]]">Email</span>
      <input
        className="w-full h-[50px] border-black border-[3px] rounded-md mb-4 px-2"
        /* value={email} */
        /* onChange={(e) => setEmail(e.target.value)} */
      />
      <span className="text-lg font-semibold font-[montserrat]]">
        Password
      </span>
      <input
        className="w-full h-[50px] border-black border-[3px] rounded-md mb-4 px-2"
        type="password"
        /* value={password} */
        /* onChange={(e) => setPassword(e.target.value)} */
      />

  {/* {error && <p className="text-red-500">{error}</p>} */}
      <div className="flex gap-4 my-4">
        <button
          className="w-full h-[50px] border-black border-[3px] rounded-md shadow-custom-black font-semibold"
          /* onClick={handleLogIn} */
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