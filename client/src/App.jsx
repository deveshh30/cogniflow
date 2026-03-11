import React, { useContext } from 'react'; // Added useContext
import { AuthProvider, AuthContext } from './context/AuthContext'; // Import AuthContext
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
import Dashboard from './features/dashboard/ui/Dashboard';
import CompletedGoals from './features/dashboard/ui/CompletedGoal';
import Profile from './features/dashboard/ui/Profile';

function AppContent() {
  // 1. Pull the user from your AuthContext
  const { user } = useContext(AuthContext);

  // 2. IMPORTANT: If 'goals' is managed inside Dashboard.jsx, 
  // you might need to move the goals state here to App.js 
  // OR fetch them again inside Profile.jsx.
  // For now, we use a fallback to prevent the crash.
  const goals = []; 

  return (
    <Router basename="/">
      <main className="min-h-screen bg-[#050505]">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/archive" element={<CompletedGoals />} />
          <Route path="/profile" element={
            <Profile 
              goals={goals} // Pass the goals array
              user={user}   // Pass the user object from context
            />
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;