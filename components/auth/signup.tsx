"use client";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "../Alert";

const SignUpPage = () => {
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = userInfo;

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    setBusy(true);
    e.preventDefault();
    const res = await fetch("/api/auth/users", {
      method: "POST",
      body: JSON.stringify(userInfo),
    }).then((res) => res.json());
    console.log(res);
    if (res?.error) return setError(res.error);
    router.replace("/auth");
    setBusy(false);
  };

  return (
    <div className="text-black shadow-xl card w-96 bg-emerald-200">
      <div className="card-body">
        <h2 className="card-title">Sign Up</h2>
        {error ? (
          <div>
            <Alert value={error} />
          </div>
        ) : null}
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            onChange={handleChange}
            value={name}
            placeholder="Name"
            className="w-full max-w-xs mb-3 input input-bordered input-accent"
          />
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
            <button
              type="submit"
              className="btn btn-ghost bg-slate-400"
              disabled={busy}
              style={{ opacity: busy ? 0.5 : 1 }}
            >
              Register
            </button>
          </div>

          <div className="mt-12">
            Do you have account? please &nbsp;
            <button
              style={{ color: "blue" }}
              type="button"
              onClick={() => router.push("/auth")}
            >
              click
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
