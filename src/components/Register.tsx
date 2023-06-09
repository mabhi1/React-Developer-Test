import Button from "../ui/Button";
import { createUser } from "../firebase/firebaseFunctions";
import React, { useState } from "react";
import Input from "../ui/Input";
import { showToast } from "../utils/handleToast";
import Spinner from "../ui/Spinner";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
    document.getElementById("password")?.focus();
  };

  const handleRegister = async (e: React.SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
      name: { value: string };
      remember: { checked: boolean };
    };
    const name = target.name.value.trim();
    if (!name || name === "") {
      showToast("error", "Invalid Name");
      setLoading(false);
      return;
    }
    const email = target.email.value.trim();
    const password = target.password.value.trim();
    try {
      await createUser(email, password, name);
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
        <img src="/login-img.webp" width={420} height={494} alt="Login" className="w-auto h-auto" />
      </div>
      <div className="flex flex-col gap-3 md:w-1/2 lg:w-1/3 lg:p-8">
        <h1 className="text-lg">Register</h1>
        <form className="flex flex-col gap-3" autoComplete="off" onSubmit={handleRegister}>
          <div className="relative flex-1">
            <Input
              wide="full"
              onChange={(e) => handleChange(e, "nameLabel")}
              id="name"
              type="text"
              name="name"
              className="peer"
              autoComplete="false"
              autoFocus
              formNoValidate
            />
            <label
              id="nameLabel"
              htmlFor="name"
              className="absolute cursor-text text-slate-400 text-base left-[0.6rem] top-[0.6rem] peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:text-cyan-900 bg-slate-50 transition-all duration-200"
            >
              Name
            </label>
          </div>
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

          {loading ? (
            <Button variant="disabled">
              <Spinner size="sm" />
            </Button>
          ) : (
            <Button>Register</Button>
          )}
          <div className="flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-300 after:mt-0.5 after:flex-1 after:border-t after:border-slate-300">
            <p className="mx-4 mb-0 text-center">OR</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/login")} type="button">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};
export default Register;
