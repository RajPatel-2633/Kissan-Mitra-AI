import React, { useState } from 'react';
import { Upload, ShieldCheck, Send, Info, X, Leaf, Search, CheckCircle2, AlertTriangle } from 'lucide-react';

const DEMO_IMAGES = [
  { id: 1, src: '/assets/real_cotton_1.jpg', label: 'Healthy Leaf' },
  { id: 2, src: '/assets/real_cotton_2.jpg', label: 'Yellow Spots' },
  { id: 3, src: '/assets/real_cotton_3.jpg', label: 'Curling Edges' }
];

const AIAssistancePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

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

  const handlePredict = () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setPredictionResult(null);
    
    // Simulate AI processing delay
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Simple mock logic for demo based on label
      let disease = "Healthy";
      let severity = "low";
      let recommendation = "Your crop is healthy! Keep maintaining current watering and nutrient schedules.";
      
      if (selectedImage.label.toLowerCase().includes('yellow') || selectedImage.label.toLowerCase().includes('2')) {
        disease = "Bacterial Blight";
        severity = "high";
        recommendation = "Apply copper-based fungicides immediately. Avoid overhead irrigation to prevent spreading.";
      } else if (selectedImage.label.toLowerCase().includes('curl') || selectedImage.label.toLowerCase().includes('3')) {
        disease = "Cotton Leaf Curl Virus (CLCuV)";
        severity = "critical";
        recommendation = "Uproot and burn infected plants. Control whitefly populations using neem oil or recommended insecticides.";
      }

      setPredictionResult({
        disease,
        confidence: (Math.random() * 5 + 92).toFixed(1) + "%", // 92% - 97%
        severity,
        recommendation
      });
    }, 2500);
  };

  return (
    <>
      {/* Full Screen Custom Loader */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300">
          <div className="relative flex items-center justify-center w-36 h-36 bg-white rounded-full shadow-[0_0_40px_rgba(43,147,101,0.15)] border-4 border-[#2b9365]/20 mb-8">
            {/* The leaf in the center */}
            <Leaf className="text-[#2b9365] w-16 h-16 absolute z-10" />
            
            {/* The spinning magnifying glass */}
            <div className="absolute inset-0 w-full h-full animate-[spin_2s_linear_infinite] z-20">
               <Search className="absolute -top-3 right-4 text-[#113a26] w-12 h-12 drop-shadow-md bg-white rounded-full p-1 border border-gray-100" />
            </div>
            
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-full border-2 border-[#2b9365] animate-ping opacity-20"></div>
          </div>
          
          <h3 className="text-3xl font-extrabold text-[#113a26] mb-3 animate-pulse">Analyzing Crop...</h3>
          <p className="text-gray-600 font-medium text-lg">Our AI is scanning the leaf for patterns and diseases</p>
        </div>
      )}

      <div className="h-full flex flex-col lg:flex-row gap-6 pb-2 min-h-0">
        
        {/* Left Panel: Detect Crop Diseases */}
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#2b9365] text-xl">🌿</span>
              <h2 className="text-2xl font-extrabold text-[#113a26]">Detect Crop Diseases</h2>
            </div>
            <p className="text-[13px] text-gray-500 mb-4 font-medium max-w-sm">
              Upload a clear image of your crop leaf or plant to detect diseases and get AI recommendations.
            </p>
            
            {/* Cotton crop notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 max-w-sm flex items-start gap-2">
              <Info size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-yellow-700 font-medium leading-relaxed">
                <strong>Demo Notice:</strong> Currently, our AI model is exclusively trained to detect diseases in <strong>Cotton</strong> crops.
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col xl:flex-row gap-8 items-center justify-center mt-2">
            <div className="flex-1 w-full max-w-sm flex flex-col h-full justify-center">
              
              {/* Upload / Drop Zone or Results */}
              {predictionResult ? (
                <div className="border border-green-100 rounded-2xl p-6 bg-gradient-to-b from-green-50/50 to-white mb-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
                  
                  <div className="flex items-start gap-4 mb-4 relative z-10">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                      <img src={selectedImage.src} alt="Analyzed" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {predictionResult.disease === 'Healthy' ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                        <h4 className={`font-bold ${predictionResult.disease === 'Healthy' ? 'text-green-700' : 'text-red-600'}`}>
                          {predictionResult.disease}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Confidence: <span className="text-gray-800 font-bold">{predictionResult.confidence}</span></p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-100 relative z-10">
                    <p className="text-xs font-bold text-gray-700 mb-1">AI Recommendation:</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                      {predictionResult.recommendation}
                    </p>
                  </div>
                </div>
              ) : (
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 mb-4 hover:bg-gray-50 hover:border-[#2b9365]/30 transition-colors cursor-pointer group min-h-[220px]"
                >
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
                      <div className="text-gray-400 mb-3 group-hover:text-[#2b9365] transition-colors">
                        <Upload size={32} />
                      </div>
                      <p className="text-sm font-bold text-[#113a26] mb-1">Drag & Drop Image Here</p>
                      <p className="text-[11px] text-gray-400 font-medium">or click to browse (JPG, PNG)</p>
                    </>
                  )}
                </div>
              )}
              
              <button 
                disabled={!selectedImage || isAnalyzing}
                onClick={predictionResult ? () => { setSelectedImage(null); setPredictionResult(null); } : handlePredict}
                className={`w-full text-white text-[14px] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm ${selectedImage ? 'bg-[#15803d] hover:bg-[#166534]' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                <span className="text-lg">✨</span> {predictionResult ? 'Scan Another Image' : 'Predict Disease'}
              </button>

              {/* Demo Images Gallery */}
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider text-center">Or try these demo images</p>
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
                      <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{img.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-5 text-gray-400">
                <ShieldCheck size={16} />
                <p className="text-[11px] font-medium">Your data is secure and private</p>
              </div>
            </div>

            <div className="w-48 h-48 xl:w-64 xl:h-64 flex-shrink-0 relative hidden md:block">
               <img src="/assets/plant_scan.png" alt="Plant Scan" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>

        {/* Right Panel: AI Chat Assistant */}
        <div className="flex-1 bg-gradient-to-b from-[#f4fcf6] to-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-green-50 flex flex-col relative overflow-hidden">
          
          {/* Background Decorative Bot */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none w-64 h-64 mix-blend-multiply hidden sm:block">
             <img src="/assets/ai_robot.png" alt="AI Robot" className="w-full h-full object-contain" />
          </div>

          <div className="flex items-center gap-2 mb-3 relative z-10">
            <span className="text-[#2b9365] text-xl">💬</span>
            <h2 className="text-2xl font-extrabold text-[#113a26]">AI Chat Assistant</h2>
          </div>
          
          <p className="text-[13px] text-gray-500 mb-8 font-medium max-w-sm relative z-10">
            Ask anything about your crops, problems, and best natural solutions.
          </p>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto mb-6 flex flex-col gap-4 relative z-10">
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-green-100 flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                 <span className="text-sm">🌿</span>
              </div>
              <div className="bg-white border border-green-50 px-5 py-3.5 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]">
                <p className="text-[14px] font-medium text-gray-700">Hi Kisan! How can I help you today?</p>
              </div>
            </div>
            
          </div>

          {/* Suggestions */}
          <div className="flex gap-3 mb-6 flex-wrap relative z-10">
             <button className="bg-white border border-gray-100 px-4 py-3 rounded-xl text-[12px] font-bold text-gray-600 hover:text-[#15803d] hover:border-green-200 transition-colors shadow-sm text-left leading-tight max-w-[150px]">
               My plant leaves are turning yellow
             </button>
             <button className="bg-white border border-gray-100 px-4 py-3 rounded-xl text-[12px] font-bold text-gray-600 hover:text-[#15803d] hover:border-green-200 transition-colors shadow-sm text-left leading-tight max-w-[150px]">
               How to increase yield naturally?
             </button>
             <button className="bg-white border border-gray-100 px-4 py-3 rounded-xl text-[12px] font-bold text-gray-600 hover:text-[#15803d] hover:border-green-200 transition-colors shadow-sm text-left leading-tight max-w-[150px]">
               Best organic pesticide for pests?
             </button>
          </div>

          {/* Input */}
          <div className="relative z-10">
            <input 
              type="text" 
              placeholder="Type your question here..." 
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-6 pr-16 text-[14px] font-medium text-gray-700 focus:outline-none focus:border-[#2b9365] focus:ring-4 focus:ring-green-50 transition-all shadow-sm"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-[#15803d] text-white w-12 rounded-xl flex items-center justify-center hover:bg-[#166534] transition-colors shadow-sm">
              <Send size={18} className="-ml-1" />
            </button>
          </div>

        </div>

      </div>
    </>
  );
};

export default AIAssistancePage;
