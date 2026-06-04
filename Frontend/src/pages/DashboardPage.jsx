import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertTriangle, ArrowRight, Sprout, Bug, Leaf, Sun, Cloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import slide1 from '../assets/Smart Weather Updates.png';
import slide2 from '../assets/Detect Crop Diseases in Seconds.png';
import slide3 from '../assets/Natural Remedies First.png';
import slide4 from '../assets/Right Fertilisers, Better Results.png';
import WeatherWidget from '../components/WeatherWidget';

const CAROUSEL_IMAGES = [
  slide1,
  slide2,
  slide3,
  slide4
];

const DashboardPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === CAROUSEL_IMAGES.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/crop/history');
        setHistory(res.data.data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalScans = history.length;
  const healthyCrops = history.filter(h => h.isHealthy).length;
  const diseasedCrops = totalScans - healthyCrops;

  return (
    <div className="space-y-16 pb-12 pt-6 relative">
      
      {/* Decorative Floating Elements (Visible in the wide margins) */}
      <div className="absolute top-10 left-2 2xl:left-12 hidden lg:flex flex-col gap-32 pointer-events-none z-0">
        <div className="text-[#2b9365] opacity-[0.15] animate-float-slow">
          <Leaf size={150} strokeWidth={1} />
        </div>
        <div className="text-emerald-600 opacity-[0.12] animate-float-reverse ml-10">
          <Cloud size={130} strokeWidth={1} />
        </div>
      </div>
      
      <div className="absolute top-24 right-2 2xl:right-12 hidden lg:flex flex-col gap-40 pointer-events-none z-0">
        <div className="text-yellow-600 opacity-[0.12] animate-float-slow">
          <Sun size={170} strokeWidth={1} />
        </div>
        <div className="text-[#2b9365] opacity-[0.15] animate-float-reverse mr-10">
          <Sprout size={140} strokeWidth={1} />
        </div>
      </div>

      {/* Auto-rolling Image Carousel */}
      <div className="relative w-[92%] max-w-6xl mx-auto h-[500px] md:h-[660px] rounded-[32px] overflow-hidden shadow-2xl group bg-transparent z-10">
        
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {CAROUSEL_IMAGES.map((src, idx) => (
            <div key={idx} className="min-w-full h-full relative">
              <img src={src} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover object-center block scale-105" />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {CAROUSEL_IMAGES.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[#15803d] w-8' : 'bg-gray-300/80 w-2 hover:bg-gray-400'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Farm Overview & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Weather Widget */}
        <div className="lg:col-span-1 flex flex-col">
          <h2 className="text-4xl font-bold text-[#113a26] mb-12 tracking-tight">{t('Local Weather')}</h2>
          <div className="flex-1 min-h-0">
            <WeatherWidget />
          </div>
        </div>

        {/* Farm Overview Stats */}
        <div className="lg:col-span-3 flex flex-col">
          <h2 className="text-4xl font-bold text-[#113a26] mb-12 tracking-tight">{t('Farm Overview')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Total Scans Card */}
            <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[320px] hover:-translate-y-1">
              
              {/* Fluid Animated Background Blobs */}
              <div className="absolute top-0 -left-4 w-48 h-48 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
              <div className="absolute top-0 -right-4 w-48 h-48 bg-cyan-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-48 h-48 bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
              
              {/* Shimmer Sweep Effect */}
              <div className="absolute top-0 inset-x-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent z-10 pointer-events-none animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Background Animated SVG */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 flex items-center justify-center text-blue-600 opacity-15 group-hover:opacity-25 transition-opacity duration-700 animate-pulse-slow">
                <Activity size={220} strokeWidth={1} />
              </div>
              
              <div className="relative z-20 flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300/60 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Activity size={28} />
                </div>
                <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">{t('Activity')}</span>
                </div>
              </div>

              <div className="relative z-20 mt-auto group-hover:translate-x-2 transition-transform duration-300">
                <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-1">{t('Total Scans')}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-800 to-blue-500 tracking-tighter drop-shadow-sm">{isLoading ? '-' : totalScans}</p>
                  <span className="text-sm font-bold text-gray-500">{t('crops')}</span>
                </div>
              </div>
            </div>

            {/* Healthy Crops Card */}
            <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[320px] hover:-translate-y-1">
              
              {/* Fluid Animated Background Blobs */}
              <div className="absolute top-0 -left-4 w-48 h-48 bg-emerald-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
              <div className="absolute top-0 -right-4 w-48 h-48 bg-green-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-48 h-48 bg-teal-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
              
              {/* Shimmer Sweep Effect */}
              <div className="absolute top-0 inset-x-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent z-10 pointer-events-none animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Background Animated SVG */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 flex items-center justify-center text-emerald-600 opacity-15 group-hover:opacity-25 transition-opacity duration-700 animate-float-slow">
                <Sprout size={220} strokeWidth={1} />
              </div>
              
              <div className="relative z-20 flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-300/60 flex items-center justify-center text-emerald-700 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 size={28} />
                </div>
                <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">{t('Status')}</span>
                </div>
              </div>

              <div className="relative z-20 mt-auto group-hover:translate-x-2 transition-transform duration-300">
                <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-1">{t('Healthy Crops')}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-700 to-green-500 tracking-tighter drop-shadow-sm">{isLoading ? '-' : healthyCrops}</p>
                  <span className="text-sm font-bold text-gray-500">{t('safe')}</span>
                </div>
              </div>
            </div>

            {/* Diseases Detected Card */}
            <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-rose-900/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[320px] hover:-translate-y-1">
              
              {/* Fluid Animated Background Blobs */}
              <div className="absolute top-0 -left-4 w-48 h-48 bg-rose-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
              <div className="absolute top-0 -right-4 w-48 h-48 bg-red-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-48 h-48 bg-orange-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
              
              {/* Shimmer Sweep Effect */}
              <div className="absolute top-0 inset-x-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent z-10 pointer-events-none animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Background Animated SVG */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 flex items-center justify-center text-rose-600 opacity-15 group-hover:opacity-25 transition-opacity duration-700 animate-float-reverse">
                <Bug size={220} strokeWidth={1} />
              </div>
              
              <div className="relative z-20 flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-300/60 flex items-center justify-center text-rose-700 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle size={28} />
                </div>
                <div className="bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest">{t('Alert')}</span>
                </div>
              </div>

              <div className="relative z-20 mt-auto group-hover:translate-x-2 transition-transform duration-300">
                <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-1">{t('Diseases Detected')}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-800 to-red-500 tracking-tighter drop-shadow-sm">{isLoading ? '-' : diseasedCrops}</p>
                  <span className="text-sm font-bold text-gray-500">{t('found')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-[#113a26] tracking-tight">{t('Recent Scans')}</h2>
            <button onClick={() => navigate('/dashboard/history')} className="text-sm font-bold text-[#2b9365] hover:underline flex items-center gap-1">
              {t('View All')} <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {history.slice(0, 4).map((record) => (
              <div key={record._id} onClick={() => navigate(`/dashboard/ai-assistance?recordId=${record._id}`)} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col">
                <div className="h-64 bg-gray-100 relative flex-shrink-0">
                  <img src={record.imageUrl} alt={record.displayName} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center bg-gray-50/30">
                  <h4 className="font-bold text-[#113a26] text-xl truncate mb-4 tracking-tight">{record.displayName}</h4>
                  <div className="flex items-center">
                    <span className="bg-green-50 text-green-700 text-[14px] font-bold px-3.5 py-1.5 rounded-full border border-green-200 shadow-sm">
                      {new Date(record.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '/')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default DashboardPage;
