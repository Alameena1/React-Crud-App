import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSignin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    let token=localStorage.getItem("admin");
    console.log(token)
    if(token){
  navigate("/admin")
    }
  },[navigate])

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(""); 

    try {
      const res = await fetch("/backend/admin/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

   

      if (!res.ok) {
        console.log(res);
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to sign in");
      }
     
      const {token} = await res.json();
      localStorage.setItem("admin", token);
      
      
      navigate("/admin");
    } catch (err) {
      console.error("Sign-in error:", err.message);
      setError(err.message); 
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Admin Sign In</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="bg-stone-100 p-3 rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="bg-stone-100 p-3 rounded-lg"
          required
        />
        {error && <p className="text-red-500">{error}</p>} {/* Display error */}
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
