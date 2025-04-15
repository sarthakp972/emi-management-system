import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DailyCollectionTable from './Components/DailyCollectionTable';
// import Create from './Firebase/Create';
// import EmiCommissionTracker from './Components/EmiCommissionTracker';
import EmiHistory from './Components/EmiHistory';
import Navbar from './Components/Navbar';
import AddEmiPayments from './Components/AddEmiPayments';
import NewCustomerCreate from './Admin/NewCustomerCreate';
import Login from './FirebaseAuth/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminOnly from './Admin/AdminOnly';
import ProtectedRoute from './Components/ProtectedRoute';
// import { AuthContext } from './Context/AuthContext';
import UpdateUserDetails from './Components/UpdateUserDetails';


function App() {
    return (
        <Router>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                <Route path="/" element={<DailyCollectionTable />} />
                <Route path="/emi-history" element={<EmiHistory />} />
                <Route path="/add-emi/:customerId" element={<AddEmiPayments />} />
                <Route path="/login" element={<Login />} />
                {/* Protecting the Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute element={<AdminOnly />} />} />
               <Route path="/user-update/:userId" element={<ProtectedRoute element={<UpdateUserDetails />} />} />

             
                <Route path="/add-new" element={<ProtectedRoute element={<NewCustomerCreate />} />} />
            </Routes>
        </Router>
    );
}

export default App;
