import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Camera, X, Sparkles, AlertTriangle, Check, Upload, RefreshCw } from 'lucide-react';

export const FoodPhotoScannerModal: React.FC = () => {
  const {
    isPhotoScannerOpen,
    setIsPhotoScannerOpen,
    selectedDate,
    refreshDailyLog,
    showToast,
  } = useApp();

  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [targetMeal, setTargetMeal] = useState<string>('Lunch');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isPhotoScannerOpen) return null;

  const sampleImages = [
    { label: 'South Indian Thali', url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80' },
    { label: 'Roti + Dal + Rice', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80' },
    { label: 'Grilled Chicken Bowl', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleStartScan = async (imageUrl?: string) => {
    setScanning(true);
    if (imageUrl) setSelectedImage(imageUrl);

    const result = await api.scanMealPhoto(imageUrl || 'sample');
    setScanResult(result.data);
    setScanning(false);
  };

  const handleSaveDetectedMeal = async () => {
    if (!scanResult || !scanResult.items) return;

    for (const item of scanResult.items) {
      await api.addMealItem(selectedDate, targetMeal, {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        fiber: item.fiber,
      });
    }

    await refreshDailyLog();
    showToast(`Logged ${scanResult.items.length} items from AI Photo Scan to ${targetMeal}!`);
    setIsPhotoScannerOpen(false);
    setScanResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                AI Meal Photo Scanner <Sparkles className="w-4 h-4 text-amber-300" />
              </h2>
              <p className="text-xs text-slate-400">Snap or upload a photo to estimate calories</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPhotoScannerOpen(false);
              setScanResult(null);
            }}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {!scanResult && !scanning ? (
            <div className="space-y-4">
              {/* Photo Upload Zone */}
              <div
                onClick={() => handleStartScan()}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-8 text-center bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Upload or Snap Meal Photo</h3>
                <p className="text-xs text-slate-400 mt-1">Tap to select photo from device gallery or camera</p>
              </div>

              {/* Quick Preset Demos */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Or test with demo meal photo:</div>
                <div className="grid grid-cols-3 gap-2">
                  {sampleImages.map((img) => (
                    <button
                      key={img.label}
                      onClick={() => handleStartScan(img.url)}
                      className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500 aspect-video transition-all text-left"
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-2 flex items-end">
                        <span className="text-[10px] font-bold text-white leading-tight">{img.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : scanning ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                Analyzing Meal Image... <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">Detecting dishes, estimating portions and calculating macros...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Scan Results Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Detected ({scanResult.confidence} Confidence)
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-1">{scanResult.detectedMeal}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-amber-400">Est. Calories</div>
                    <div className="text-sm font-extrabold text-white">{scanResult.estimatedCalorieRange}</div>
                  </div>
                </div>

                {/* Detected Items Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-400">Detected Items (Editable):</div>
                  {scanResult.items.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.quantity} {item.unit} • P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                        </div>
                      </div>
                      <div className="font-extrabold text-emerald-400">{item.calories} kcal</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer Badge */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Disclaimer:</strong> AI food photo nutrition estimates are approximate. You can review or adjust item quantities before saving to your daily log.
                </p>
              </div>

              {/* Select Target Meal */}
              <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-xl">
                <span className="text-xs font-semibold text-slate-300">Log items to:</span>
                <select
                  value={targetMeal}
                  onChange={(e) => setTargetMeal(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-bold focus:outline-none"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setScanResult(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Scan Another
                </button>
                <button
                  onClick={handleSaveDetectedMeal}
                  className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> Log to {targetMeal}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
