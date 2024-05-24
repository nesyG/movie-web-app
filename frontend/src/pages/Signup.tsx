import { signup } from "@/api/auth";
import { BackgroundIllustrationBottom, BackgroundIllustrationTop } from "@/assets/illustrations";
import { SignupPayload } from "@/lib/types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";

export default function Signup() {
  const { saveUser } = useAuth();
  const [signupPayload, setSignupPayload] = useState<SignupPayload>({
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
      const res = await signup(signupPayload);
      saveUser(res.data);
      toast({
        variant: "default",
        title: "Success",
        description: res.message
      });
      navigate("/");
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message ?
        error.response.data.message : "There was a problem processing your request.";
      toast({
        variant: "destructive",
        title: "An error occured",
        description: errorMessage
      });
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignupPayload((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  }

  return (
    <div className="w-full h-full flex flex-row bg-[#18181a] text-white">
      <div className="w-1/2 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-60 translate-x-1/2">
          <BackgroundIllustrationTop />
        </div>
        <div className="absolute bottom-0 left-0 opacity-60 -translate-x-1/2">
          <BackgroundIllustrationBottom />
        </div>
        <div className="flex flex-col gap-4 h-full justify-center items-center px-10">
          <h1 className="font-semibold text-3xl text-center">
            Create a New Account
          </h1>
          <p className="text-base text-center font-light">
            Welcome Back! Login wtih your credentials to access all features of CMDb.
          </p>
          <div className="flex justify-center items-center gap-4">
            <p className="text-base font-light">Already have an account?</p>
            <Link
              to="/login"
              className="z-50 bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white w-fit px-4 py-1 rounded-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <div className="w-1/2 flex flex-col items-center">
        <div className="w-full flex justify-start p-2 border-b border-[#3abab4]">
          <h1 className="text-3xl font-bold">
            C<span className="text-[#3abab4]">M</span>Db
          </h1>
        </div>
        <div className="flex flex-col justify-between mb-[5%] mt-[10%] w-full h-full">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-3xl font-semibold w-full text-center">
              Sign Up
            </h1>
            <form onSubmit={handleSignup} className="flex flex-col gap-4 w-1/3">
              <div className="flex flex-col gap-2">
                <label className="font-light" htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  placeholder="Abdullah"
                  required={true}
                  id="firstName"
                  name="firstName"
                  value={signupPayload.firstName}
                  onChange={handleInputChange}
                  className="bg-white/5 font-light text-sm py-2 px-3 rounded-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-light" htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  placeholder="Umer"
                  required={true}
                  id="lastName"
                  name="lastName"
                  value={signupPayload.lastName}
                  onChange={handleInputChange}
                  className="bg-white/5 font-light text-sm py-2 px-3 rounded-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-light" htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="username@email.com"
                  required={true}
                  id="email"
                  name="email"
                  value={signupPayload.email}
                  onChange={handleInputChange}
                  className="bg-white/5 font-light text-sm py-2 px-3 rounded-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-light" htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="********"
                  required={true}
                  id="password"
                  name="password"
                  value={signupPayload.password}
                  onChange={handleInputChange}
                  className="bg-white/5 font-light text-sm py-2 px-3 rounded-sm"
                />
              </div>
              <button
                type="submit"
                className="mt-2 text-center place-self-end w-full text-sm bg-[#3abab4] border border-[#3abab4]/50 shadow-[#3abab4]/15 shadow-lg hover:bg-[#3abab4]/75 hover:shadow-black/5 active:bg-[#3abab4]/50 active:shadow-black active:shadow-inner active:border-black/25 text-white px-4 py-2 rounded-sm"
              >
                Create Account
              </button>
            </form>
          </div>
          <div className="flex flex-row gap-2   justify-center">
            <h3>
              Don't want to use an account?
            </h3>
            <Link
              to={"/"}
              className="text-[#3abab4]"
            >
              Browse anyway
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};