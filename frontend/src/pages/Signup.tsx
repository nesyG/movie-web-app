import { signup } from "@/api/auth";
import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";
import { SignupData } from "@/lib/types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";

export default function Signup() {
  const { saveUser } = useAuth();
  const [signupData, setSignupData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await signup(signupData);
      console.log(res);
      saveUser(res.data);
      toast({
        variant: "default",
        title: "Success",
        description: res.message
      });
      navigate("/");
    } catch (error: any) {
      console.error(error);
      console.log(error.response.data);

      const errorMessage = error.response?.data ?
        error.response.data.message : "There was a problem processing your request.";

      toast({
        variant: "destructive",
        title: "An error occured",
        description: errorMessage
      });
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  return (
    <div className="w-screen h-screen flex flex-row bg-[#18181a]">
      <div className="w-1/2 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="absolute bottom-0 left-0 opacity-60 -translate-x-1/2">
          <BackgroundIllustrationBottom />
        </div>
        <div className="flex flex-col gap-4 h-full justify-center items-center px-10">
          <h1 className="text-white font-semibold text-4xl text-center">
            Create a New Account
          </h1>
          <p className="text-white text-lg text-center font-light">
            Welcome Back! Login wtih your credentials to access all features of CMDb.
          </p>
          <div className="flex justify-center items-center gap-4">
            <p className="text-white text-lg font-light">Have an account?</p>
            <Link
              to="/login"
              className="z-50 bg-white w-fit px-4 py-1 rounded-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <div className="w-1/2 flex flex-col items-center">
        <h1 className="text-white text-3xl font-semibold">Sign Up</h1>
        <form onSubmit={handleSignup} className="flex flex-col">
          <div className="flex flex-col">
            <label className="text-white font-light">First Name</label>
            <input
              type="text"
              placeholder="Abdullah"
              required={true}
              className="px-2 py-1"
              id="firstName"
              name="firstName"
              value={signupData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white font-light">Last Name</label>
            <input
              type="text"
              placeholder="Umer"
              required={true}
              className="px-2 py-1"
              id="lastName"
              name="lastName"
              value={signupData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white font-light">Email</label>
            <input
              type="email"
              placeholder="username@email.com"
              required={true}
              className="px-2 py-1"
              id="email"
              name="email"
              value={signupData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white font-light">Password</label>
            <input
              type="password"
              placeholder="********"
              required={true}
              className="px-2 py-1"
              id="password"
              name="password"
              value={signupData.password}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="bg-white w-fit px-4 py-1 rounded-sm"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};