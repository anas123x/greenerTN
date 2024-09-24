import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import LandingPage from "./LandingPage";
import Dashboard from "./dashboard/Dashboard";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/Dashboard" element={<Dashboard />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
