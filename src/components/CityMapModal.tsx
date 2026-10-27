import React, { useState } from 'react';
import { MapLocation } from '../types';
import { BEIKA_LOCATIONS } from '../data/mapData';
import { MapPin, Navigation, MessageCircle, X } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface CityMapModalProps {
  onSelectLocation: (locId: string) => void;
  onClose: () => void;
  isPixelBWMode?: boolean;
}

export const CityMapModal: React.FC<CityMapModalProps> = ({
  onSelectLocation,
  onClose,
  isPixelBWMode = true,
}) => {
  const [selectedLoc, setSelectedLoc] = useState<MapLocation>(BEIKA_LOCATIONS[0]);

  const mapImage = '/src/assets/images/beika_city_map_1792666678247.jpg';

  const handlePinClick = (loc: MapLocation) => {
    setSelectedLoc(loc);
    conanAudio.playClueFound();

    if (loc.id === 'LOC_MORI_AGENCY') {
      conanVoice.speak('KOGORO_NORMAL', loc.dialoguePreview);
    } else if (loc.id === 'LOC_POLICE_HQ') {
      conanVoice.speak('MEGURE', loc.dialoguePreview);
    } else if (loc.id === 'LOC_AGASA_LAB') {
      conanVoice.speak('AGASA', loc.dialoguePreview);
    } else {
      conanVoice.speak('CONAN', loc.dialoguePreview);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl h-[92vh] sm:h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-600/20 rounded-xl border border-blue-500/30">
              <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-bold text-white">Bản Đồ Thành Phố Beika</h2>
              <p className="text-[10px] sm:text-xs text-slate-400">Di chuyển nhanh giữa các cứ điểm</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Body: Split into Interactive Map & Location Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Interactive Map Visual */}
          <div className="lg:col-span-8 relative bg-slate-950 overflow-hidden flex items-center justify-center min-h-[240px] sm:min-h-[320px]">
            <img
              src={mapImage}
              alt="Bản đồ thành phố Beika Tokyo"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover select-none ${
                isPixelBWMode ? 'pixel-monochrome pixelated contrast-200 brightness-110' : ''
              }`}
            />
            {isPixelBWMode && (
              <div className="absolute inset-0 pixel-scanlines pointer-events-none opacity-40 z-10" />
            )}

            {/* Map Pins */}
            {BEIKA_LOCATIONS.map((loc) => {
              const isSelected = selectedLoc.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => handlePinClick(loc)}
                  style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none p-1 cursor-pointer touch-manipulation"
                >
                  <div
                    className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-xl shadow-red-950 scale-110 ring-2 ring-white'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-red-400'}`} />
                    <span>{loc.name}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Location Details & Fast Travel */}
          <div className="lg:col-span-4 p-4 sm:p-6 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono text-red-400 tracking-wider">
                  {selectedLoc.subtitle}
                </span>
                <h3 className="text-base sm:text-xl font-black text-white mt-0.5">
                  {selectedLoc.name}
                </h3>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                {selectedLoc.description}
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-400">
                  Nhân vật có mặt:
                </div>
                <div className="text-xs font-bold text-amber-400 p-2 bg-amber-950/30 border border-amber-500/20 rounded-lg">
                  👤 {selectedLoc.characterPresent}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Lời thoại nhân vật:</span>
                </div>
                <div className="text-[11px] sm:text-xs italic text-slate-200 p-2.5 bg-slate-950 border border-slate-800 rounded-xl leading-relaxed">
                  "{selectedLoc.dialoguePreview}"
                </div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4">
              <button
                onClick={() => {
                  onSelectLocation(selectedLoc.id);
                  onClose();
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/40 transition-all uppercase tracking-wider active:scale-95 cursor-pointer"
              >
                Di Chuyển Đến Địa Điểm Này
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
