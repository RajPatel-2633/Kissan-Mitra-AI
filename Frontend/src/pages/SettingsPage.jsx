import React, { useState } from 'react';
import { Settings, Save, Lock, User, LogOut, CheckCircle2 } from 'lucide-react';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { user, logout, checkAuth } = useAuthStore();
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error(t("Passwords do not match"));
      return;
    }

    setIsUpdating(true);
    try {
      const updatePayload = {};
      if (formData.name && formData.name !== user?.name) updatePayload.name = formData.name;
      if (formData.newPassword) updatePayload.newPassword = formData.newPassword;

      if (Object.keys(updatePayload).length === 0) {
        toast.error(t("No changes made"));
        setIsUpdating(false);
        return;
      }

      await api.patch('/auth/update-profile', updatePayload);
      await checkAuth(); // Refresh user data in store
      
      toast.success(t("Profile updated successfully!"));
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
          <Settings className="text-[#2b9365] w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#113a26]">{t('Settings')}</h1>
          <p className="text-sm text-gray-500 font-medium">{t('Manage your account and security preferences.')}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50/50 rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/3"></div>

        <form onSubmit={handleUpdateProfile} className="space-y-8 relative z-10">
          
          {/* Profile Information Section */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <User size={18} className="text-[#2b9365]" />
              {t('Profile Information')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('Full Name')}</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2b9365]/20 focus:border-[#2b9365] transition-all"
                  placeholder={t('Enter your full name')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('Email Address')}</label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
                />
                <p className="text-[11px] text-gray-400 mt-1 font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-green-500" /> {t('Verified email cannot be changed')}
                </p>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <Lock size={18} className="text-[#2b9365]" />
              {t('Security')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('New Password')}</label>
                <input 
                  type="password" 
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2b9365]/20 focus:border-[#2b9365] transition-all"
                  placeholder={t('Leave blank to keep current password')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('Confirm New Password')}</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2b9365]/20 focus:border-[#2b9365] transition-all"
                  placeholder={t('Confirm new password')}
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <button 
              type="button"
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-transparent hover:border-red-100"
            >
              <LogOut size={16} />
              {t('Sign Out')}
            </button>
            <button 
              type="submit"
              disabled={isUpdating}
              className="bg-[#15803d] hover:bg-[#166534] text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm shadow-green-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isUpdating ? t('Saving...') : t('Save Changes')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
