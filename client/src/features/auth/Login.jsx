import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      const response = await login(email, password);
      if (response?.data?.token) {
        navigate('/dashboard');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background Accent Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/20 rounded-full blur-[10px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-700/10 rounded-full blur-[10px]" />

      <div className="w-full max-w-md z-10 relative">
        <div className="absolute -inset-6 bg-zinc-800/10 blur-3xl rounded-[2.5rem]" />
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-zinc-700/25 via-zinc-800/10 to-transparent shadow-[0_30px_90px_rgba(0,0,0,0.75)]">
          <div className="backdrop-blur-[2px] bg-gradient-to-br from-zinc-900/80 to-zinc-950/60 border border-zinc-700/20 p-8 rounded-3xl ring-1 ring-zinc-700/10 transition-all hover:border-zinc-600/30">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-zinc-800/20 rounded-2xl border border-zinc-700/30 text-zinc-400">
              <ShieldCheck size={32} strokeWidth={1.5} />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Welcome Back</h2>
          <p className="text-zinc-400 text-center mb-10 text-sm">Securely sign in to your Cogniflow account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group relative">
              <Mail className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-zinc-900/40 border border-zinc-800/50 rounded-xl py-3.5 px-12 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700/40 focus:border-zinc-600/50 transition-all placeholder:text-zinc-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="group relative">
              <Lock className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-zinc-900/40 border border-zinc-800/50 rounded-xl py-3.5 px-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700/40 focus:border-zinc-600/50 transition-all placeholder:text-zinc-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition-colors duration-300 ease-out hover:bg-[#020ca2] hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(2,12,162,0.35)] active:opacity-95"
            >
              <span>Sign In</span>
              <ArrowRight size={18} />
            </button>
            {errorMessage && (
              <p className="text-sm text-red-400 text-center pt-2">
                {errorMessage}
              </p>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-sm">
              New to Cogniflow?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Create account</Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;