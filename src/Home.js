import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthChoice from "./pages/AuthChoice";
import Signup from './pages/Signup';
import EmployeeDetailPage from './pages/EmployeeDetailPage';



function Home(){
  
    
    const role = localStorage.getItem("user_role");
    return (
      
        <Routes>
            
      <Route path="/" element={<AuthChoice />}/>
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard/manager"
        element={role ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/dashboard/employee"
        element={role ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/manager/team/:id"
        element={role ? <EmployeeDetailPage /> : <Navigate to="/" />}
      
      />
      
    </Routes>
    );
}

export default Home;