import React, { createContext, useContext, useState, useCallback } from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', title = '') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, title: title || type.toUpperCase() }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          headerBg: 'bg-[#00C897]',
          color: 'text-[#00C897]',
          lightBg: 'bg-[#00C897]/10', // Background tipis untuk ikon
          btn: 'bg-[#00C897] hover:bg-[#00ac82]',
          icon: <Check size={28} strokeWidth={3} />
        };
      case 'error':
        return {
          headerBg: 'bg-[#FF3D68]',
          color: 'text-[#FF3D68]',
          lightBg: 'bg-[#FF3D68]/10',
          btn: 'bg-[#FF3D68] hover:bg-[#e63259]',
          icon: <X size={28} strokeWidth={3} />
        };
      case 'warning':
        return {
          headerBg: 'bg-[#F2C94C]',
          color: 'text-[#F2C94C]',
          lightBg: 'bg-[#F2C94C]/10',
          btn: 'bg-[#F2C94C] hover:bg-[#d9b443]',
          icon: <AlertTriangle size={28} strokeWidth={3} />
        };
      default:
        return {
          headerBg: 'bg-[#2D9CDB]',
          color: 'text-[#2D9CDB]',
          lightBg: 'bg-[#2D9CDB]/10',
          btn: 'bg-[#2D9CDB] hover:bg-[#2587bd]',
          icon: <Info size={28} strokeWidth={3} />
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {toasts.length > 0 && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          
          {toasts.map((toast, index) => {
            const style = getToastStyles(toast.type);
            if (index !== toasts.length - 1) return null;

            return (
              <div
                key={toast.id}
                className="relative w-full max-w-[320px] overflow-hidden bg-white rounded-[2rem] shadow-2xl text-center animate-in zoom-in-95 duration-300"
              >
                {/* Header dengan efek Noise */}
                <div className={`${style.headerBg} h-28 relative flex items-center justify-center overflow-hidden`}>
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                </div>

                {/* Floating Icon dengan Radial Progress */}
                <div className="relative -mt-14 flex justify-center">
                  <div className="relative bg-white p-2 rounded-full shadow-xl">
                    
                    {/* SVG Radial Progress */}
                    <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="46"
                        fill="none"
                        stroke="#f1f1f1"
                        strokeWidth="6"
                      />
                      <circle
                        cx="50" cy="50" r="46"
                        fill="none"
                        className={`${style.color}`}
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: '289',
                          animation: 'radial-progress 5000ms linear forwards'
                        }}
                      />
                    </svg>

                    {/* Ikon dengan Background Tipis di Dalam Lingkaran */}
                    <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${style.lightBg} ${style.color}`}>
                      {style.icon}
                    </div>
                  </div>
                </div>

                {/* Konten Teks */}
                <div className="px-8 pb-8 pt-4">
                  <h3 className="text-xl font-black text-slate-800 mb-1 uppercase tracking-tight">
                    {toast.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mb-6 leading-snug min-h-[40px]">
                    {toast.message}
                  </p>

                  <button 
                    onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                    className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-95 shadow-lg ${style.btn}`}
                  >
                    Ok
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes radial-progress {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 289; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);