import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Leaf
} from 'lucide-react';

// Utility for merging classes (common in Aceternity/Shadcn)
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center lg:justify-end bg-black font-outfit">
      {/* Background Image - Fit perfectly to tab width/height without cropping */}
      <div 
        className="absolute inset-0 w-full h-full bg-no-repeat"
        style={{ 
          backgroundImage: "url('/assets/login_bg_farmer.jpg')",
          backgroundSize: '100% 100%',
          backgroundPosition: 'top center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/40" />
      </div>


      {/* Decorative Blur Elements (Aceternity Style) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-green/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Login Card - Fixed clipping and added scroll if needed */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[460px] lg:mr-[5vw] mx-4"
      >
        <div className="bg-white/95 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[48px] p-6 lg:p-10 flex flex-col w-full max-h-[95vh] overflow-y-auto overflow-x-hidden scrollbar-hide">


          
          {/* Logo Section */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-primary-green/20 rounded-[24px] mb-4 text-primary-green shadow-sm"
            >
              <div className="w-16 h-16 bg-primary-green rounded-[18px] flex items-center justify-center text-white">
                <Leaf size={32} fill="currentColor" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-primary-dark tracking-tight mb-2">
              KISSAN MITRA AI
            </h1>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Smart Technology, Healthy Crops,<br />Happy Farmers.
            </p>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary-dark">Welcome Back!</h2>
            <p className="text-gray-500 text-sm">Login to continue to your account</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-green group-focus-within:scale-110 transition-transform">
                <User size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Enter Mobile Number" 
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-700 outline-none focus:ring-4 focus:ring-primary-light focus:border-primary-green transition-all shadow-sm"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-green group-focus-within:scale-110 transition-transform">
                <Lock size={20} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter Password" 
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-12 text-gray-700 outline-none focus:ring-4 focus:ring-primary-light focus:border-primary-green transition-all shadow-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-green transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm font-semibold text-primary-green hover:text-primary-dark transition-colors">
                Forgot Password?
              </a>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary-green text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-green/20 flex items-center justify-center gap-3 hover:bg-primary-dark transition-all"
            >
              Login
              <ArrowRight size={20} />
            </motion.button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-gray-100" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
              <div className="h-[1px] flex-1 bg-gray-100" />
            </div>

            <motion.button 
              whileHover={{ backgroundColor: "#f9fafb" }}
              className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Login with Google
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-auto pt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="#" className="font-bold text-primary-green hover:underline">Sign Up</a>
          </div>
        </div>
      </motion.div>


    </div>
  );
};



export default Login;
