"use client";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Alert from "../Alert";

const LoginPage = () => {
  const router = useRouter();

  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userInfo;
  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    //handle form logic
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      // Redirect to the desired page on successful login
      setError("");
      window.location.reload();
      router.push("/cashier");
    }
  };

  return (
    <div className="text-black shadow-xl card w-96 bg-emerald-200">
      <div className="card-body">
        <h2 className="card-title">Login</h2>
        {error ? (
          <div>
            <Alert value={error} />
          </div>
        ) : null}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={email}
            placeholder="Username / email"
            className="w-full max-w-xs input input-bordered input-accent"
          />

          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={password}
            placeholder="Password"
            className="w-full max-w-xs mt-3 input input-bordered input-accent"
          />

          <div className="justify-end mt-4 card-actions">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>

          <div className="mt-12">
            Did you want to register? please &nbsp;
            <button
              style={{ color: "blue" }}
              type="button"
              onClick={() => router.push("/auth/signup")}
            >
              click
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
