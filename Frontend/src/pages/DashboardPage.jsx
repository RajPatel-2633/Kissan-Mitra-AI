import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import slide1 from '../assets/Smart Weather Updates.png';
import slide2 from '../assets/Detect Crop Diseases in Seconds.png';
import slide3 from '../assets/Natural Remedies First.png';
import slide4 from '../assets/Right Fertilisers, Better Results.png';

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
    <div className="space-y-8 pb-10">
      
      {/* Auto-rolling Image Carousel */}
      <div className="relative w-full h-[360px] md:h-[480px] rounded-[24px] overflow-hidden shadow-sm group bg-white border border-gray-100">
        
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {CAROUSEL_IMAGES.map((src, idx) => (
            <div key={idx} className="min-w-full h-full relative">
              <img src={src} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover object-center block" />
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

      {/* Farm Overview Stats */}
      <div>
        <h2 className="text-xl font-bold text-[#113a26] mb-4">Farm Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Scans</p>
              <p className="text-2xl font-extrabold text-gray-800">{isLoading ? '-' : totalScans}</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Healthy Crops</p>
              <p className="text-2xl font-extrabold text-gray-800">{isLoading ? '-' : healthyCrops}</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Diseases Detected</p>
              <p className="text-2xl font-extrabold text-gray-800">{isLoading ? '-' : diseasedCrops}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#113a26]">Recent Scans</h2>
            <button onClick={() => navigate('/dashboard/history')} className="text-sm font-bold text-[#2b9365] hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {history.slice(0, 4).map((record) => (
              <div key={record._id} onClick={() => navigate('/dashboard/history')} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="h-32 bg-gray-100 relative">
                  <img src={record.imageUrl} alt={record.displayName} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{record.displayName}</h4>
                  <p className="text-[11px] text-gray-400 mt-1">{new Date(record.createdAt).toLocaleDateString()}</p>
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
