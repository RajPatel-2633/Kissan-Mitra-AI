import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, History, User, Settings, HelpCircle, Bell, Crown, ChevronDown, Leaf, Menu, X, Globe, Sprout } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useTranslation } from 'react-i18next';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/api/v1/auth/login');
  };

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const navItems = [
    { name: t('Dashboard'), path: '/dashboard', icon: <Home size={20} /> },
    { name: t('AI Chat Assistant'), path: '/dashboard/ai-assistance', icon: <MessageSquare size={20} /> },
    { name: t('My History'), path: '/dashboard/history', icon: <History size={20} /> },
    { name: t('My Profile'), path: '/dashboard/profile', icon: <User size={20} /> },
    { name: t('Settings'), path: '/dashboard/settings', icon: <Settings size={20} /> },
    { name: t('Help & Support'), path: '/dashboard/support', icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#f8fbf9] font-sans selection:bg-[#2b9365] selection:text-white">
      {/* Sidebar Overlay (Mobile / Toggle) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white border-r border-gray-100 flex flex-col justify-between py-6 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-y-auto w-[280px] transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        <div>
          {/* Close button for sidebar */}
          <div className="absolute top-4 right-4 md:hidden">
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          {/* Logo Area */}
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="relative w-12 h-12 bg-green-50 rounded-full flex items-center justify-center p-2 border border-green-100">
               <span className="text-2xl relative z-10">🌿</span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#113a26] tracking-tight leading-tight">Kissan-Mitra-AI</h2>
              <p className="text-[10px] text-gray-500 font-medium">Your AI Farming Companion <span className="text-[#2b9365]">🌿</span></p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-1">
            {navItems.map((item, index) => (
              <React.Fragment key={item.name}>
                {index === 4 && <div className="h-6"></div>} {/* Spacer before Settings */}
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-[14px] ${
                      isActive 
                        ? 'bg-[#f0fdf4] text-[#15803d]' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#2b9365]'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </React.Fragment>
            ))}
          </nav>
        </div>

        <div className="px-4 mt-8">
          {/* Premium Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50/50 rounded-2xl p-5 border border-yellow-100/50 relative overflow-hidden flex flex-col items-center text-center shadow-sm">
            <div className="absolute top-3 right-3 text-yellow-500">
              <Crown size={20} className="fill-current" />
            </div>
            <div className="w-16 h-16 bg-white rounded-full mb-3 overflow-hidden shadow-sm border-2 border-white flex items-center justify-center">
               <img src="/assets/premium_avatar.png" alt="Farmer Avatar" className="w-full h-full object-contain" />
            </div>
            <h4 className="font-bold text-gray-800 text-sm mb-1">{t('Go Premium')}</h4>
            <p className="text-xs text-gray-500 mb-4 px-2 leading-tight">{t('PremiumSubtext')}</p>
            <button className="w-full bg-[#15803d] text-white text-xs font-bold py-2.5 rounded-lg hover:bg-[#166534] transition-colors shadow-sm">
              {t('Upgrade Now')} &rarr;
            </button>
          </div>

          <div className="mt-6 flex items-start gap-2 px-2 text-gray-400">
            <span className="text-[#2b9365] bg-green-50 p-1.5 rounded-md"><Leaf size={14} /></span>
            <p className="text-[10px] font-medium leading-tight mt-0.5">
              Empowering Farmers,<br/>Building a Better Tomorrow.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#f8fbf9] z-0">
        
        {/* Global Animated Background Overlay (Fixed while content scrolls) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Ambient Glowing Blobs - Very soft and faint */}
          <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-[#2b9365]/[0.06] rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-[800px] h-[800px] bg-[#2b9365]/[0.05] rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
          
          {/* Subtle Dotted Grid Pattern - Extremely faint */}
          <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Giant Floating SVGs - Barely visible watermark style */}
          <div className="absolute -top-10 -right-10 text-[#2b9365] opacity-[0.05] animate-float-slow">
            <Leaf size={600} strokeWidth={0.5} />
          </div>
          <div className="absolute -bottom-10 -left-10 text-[#2b9365] opacity-[0.05] animate-float-reverse">
            <Sprout size={500} strokeWidth={0.5} />
          </div>
        </div>

        {/* Header */}
        <header className="h-20 flex-shrink-0 bg-transparent flex items-center justify-between px-8 pt-2 relative z-10">
          
          <div className="flex items-start gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-xl text-[#113a26] hover:bg-[#2b9365]/10 transition-colors mt-1"
            >
              <Menu size={28} />
            </button>
            <div className="flex flex-col hidden sm:flex">
              <h1 className="text-2xl font-bold text-[#113a26] flex items-center gap-2 tracking-tight">
                {t('Namaste').split(',')[0]}, {user?.name?.split(' ')[0] || 'Kisan'}! <span className="text-2xl">👋</span>
              </h1>
              <p className="text-[14px] text-gray-500 font-medium mt-0.5">{t('GreetingSubtext')}</p>
            </div>
            {/* Mobile simplified greeting */}
            <h1 className="text-xl font-bold text-[#113a26] sm:hidden mt-1.5">
              {t('Namaste').split(',')[0]}, {user?.name?.split(' ')[0] || 'Kisan'}!
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-5">
            {/* Language Selector */}
            <div className="relative flex items-center bg-white rounded-full border border-gray-200 px-4 py-2 shadow-sm min-w-[130px]">
              <Globe size={18} className="text-[#2b9365] mr-2 flex-shrink-0" />
              <select 
                onChange={changeLanguage} 
                defaultValue={i18n.language}
                className="bg-transparent text-[15px] font-bold text-gray-700 outline-none cursor-pointer appearance-none w-full pr-4"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
              <ChevronDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
            </div>

            <button className="relative p-2 text-gray-600 hover:text-[#2b9365] transition-colors rounded-full hover:bg-gray-100 hidden md:block">
              <Bell size={24} />
              <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#f8fbf9]"></span>
            </button>
            <div className="flex items-center gap-3 p-1.5 pr-4 rounded-full">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center">
                <img src="/assets/premium_avatar.png" alt="User" className="w-full h-full object-contain" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-[#113a26] leading-tight">{user?.name || 'Kisan Kumar'}</p>
                <p className="text-[11px] font-medium text-gray-500">{t('Active Farmer')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto px-8 relative z-10 flex flex-col">
          <div className="flex-1 pt-4 pb-12">
            <Outlet />
          </div>
          
          {/* Dashboard Footer */}
          <footer className="py-8 mt-auto border-t border-gray-200/60 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
             <div className="flex items-center gap-2">
                <Sprout size={16} className="text-[#2b9365]"/>
                <span className="font-bold text-gray-500">Kissan Mitra AI</span>
                <span>© {new Date().getFullYear()}</span>
             </div>
             <div className="flex gap-6 mt-4 md:mt-0 font-medium">
                <a href="#" className="hover:text-[#2b9365] transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[#2b9365] transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-[#2b9365] transition-colors">Support</a>
             </div>
          </footer>
        </main>
      </main>
    </div>
  );
};

export default DashboardLayout;
