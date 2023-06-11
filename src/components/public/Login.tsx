import Button from "../../ui/Button";
import { passwordReset, rememberSignIn, signIn, socialSignIn } from "../../firebase/authFunctions";
import React, { useState } from "react";
import Input from "../../ui/Input";
import { showToast } from "../../utils/handleToast";
import Spinner from "../../ui/Spinner";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const emailInput = document.getElementById("email");
    if (!emailInput || !("value" in emailInput)) return;
    if (emailInput.value === "" || typeof emailInput.value !== "string") {
      showToast("error", "Enter email to reset");
      return;
    }
    try {
      const email = emailInput.value.trim();
      await passwordReset(email);
      showToast("success", "Check your inbox to reset");
    } catch (error: any) {
      showToast("error", error);
    }
    setLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
    document.getElementById("password")?.focus();
  };

  const handleLogin = async (e: React.SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
      remember: { checked: boolean };
    };
    const email = target.email.value.trim();
    const password = target.password.value.trim();
    const checked = target.remember.checked;
    try {
      if (checked) await rememberSignIn(email, password);
      else await signIn(email, password);
      navigate("/");
    } catch (error: any) {
      if (error === "Wrong Password") error = "User Not Found";
      showToast("error", error);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, labelName: string) => {
    const value = e.target.value;
    let label = document.getElementById(labelName);
    if (value.length > 0) {
      label?.classList.add("-translate-y-5", "text-sm", "text-cyan-900");
    } else {
      label?.classList.remove("-translate-y-5", "text-sm", "text-cyan-900");
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row items-center gap-5 justify-center">
      <div className="w-1/2 lg:w-1/4 justify-center flex">
        <img src="/register-img.png" width={420} height={494} alt="Login" className="w-auto h-auto" />
      </div>
      <div className="flex flex-col gap-3 md:w-1/2 lg:w-1/3 lg:p-8">
        <h1 className="text-lg">Login</h1>
        <form className="flex flex-col gap-3" autoComplete="off" onSubmit={handleLogin}>
          <div className="relative flex-1">
            <Input
              wide="full"
              onChange={(e) => handleChange(e, "emailLabel")}
              id="email"
              type="email"
              name="email"
              className="peer"
              autoComplete="false"
              formNoValidate
              autoFocus
            />
            <label
              id="emailLabel"
              htmlFor="email"
              className="absolute cursor-text text-slate-400 text-base left-[0.6rem] top-[0.6rem] peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:text-cyan-900 bg-slate-50 transition-all duration-200"
            >
              Email
            </label>
          </div>
          <div className="relative flex-1">
            <Input
              wide="full"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              onChange={(e) => handleChange(e, "passwordLabel")}
              className="peer"
              readOnly
              onFocus={(e) => e.target.removeAttribute("readonly")}
            />
            <label
              htmlFor="password"
              id="passwordLabel"
              className="absolute cursor-text text-slate-400 text-base left-[0.6rem] top-[0.6rem] peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:text-cyan-900 bg-slate-50 transition-all duration-200"
            >
              Password
            </label>
            {showPassword ? (
              <FiEyeOff
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                onClick={toggleShowPassword}
              />
            ) : (
              <FiEye
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                onClick={toggleShowPassword}
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className="flex gap-1 items-center">
              <Input type="checkbox" id="remember" name="remember" value="remember" className="hover:cursor-pointer" />
              <label htmlFor="remember" className="cursor-pointer">
                Remember Me
              </label>
            </span>
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <Button variant="link" onClick={handleReset} type="button">
                Forgot Password?
              </Button>
            )}
          </div>
          {loading ? (
            <Button variant="disabled">
              <Spinner size="sm" />
            </Button>
          ) : (
            <Button>Login</Button>
          )}
          <div className="flex items-center relative">
            <FcGoogle className="text-xl z-10 absolute left-3" />
            <Button
              type="button"
              className="p-2 pl-10 border-t-2 shadow rounded w-full transition-all duration-200 cursor-pointer hover:bg-slate-100 bg-white focus:bg-slate-100 text-slate-900"
              onClick={async () => {
                setLoading(true);
                await socialSignIn("google");
                setLoading(false);
                navigate("/");
              }}
            >
              Login with google
            </Button>
          </div>
          <div className="flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-300 after:mt-0.5 after:flex-1 after:border-t after:border-slate-300">
            <p className="mx-4 mb-0 text-center">OR</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/register")} type="button">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};
export default Login;
