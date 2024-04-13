"use client";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

const SignInButton = () => {
  const { pending } = useFormStatus();

  useEffect(() => {
    if (pending) {
      toast.loading("Validating your credentials!");
    } else {
      toast.dismiss();
    }
  }, [pending]);

  return (
    <div className="text-center mt-6">
      <button
        className=" bg-blue-600 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
        type="submit"
      >
        {" "}
        Sign In{" "}
      </button>
    </div>
  );
};

export default SignInButton;
