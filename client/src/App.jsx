import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Signin from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/privateRoute";
import Admin from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminSignin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route element={<PrivateRoute />}> {/* Protect user routes */}
                  <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="/sign-in" element={<Signin />} />
                <Route path="/sign-up" element={<SignUp />} />
              </Routes>
            </>
          }
        />

        <Route path="/admin-login" element={<AdminLogin />} /> {/* Admin login route */}
        <Route > {/* Protect admin routes */}
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;