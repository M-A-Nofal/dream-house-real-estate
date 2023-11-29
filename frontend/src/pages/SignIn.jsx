import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/slices/user-slice";
import OAuth from "../components/OAuth";
import { Toast } from "../utils/toast";
import { customSwal } from "../utils/customSwal";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.data === null) {
        setLoading(false);
        customSwal({
          icon: "error",
          title: "Error",
          text: `An error occurred: ${data.message}`,
        });
        return;
      }

      dispatch(signInSuccess(data));
      setLoading(false);
      Toast.fire({
        icon: "success",
        title: "You have successfully signed in!",
      });

      navigate("/");
    } catch (error) {
      setLoading(false);
      customSwal({
        icon: "error",
        title: "Error",
        text: `An error occurred: ${error.message}`,
      });
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
