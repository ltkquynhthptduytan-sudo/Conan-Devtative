import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Zap, 
  Shield, 
  Search, 
  Scissors, 
  Wrench, 
  Dna, 
  Snowflake, 
  Microscope, 
  Volume2, 
  Crosshair, 
  CheckCircle2, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { ShopItem, ShopItemTier } from '../types';
import { SHOP_ITEMS } from '../data/shopData';
import { DETECTIVE_CHARACTERS, DetectiveCharacter } from '../data/charactersData';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface DetectiveShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  conanCoins: number;
  purchasedItemIds: string[];
  equippedItemsMap: Record<string, string[]>; // characterId -> itemIds
  selectedCharacter: DetectiveCharacter;
  onBuyItem: (item: ShopItem) => void;
  onEquipItem: (characterId: string, itemId: string) => void;
  onUnequipItem: (characterId: string, itemId: string) => void;
}

export const DetectiveShopModal: React.FC<DetectiveShopModalProps> = ({
  isOpen,
  onClose,
  conanCoins,
  purchasedItemIds,
  equippedItemsMap,
  selectedCharacter,
  onBuyItem,
  onEquipItem,
  onUnequipItem,
}) => {
  const [activeTierFilter, setActiveTierFilter] = useState<string>('ALL');
  const [activeCharFilter, setActiveCharFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scissors': return <Scissors className="w-6 h-6 text-emerald-400" />;
      case 'Search': return <Search className="w-6 h-6 text-blue-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Shield': return <Shield className="w-6 h-6 text-cyan-400" />;
      case 'Volume2': return <Volume2 className="w-6 h-6 text-purple-400" />;
      case 'Crosshair': return <Crosshair className="w-6 h-6 text-red-400" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-orange-400" />;
      case 'Dna': return <Dna className="w-6 h-6 text-pink-400" />;
      case 'Snowflake': return <Snowflake className="w-6 h-6 text-sky-300" />;
      case 'Microscope': return <Microscope className="w-6 h-6 text-indigo-400" />;
      default: return <ShoppingBag className="w-6 h-6 text-slate-400" />;
    }
  };

  const getTierBadge = (tier: ShopItemTier) => {
    switch (tier) {
      case 'LOW':
        return <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold rounded">Thấp (+0.5s)</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-700/60 text-[10px] font-bold rounded">Trung (+1.0s)</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-700/60 text-[10px] font-bold rounded">Cao (+1.5s)</span>;
      case 'LEGENDARY':
        return <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/80 text-[10px] font-bold rounded flex items-center gap-1"><Sparkles className="w-3 h-3 text-purple-400" /> Huyền Thoại (+2.0s)</span>;
    }
  };

  const filteredItems = SHOP_ITEMS.filter(item => {
    if (activeTierFilter !== 'ALL' && item.tier !== activeTierFilter) return false;
    if (activeCharFilter !== 'ALL') {
      if (item.compatibleCharacterId && item.compatibleCharacterId !== 'ALL' && item.compatibleCharacterId !== activeCharFilter) {
        return false;
      }
    }
    return true;
  });

  const activeCharEquippedIds = equippedItemsMap[selectedCharacter.id] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-2xl">
              <ShoppingBag className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                CỬA HÀNG BẢO BỐI THÁM TỬ · TRANG BỊ VẬT PHẨM
              </div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Cửa Hàng Vật Phẩm & Bảo Bối
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-900 border border-amber-500/40 rounded-2xl flex items-center gap-2 shadow-inner">
              <span className="text-base">🪙</span>
              <span className="text-sm font-extrabold text-amber-400 font-mono">{conanCoins} Xu</span>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Character Bar & Filters */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 bg-slate-900/80 p-2.5 px-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">Trang bị cho:</span>
              <span className="text-xs font-black text-red-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-red-400" />
                {selectedCharacter.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                ({activeCharEquippedIds.length} item đã trang bị)
              </span>
            </div>

            {/* Character filter selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveCharFilter('ALL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeCharFilter === 'ALL'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tất Cả Nhân Vật
              </button>
              {DETECTIVE_CHARACTERS.map(char => (
                <button
                  key={char.id}
                  onClick={() => setActiveCharFilter(char.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeCharFilter === char.id
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {char.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Tier Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-mono text-slate-500 mr-1">Cấp độ:</span>
            {[
              { key: 'ALL', label: 'Tất Cả' },
              { key: 'LOW', label: 'Giá Thấp (+0.5s)' },
              { key: 'MEDIUM', label: 'Trung Cấp (+1.0s)' },
              { key: 'HIGH', label: 'Cao Cấp (+1.5s)' },
              { key: 'LEGENDARY', label: 'Huyền Thoại (+2.0s)' },
            ].map(tier => (
              <button
                key={tier.key}
                onClick={() => setActiveTierFilter(tier.key)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTierFilter === tier.key
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Item Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => {
            const isPurchased = purchasedItemIds.includes(item.id);
            const isEquipped = activeCharEquippedIds.includes(item.id);
            const canAfford = conanCoins >= item.price;
            const compatibleChar = DETECTIVE_CHARACTERS.find(c => c.id === item.compatibleCharacterId);

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isEquipped
                    ? 'bg-gradient-to-br from-amber-950/30 to-slate-900 border-amber-500/70 shadow-lg shadow-amber-950/20'
                    : isPurchased
                    ? 'bg-slate-900/90 border-slate-700'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        {getIcon(item.iconName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{item.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getTierBadge(item.tier)}
                          {compatibleChar && (
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                              Dành cho {compatibleChar.name.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!isPurchased && (
                      <div className="text-right">
                        <span className="text-xs font-mono font-extrabold text-amber-400">
                          🪙 {item.price} Xu
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-2.5 bg-slate-950/90 rounded-xl border border-slate-800/80 text-xs text-amber-300/90 font-mono">
                    ⚡ High-Tech Bonus: {item.bonusDescription}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {isPurchased ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Đã Sở Hữu
                      </span>

                      {isEquipped ? (
                        <button
                          onClick={() => {
                            onUnequipItem(selectedCharacter.id, item.id);
                            conanAudio.playClueFound();
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-700"
                        >
                          Tháo Item
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onEquipItem(selectedCharacter.id, item.id);
                            conanAudio.playEpiphany();
                            conanVoice.speak('CONAN', `Đã trang bị ${item.name} cho ${selectedCharacter.name}!`);
                          }}
                          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all cursor-pointer shadow-md"
                        >
                          Trang Bị Vô Slot
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          onBuyItem(item);
                          conanAudio.playEpiphany();
                          conanVoice.speak('CONAN', `Đã mua ${item.name} thành công!`);
                        }
                      }}
                      disabled={!canAfford}
                      className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        canAfford
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/40'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <span>Mua Bằng 🪙 {item.price} Xu</span>
                        </>
                      ) : (
                        <span>Thiếu {item.price - conanCoins} Xu Conan</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
