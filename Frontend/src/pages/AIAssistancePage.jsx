import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import { Upload, ShieldCheck, Send, Info, X, Leaf, Search, CheckCircle2, AlertTriangle, Loader2, User } from 'lucide-react';
import api from '../lib/axios';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const AnimatedAIMessage = ({ content }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!content) return;
    
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(content.slice(0, i));
      i++;
      if (i > content.length) {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [content]);

  return (
    <ReactMarkdown
      components={{
        h1: ({node, ...props}) => <h1 className="text-xl font-bold text-[#113a26] mt-5 mb-3" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-lg font-bold text-[#113a26] mt-4 mb-2" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-base font-semibold text-[#113a26] mt-3 mb-1" {...props} />,
        strong: ({node, ...props}) => <strong className="font-semibold text-[#113a26]" {...props} />,
        p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed text-[15px]" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1.5 text-[15px]" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-[15px]" {...props} />,
        li: ({node, ...props}) => <li className="leading-relaxed" {...props} />
      }}
    >
      {displayedText}
    </ReactMarkdown>
  );
};

const DEMO_IMAGES = [
  { id: 1, src: '/assets/bacterial_blight.jpg', label: 'Bacterial Blight' },
  { id: 2, src: '/assets/curl_virus.jpg', label: 'Curl Virus' },
  { id: 3, src: '/assets/fusarium_wilt.jpg', label: 'Fusarium Wilt' },
  { id: 4, src: '/assets/healthy_cotton.jpg', label: 'Healthy' }
];

const AIAssistancePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);
  const reportRef = useRef(null);
  const [searchParams] = useSearchParams();
  const initialRecordId = searchParams.get('recordId');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (initialRecordId) {
      const fetchRecord = async () => {
        try {
          setIsAnalyzing(true);
          const res = await api.get(`/crop/history/${initialRecordId}`);
          const data = res.data.data;
          
          setSelectedImage({ src: data.imageUrl, label: 'Past Scan' });
          setPredictionResult({
            disease: data.displayName,
            confidence: data.confidence.toFixed(1) + "%",
            severity: data.isHealthy ? "low" : "high",
            recommendation: "Please ask the AI assistant on the right for organic remedies and detailed solutions."
          });
          setCurrentRecordId(data._id);
          setChatHistory(data.chatLog || []);
        } catch (err) {
          console.error("Failed to fetch record:", err);
          toast.error("Failed to load the selected chat history.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      fetchRecord();
    }
  }, [initialRecordId]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({ src: imageUrl, label: file.name });
      setPredictionResult(null);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  const handleDragStart = (e, image) => {
    e.dataTransfer.setData('application/json', JSON.stringify(image));
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({ src: imageUrl, label: file.name });
      setPredictionResult(null);
      return;
    }
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      const image = JSON.parse(data);
      setSelectedImage(image);
      setPredictionResult(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setPredictionResult(null);
    
    try {
      const response = await fetch(selectedImage.src);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('crop_image', blob, selectedImage.label || 'image.jpg');
      
      const apiRes = await api.post('/crop/diagnose', formData);
      
      const data = apiRes.data.data;
      
      setCurrentRecordId(data.recordId);
      setPredictionResult({
        disease: data.displayName,
        confidence: data.confidence.toFixed(1) + "%",
        severity: data.isHealthy ? "low" : "high",
        recommendation: "Please ask the AI assistant on the right for organic remedies and detailed solutions."
      });
      
      setChatHistory([]);
      toast.success("Analysis complete!");
      
    } catch (error) {
      console.error("Diagnosis Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (e, text = null) => {
    if (e) e.preventDefault();
    const messageToSend = text || chatInput;
    if (!messageToSend.trim()) return;
    if (!currentRecordId) {
      toast.error("Please upload and diagnose an image first.");
      return;
    }
    
    const newChatHistory = [...chatHistory, { sender: 'farmer', message: messageToSend }];
    setChatHistory(newChatHistory);
    setChatInput('');
    setIsChatting(true);
    
    try {
      // Send both the user's message and their current UI language preference
      const res = await api.post(`/crop/chat/${currentRecordId}`, { 
        message: messageToSend, 
        language: i18n.language === 'hi' ? 'Hindi' : 
                  i18n.language === 'mr' ? 'Marathi' : 
                  i18n.language === 'gu' ? 'Gujarati' : 'English'
      });
      setChatHistory([...newChatHistory, { sender: 'ai', message: res.data.data }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory([...newChatHistory, { sender: 'ai', message: "Sorry, I am having trouble connecting to the network right now." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleExportPDF = () => {
    if (!predictionResult || !selectedImage) return;
    
    setIsExporting(true);
    try {
      const doc = new jsPDF({ unit: 'in', format: 'letter', orientation: 'portrait' });
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(27, 94, 32); 
      doc.text("Kissan-Mitra-AI", 0.5, 0.8);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Official Crop Diagnosis Report", 0.5, 1.1);
      
      doc.setFontSize(10);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 8.0, 0.8, { align: 'right' });
      doc.text(`Record ID: ${currentRecordId || 'N/A'}`, 8.0, 1.0, { align: 'right' });
      
      doc.setDrawColor(43, 147, 101);
      doc.setLineWidth(0.02);
      doc.line(0.5, 1.3, 8.0, 1.3);
      
      const img = new Image();
      img.src = selectedImage.src;
      img.onload = () => {
        try {
          // Draw Image
          doc.addImage(img, 'JPEG', 0.5, 1.5, 2.5, 2.5);
          
          // Diagnosis Results
          doc.setFontSize(16);
          doc.setTextColor(30, 30, 30);
          doc.text("Diagnosis Results", 3.3, 1.7);
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("DETECTED CONDITION", 3.3, 2.0);
          
          doc.setFontSize(14);
          if (predictionResult.disease === 'Healthy') {
             doc.setTextColor(43, 147, 101);
          } else {
             doc.setTextColor(220, 38, 38);
          }
          doc.text(predictionResult.disease, 3.3, 2.2);
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("CONFIDENCE", 8.0, 2.0, { align: 'right' });
          
          doc.setFontSize(14);
          doc.setTextColor(30, 30, 30);
          doc.text(predictionResult.confidence, 8.0, 2.2, { align: 'right' });
          
          doc.setFontSize(10);
          doc.setTextColor(80, 80, 80);
          const splitRec = doc.splitTextToSize(predictionResult.recommendation, 4.5);
          doc.text(splitRec, 3.3, 2.6);
          
          doc.setDrawColor(200, 200, 200);
          doc.line(0.5, 4.3, 8.0, 4.3);
          
          doc.setFontSize(14);
          doc.setTextColor(30, 30, 30);
          doc.text("Chat Summary / AI Advice", 0.5, 4.7);
          
          let yPos = 5.0;
          if (chatHistory.length === 0) {
             doc.setFontSize(10);
             doc.setTextColor(150, 150, 150);
             doc.text("No chat history recorded for this session.", 0.5, yPos);
          } else {
             chatHistory.forEach(chat => {
               if (yPos > 10) {
                 doc.addPage();
                 yPos = 1.0;
               }
               doc.setFontSize(9);
               doc.setTextColor(150, 150, 150);
               doc.text(chat.sender === 'farmer' ? 'You' : 'AI Assistant', 0.5, yPos);
               
               doc.setFontSize(10);
               doc.setTextColor(50, 50, 50);
               const lines = doc.splitTextToSize(chat.message, 7.5);
               doc.text(lines, 0.5, yPos + 0.2);
               yPos += 0.4 + (lines.length * 0.15);
             });
          }
          
          doc.save(`Crop_Diagnosis_Report_${new Date().toISOString().slice(0,10)}.pdf`);
          toast.success("PDF Report Exported!");
        } catch (e) {
          console.error(e);
          toast.error("Failed to render PDF");
        } finally {
          setIsExporting(false);
        }
      };
      
      img.onerror = () => {
         toast.error("Failed to load image for PDF");
         setIsExporting(false);
      };
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to start PDF generation");
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* Full Screen Custom Loader */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300">
          <div className="relative flex items-center justify-center w-36 h-36 bg-white rounded-full shadow-[0_0_40px_rgba(43,147,101,0.15)] border-4 border-[#2b9365]/20 mb-8">
            <Leaf className="text-[#2b9365] w-16 h-16 absolute z-10" />
            <div className="absolute inset-0 w-full h-full animate-[spin_2s_linear_infinite] z-20">
               <Search className="absolute -top-3 right-4 text-[#113a26] w-12 h-12 drop-shadow-md bg-white rounded-full p-1 border border-gray-100" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-[#2b9365] animate-ping opacity-20"></div>
          </div>
          <h3 className="text-3xl font-extrabold text-[#113a26] mb-3 animate-pulse">Analyzing Crop...</h3>
          <p className="text-gray-500 font-medium">Please wait while our AI models examine the image</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-120px)] w-full relative">
        
        {/* Left Panel: Detect Crop Diseases */}
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between overflow-y-auto">
          <div className="mb-8 flex flex-col items-center text-center mx-auto">
            <h2 className="text-4xl font-bold text-[#113a26] flex items-center justify-center gap-3 mb-3 tracking-tight">
              <Leaf className="text-[#2b9365]" size={36} />
              {t('Detect Crop Diseases')}
            </h2>
            <p className="text-[15px] text-gray-500 font-medium leading-relaxed max-w-lg mb-5">
              {t('Upload a clear image of your crop leaf or plant to detect diseases and get AI recommendations.')}
            </p>
            
            {/* Cotton crop notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-5 max-w-lg flex items-start gap-4 text-left shadow-sm mx-auto">
              <Info size={28} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-[16px] text-yellow-800 font-medium leading-relaxed">
                <strong>{t('Demo Notice:')}</strong> {t('Currently, our AI model is exclusively trained to detect diseases in')} <strong>{t('Cotton')}</strong> {t('crops.')}
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col xl:flex-row gap-8 items-center justify-center mt-2">
            <div className="flex-1 w-full max-w-sm flex flex-col h-full justify-center">
              
              {/* Upload / Drop Zone or Results */}
              {predictionResult ? (
                <>
                  <div className="border border-green-100 rounded-3xl p-6 bg-gradient-to-b from-green-50/50 to-white mb-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
                    
                    <div className="flex items-start gap-5 mb-5 relative z-10">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-[3px] border-white shadow-sm flex-shrink-0">
                        <img src={selectedImage.src} alt="Analyzed" className="w-full h-full object-cover" />
                      </div>
                      <div className="mt-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          {predictionResult.disease === 'Healthy' ? (
                            <CheckCircle2 size={24} className="text-green-500" />
                          ) : (
                            <AlertTriangle size={24} className="text-red-500" />
                          )}
                          <h4 className={`text-xl font-bold ${predictionResult.disease === 'Healthy' ? 'text-green-700' : 'text-red-600'}`}>
                            {predictionResult.disease}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{t('Confidence:')} <span className="text-gray-800 font-bold text-base">{predictionResult.confidence}</span></p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 relative z-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <p className="text-sm font-bold text-gray-700 mb-1.5">{t('AI Recommendation:')}</p>
                      <p className="text-[14px] text-gray-600 leading-relaxed font-medium">
                        {predictionResult.recommendation}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 mb-5 flex gap-3">
                    <button 
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      className="flex-1 bg-[#15803d] hover:bg-[#166534] text-white py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-green-600/20"
                    >
                      {isExporting ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
                      {isExporting ? t('Generating PDF...') : t('Download PDF Report')}
                    </button>
                  </div>
                </>
              ) : (
                <div 
                  onClick={handleUploadClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 mb-4 hover:bg-gray-50 hover:border-[#2b9365]/30 transition-colors cursor-pointer group min-h-[220px]"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    accept="image/jpeg, image/png, image/jpg" 
                    className="hidden" 
                  />
                  {selectedImage ? (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                        className="absolute top-2 right-2 bg-white border border-gray-100 rounded-full p-1 shadow-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
                      >
                        <X size={16} />
                      </button>
                      <img src={selectedImage.src} alt={selectedImage.label} className="w-full h-full object-contain absolute inset-0 p-2 rounded-2xl" />
                    </>
                  ) : (
                    <>
                      <div className="text-gray-400 mb-4 group-hover:text-[#2b9365] transition-colors">
                        <Upload size={48} />
                      </div>
                      <p className="text-xl font-bold text-[#113a26] mb-2">{t('Drag & Drop Image Here')}</p>
                      <p className="text-sm text-gray-400 font-medium">{t('or click to browse (JPG, PNG)')}</p>
                    </>
                  )}
                </div>
              )}
              
              <button 
                disabled={!selectedImage || isAnalyzing}
                onClick={predictionResult ? () => { setSelectedImage(null); setPredictionResult(null); } : handlePredict}
                className={`w-full text-white text-[15px] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm ${selectedImage ? 'bg-gray-800 hover:bg-gray-900' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                <span className="text-xl">✨</span> {predictionResult ? t('Scan Another Image') : t('Predict Disease')}
              </button>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider text-center">{t('Or try these demo images')}</p>
                <div className="flex justify-center gap-4">
                  {DEMO_IMAGES.map((img) => (
                    <div key={img.id} className="flex flex-col items-center gap-1.5">
                      <div 
                        draggable
                        onDragStart={(e) => handleDragStart(e, img)}
                        className="w-14 h-14 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#2b9365] cursor-grab active:cursor-grabbing transition-all shadow-sm group relative bg-gray-50 flex items-center justify-center"
                      >
                        <img 
                          src={img.src} 
                          alt={img.label} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 relative z-10" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <span className="text-[10px] text-gray-400 font-bold absolute z-0">IMG {img.id}</span>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-20 pointer-events-none"></div>
                      </div>
                      <span className="text-[12px] font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-center max-w-[90px] leading-tight">{img.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[15px] text-gray-400 text-center mt-4 font-medium px-4 italic leading-relaxed">
                  *Note: The images chosen for this demo are sourced from Google and are not from our official Test Set.
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-5 text-gray-400">
                <ShieldCheck size={20} />
                <p className="text-[15px] font-medium">Your data is secure and private</p>
              </div>
            </div>

            <div className="w-48 h-48 xl:w-64 xl:h-64 flex-shrink-0 relative hidden md:block">
               <img src="/assets/plant_scan.png" alt="Plant Scan" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>

        {/* Right Column: AI Chat */}
        <div className="flex-1 bg-gradient-to-b from-[#f4fcf6] to-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-green-50 flex flex-col relative overflow-hidden min-h-[500px] lg:min-h-0 lg:h-full">
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none w-64 h-64 mix-blend-multiply hidden sm:block">
             <img src="/assets/ai_robot.png" alt="AI Robot" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col items-center text-center mb-8 relative z-10 mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-[#2b9365] text-4xl">💬</span>
              <h2 className="text-4xl font-bold text-[#113a26] tracking-tight">{t('AI Chat Assistant')}</h2>
            </div>
            <p className="text-[15px] text-gray-500 font-medium max-w-md">
              {t('Ask anything about your crops, problems, and best natural solutions.')}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto mb-6 flex flex-col gap-4 relative z-10 pr-2">
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-green-100 flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                 <span className="text-sm">🌿</span>
              </div>
              <div className="bg-white border border-green-50 px-5 py-3.5 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]">
                <p className="text-[14px] font-medium text-gray-700">{currentRecordId ? "I see your diagnosis is ready. How can I help you treat this crop?" : t('Hi Kisan! Please upload a crop image on the left to get started!')}</p>
              </div>
            </div>
            
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${chat.sender.toLowerCase() === 'farmer' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mt-1 ${chat.sender.toLowerCase() === 'farmer' ? 'bg-[#15803d] text-white' : 'bg-white border border-green-100'}`}>
                   {chat.sender.toLowerCase() === 'farmer' ? <User size={16} /> : <span className="text-sm">🌿</span>}
                </div>
                <div className={`px-5 py-4 rounded-2xl shadow-sm max-w-[85%] ${chat.sender.toLowerCase() === 'farmer' ? 'bg-[#15803d] text-white rounded-tr-sm' : 'bg-white border border-green-50 rounded-tl-sm'}`}>
                  {chat.sender.toLowerCase() === 'farmer' ? (
                    <p className="text-[15px] whitespace-pre-wrap text-white">{chat.message}</p>
                  ) : (
                    <div className="text-[15px] text-gray-700">
                      <AnimatedAIMessage content={chat.message} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isChatting && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-green-100 flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                   <span className="text-sm">🌿</span>
                </div>
                <div className="bg-white border border-green-50 px-5 py-3.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="text-[#2b9365] animate-spin" />
                  <p className="text-[14px] font-medium text-gray-500">Typing...</p>
                </div>
              </div>
            )}
            
          </div>

          {/* Suggestions */}
          <div className="flex gap-3 mb-6 flex-wrap relative z-10">
             <button onClick={() => handleSendMessage(null, "My plant leaves are turning yellow")} disabled={!currentRecordId || isChatting} className="bg-white border border-gray-100 px-4 py-3 rounded-xl text-[12px] font-bold text-gray-600 hover:text-[#15803d] hover:border-green-200 transition-colors shadow-sm text-left leading-tight max-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed">
               {t('My plant leaves are turning yellow')}
             </button>
             <button onClick={() => handleSendMessage(null, "How to increase yield naturally?")} disabled={!currentRecordId || isChatting} className="bg-white border border-gray-100 px-4 py-3 rounded-xl text-[12px] font-bold text-gray-600 hover:text-[#15803d] hover:border-green-200 transition-colors shadow-sm text-left leading-tight max-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed">
               {t('How to increase yield naturally?')}
             </button>
             <button onClick={() => handleSendMessage(null, "Best organic pesticide for pests?")} disabled={!currentRecordId || isChatting} className="bg-white border border-gray-100 px-4 py-3 rounded-xl text-[12px] font-bold text-gray-600 hover:text-[#15803d] hover:border-green-200 transition-colors shadow-sm text-left leading-tight max-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed">
               {t('Best organic pesticide for pests?')}
             </button>
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="relative z-10">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={!currentRecordId || isChatting}
              placeholder={currentRecordId ? t('Type your question here...') : t('Diagnose an image to start chatting...')}
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-6 pr-16 text-[14px] font-medium text-gray-700 focus:outline-none focus:border-[#2b9365] focus:ring-4 focus:ring-green-50 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
            <button type="submit" disabled={!currentRecordId || !chatInput.trim() || isChatting} className="absolute right-2 top-2 bottom-2 bg-[#15803d] text-white w-12 rounded-xl flex items-center justify-center hover:bg-[#166534] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <Send size={18} className="-ml-1" />
            </button>
          </form>

        </div>

      </div>
    </>
  );
};

export default AIAssistancePage;
