import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import axios from "axios";
import {
  updateUserSuccess,
  updateUserStart,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut
} from "../redux/user/userSlice";

function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  console.log("currentUser",currentUser._id);
  

  
  const [formData, setFormData] = useState({
    id : currentUser._id,
    username: currentUser.username,
    email: currentUser.email,
    password: "",
  });
  const [profilePicture, setProfilePicture] = useState(currentUser.profilePicture);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);  

  
  const handleFileChange = (e) => {
    const formData = new FormData();
    formData.append("profilePicture", e.target.files[0]);

    axios
        .put("/backend/user/update-profile-picture", formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
        })
        .then((response) => {
            setProfilePicture(response.data.profilePictureUrl);
            setError(null);
        })
        .catch((error) => {
            console.error("Error updating profile picture:", error);
            setError("Failed to update profile picture. Please try again.");
        });
};


const handle = (e) => {
  const { id, value } = e.target;

  // Basic validation
  if (id === "username" && value.trim() === "") {
    setError("Username cannot be empty");
  } else if (id === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
    setError("Please enter a valid email");
  } else {
    setError(null); // Clear errors
  }

  setFormData({ ...formData, [id]: value });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);  
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/backend/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        setError("Failed to update user.");
        setIsSubmitting(false);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setIsSubmitting(false);
    } catch (error) {
      dispatch(updateUserFailure(error));
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/backend/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/backend/auth/signout");
      dispatch(signOut());
      navigate("/sign-in"); // Redirect user to sign-in page
    } catch (error) {
      console.log("Sign-out failed:", error);
    }
  };
  

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Profile picture upload */}
        <input
        type="file"
        ref={fileRef}
        name="profilePicture"
        id="profilePicture"
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />
      <img
        src={currentUser.profilePicture}
        alt="Profile"
        className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
        onClick={() => fileRef.current.click()}
      />

        {/* Username input */}
        <input
          value={formData.username}
          onChange={handle}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
        />

        {/* Email input */}
        <input
          value={formData.email}
          onChange={handle}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
        />

        {/* Password input */}
        <input
          value={formData.password}
          onChange={handle}
          type="password"
          id="password"
          placeholder="Password (optional)"
          className="bg-slate-100 rounded-lg p-3"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </form>

      {/* Delete account and sign out */}
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteAccount} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut}  className="text-red-700 cursor-pointer">Sign Out</span>
      </div>

      {/* Display error or success message */}
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && <p className="text-green-700 mt-5">User updated successfully!</p>}
    </div>
  );
}

export default Profile;
