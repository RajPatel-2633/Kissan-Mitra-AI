import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail,
  Phone,
  Lock,
  Eye, 
  EyeOff, 
  ArrowRight,
  Loader2,
  Leaf
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false); // Default to Sign Up to match mockup
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, signup, isLoading, error, clearError } = useAuthStore();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });

  // Clear errors when toggling mode
  useEffect(() => {
    clearError();
    setFormData({
      name: '',
      email: '',
      mobile: '',
      password: ''
    });
  }, [isLogin, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login({ email: formData.email, password: formData.password });
    } else {
      await signup({ name: formData.name, email: formData.email, password: formData.password });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e6f4ea] font-sans selection:bg-[#2b9365] selection:text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-no-repeat"
        style={{ backgroundImage: "url('/assets/final_bg_v2.jpg')", backgroundSize: '100% 100%' }}
      />
      
      <div className="relative z-10 w-full h-full flex flex-col justify-start py-6 px-4 lg:py-12 lg:px-8 lg:pl-16 xl:pl-24">
        
        {/* TOP SECTION: Headers */}
        <div className="max-w-2xl mt-0">
          <div className="flex items-center gap-2 mb-2">
            {/* Custom Logo Icon */}
            <div className="bg-white rounded-full p-1.5 shadow-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-[#2b9365]">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
                <path d="M12 18V12M12 12L8 8M12 12L16 8M12 12L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Decorative leaves */}
                <path d="M7 14C8.10457 14 9 13.1046 9 12C9 10.8954 8.10457 10 7 10C5.89543 10 5 10.8954 5 12C5 13.1046 5.89543 14 7 14Z" fill="#a3d9a5"/>
                <path d="M17 14C18.1046 14 19 13.1046 19 12C19 10.8954 18.1046 10 17 10C15.8954 10 15 10.8954 15 12C15 13.1046 15.8954 14 17 14Z" fill="#a3d9a5"/>
              </svg>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#113a26] tracking-tight">
              Kissan-Mitra-AI
            </h1>
          </div>
          
          <div className="flex items-center gap-2 mb-1.5 text-[#2b9365] font-semibold text-base ml-2">
            <span>🌿</span>
            <span>AI Saathi. Kisan ki Tarakki.</span>
            <span>🌿</span>
          </div>
        </div>

        {/* MIDDLE SECTION: Auth Card */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px] ml-12 lg:ml-24 mt-4 mb-8">
          <div className="bg-white rounded-[1.25rem] px-8 pt-12 pb-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] min-h-[460px] flex flex-col justify-between">
            <div className="text-center">
              <h3 className="text-2xl lg:text-[1.75rem] font-bold text-[#1a1a1a] mb-1">
                {isLogin ? "Welcome Back" : "Create Your Account"}
              </h3>
              <p className="text-gray-500 text-xs">
                {isLogin ? "Log in to continue your journey 🌿" : "Sign up and start your smart farming journey 🌿"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100 text-center">
                {error}
              </div>
            )}

            <form className={`w-full transition-all duration-300 ${isLogin ? 'mt-12 mb-auto space-y-6' : 'my-auto space-y-4'}`} onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <User size={18} />
                      </div>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name" 
                        required={!isLogin}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-gray-700 outline-none focus:border-[#2b9365] focus:ring-1 focus:ring-[#2b9365] transition-all text-sm"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address" 
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-gray-700 outline-none focus:border-[#2b9365] focus:ring-1 focus:ring-[#2b9365] transition-all text-sm"
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password" 
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-11 text-gray-700 outline-none focus:border-[#2b9365] focus:ring-1 focus:ring-[#2b9365] transition-all text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2b9365] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <AnimatePresence>
                {isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-end w-full overflow-hidden"
                  >
                    <button type="button" className="text-[13px] text-[#2b9365] font-semibold hover:underline">
                      Forgot Password?
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full ${!isLogin ? 'mt-8' : ''} bg-[#2b9365] text-white py-3 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-[#1f734f] transition-all shadow-md shadow-[#2b9365]/20 disabled:opacity-70`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    {isLogin ? 'Log In' : 'Sign Up'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-auto text-[13px] text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#2b9365] font-semibold hover:underline ml-1"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
