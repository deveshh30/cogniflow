import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Sparkles, Eye, EyeOff } from 'lucide-react';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      await login(formData.email, formData.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed.";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/10 rounded-full blur-[10px]" />
      
      <div className="w-full max-w-md z-10 relative">
        <div className="absolute -inset-6 bg-zinc-800/10 blur-3xl rounded-[2.5rem]" />
        <div className="relative rounded-[2rem] p-[1px] bg-gradient-to-br from-zinc-700/25 via-zinc-800/10 to-transparent shadow-[0_30px_90px_rgba(0,0,0,0.75)]">
          <div className="backdrop-blur-[2px] bg-gradient-to-br from-zinc-900/80 to-zinc-950/60 border border-zinc-700/20 p-8 rounded-[2rem] ring-1 ring-zinc-700/10 transition-all hover:border-zinc-600/30">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-zinc-800/20 rounded-full border border-zinc-700/30 text-zinc-400">
              <Sparkles size={28} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Create Account</h2>
          <p className="text-zinc-400 text-center mb-10 text-sm">Start your journey with Cogniflow</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-zinc-900/40 border border-zinc-800/50 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-zinc-600/50 transition-all placeholder:text-zinc-600"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-zinc-900/40 border border-zinc-800/50 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-zinc-600/50 transition-all placeholder:text-zinc-600"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                className="w-full bg-zinc-900/40 border border-zinc-800/50 rounded-xl py-4 px-6 pr-12 text-white focus:outline-none focus:border-zinc-600/50 transition-all placeholder:text-zinc-600"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 flex items-center justify-center space-x-2 transition-colors duration-300 ease-out hover:bg-[#020ca2] hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(2,12,162,0.35)] active:opacity-95"
            >
              <UserPlus size={18} />
              <span>Join Now</span>
            </button>
          </form>

          <p className="text-gray-500 mt-8 text-center text-sm">
            Already a member?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Log in</Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;