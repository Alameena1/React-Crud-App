import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (/\s/.test(formData.username)) {
      newErrors.username = "Username cannot contain spaces";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Validate form data
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({}); // Clear previous errors

    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/backend/auth/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }

      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-stone-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        {errors.username && <p className="text-red-600">{errors.username}</p>}

        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-stone-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-600">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-stone-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-600">{errors.password}</p>}

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5 ">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
    </div>
  );
}

export default SignUp;
