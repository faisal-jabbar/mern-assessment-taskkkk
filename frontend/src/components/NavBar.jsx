import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const navigate = useNavigate();
  const auth = useAuth(); // ✅ safely get auth context

  if (!auth) return null; // 🔒 avoid crash if context isn't ready

  const { logout } = auth; // ✅ extract logout from context

  const handleLogout = () => {
    logout();       // clears token + updates auth state
    navigate('/');  // go back to login
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Task Manager</h1>
      <div className="space-x-4">
        <Link to="/tasks" className="hover:underline">
          Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
