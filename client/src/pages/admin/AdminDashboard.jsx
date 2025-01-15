import { useState, useEffect } from "react";
import { FaUserEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" }); // Added password
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/backend/admin/users", {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    let token = localStorage.getItem("admin");
    console.log(token);
    if (!token) {
      navigate("/admin-login");
    }

    fetchUsers();
  }, []);

  const addUser = async () => {
    if (newUser.name && newUser.email && newUser.password) {
      try {
        const response = await axios.post("/backend/admin/addUser", newUser, {
          withCredentials: true,
        });

        setUsers([...users, response.data.user]);

        setNewUser({ name: "", email: "", password: "" });
        setIsModalOpen(false);
      } catch (err) {
        console.error("Failed to add user:", err.message);
        setError("Failed to add user.");
      }
    } else {
      alert("Please enter name, email, and password");
    }
  };

  const editUser = (user) => {
    setEditingUser(user); // Set the user being edited
    setNewUser({ name: user.username, email: user.email, password: "" }); // Pre-fill form (leave password blank)
    setIsModalOpen(true); // Open modal
  };

  // Save the edited user via the API
  const saveUser = async () => {
    try {
      // Prepare updated user data
      const updatedData = { ...newUser };
      if (!newUser.password) delete updatedData.password; // Don't send password if it's blank

      const response = await axios.put(
        `/backend/admin/users/${editingUser._id}`, // Use user ID for update
        updatedData
      );

      // Update user in the state
      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? { ...user, ...updatedData } : user
        )
      );

      // Reset modal and state
      setEditingUser(null);
      setNewUser({ name: "", email: "", password: "" });
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (!isConfirmed) return;

      const response = await axios.delete(`/backend/admin/delete/${userId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUsers(users.filter((user) => user._id !== userId)); // Use _id instead of id
        alert("User deleted successfully.");
      }
    } catch (err) {
      console.log("Error deleting user:", err.message);
      setError("Failed to delete user.");
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/backend/admin/signout');
      localStorage.removeItem("admin"); // Clear token from localStorage
      navigate("/admin-login"); // Redirect to login page
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <main className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      <h2 className="text-xl mb-6">User Management</h2>

      {/* Error message */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Loading spinner */}
      {loading && <p>Loading users...</p>}

      {/* Display users */}
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul className="w-full max-w-2xl space-y-4">
          {users.map((user, index) => (
            <li
              key={user._id || index}
              className="p-4 bg-white rounded-lg shadow-md border border-gray-300 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-medium">{user.username}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => editUser(user)}
                  className="p-2 bg-blue-500 text-white rounded-md"
                >
                  <FaUserEdit />
                </button>
                <button
                  onClick={() => deleteUser(user._id)} // Trigger delete on click
                  className="p-2 bg-red-500 text-white rounded-md"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
          <div className="flex justify-between mt-5">
            <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
          </div>
      {/* Add User Button */}
      <button
        onClick={() => setIsModalOpen(true)} // Open the modal when clicked
        className="px-4 py-2 bg-green-500 text-white rounded-md mt-6"
      >
        Add New User
      </button>

      {/* Modal for Add User */}
      {/* Modal for Add/Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-xl mb-4 font-semibold">
              {editingUser ? "Edit User" : "Add New User"}
            </h3>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter username"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="p-3 mt-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="p-3 mt-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password{" "}
                {editingUser ? "(Leave blank to keep current password)" : ""}
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="p-3 mt-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={editingUser ? saveUser : addUser} // Dynamic save or add
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                {editingUser ? "Save Changes" : "Add User"}
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false); // Close modal
                  setEditingUser(null); // Reset editing mode
                  setNewUser({ name: "", email: "", password: "" }); // Clear form
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
         
        </div>
      )}
    </main>
  );
}
