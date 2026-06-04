import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Loader2, Calendar, Activity, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/crop/history');
        setHistory(res.data.data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
        toast.error("Failed to load your scan history.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#2b9365]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
          <Activity className="text-[#2b9365] w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#113a26]">My Scan History</h1>
          <p className="text-sm text-gray-500 font-medium">Review your past crop diagnoses and AI conversations.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Scans Yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">You haven't scanned any crops yet. Head over to the AI Assistant to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((record) => (
            <div key={record._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="h-48 overflow-hidden relative bg-gray-100">
                <img src={record.imageUrl} alt={record.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                  {record.isHealthy ? <CheckCircle2 size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-red-500" />}
                  <span className={`text-xs font-bold ${record.isHealthy ? 'text-green-700' : 'text-red-600'}`}>{record.confidence.toFixed(1)}%</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">{new Date(record.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{record.displayName}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {record.isHealthy ? 'Crop is healthy. Keep up the good work!' : 'Disease detected. Requires immediate attention and treatment.'}
                </p>
                <button className="w-full py-2.5 bg-gray-50 hover:bg-green-50 text-[#15803d] rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                  View Chat <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
