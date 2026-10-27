import React, { useState } from 'react';
import { GameScreen, CaseData, DifficultyLevel } from './types';
import { CASES_LIST } from './data/casesData';
import { TopNav } from './components/TopNav';
import { TitleScreen } from './components/TitleScreen';
import { CrimeSceneView } from './components/CrimeSceneView';
import { EvidenceNotebook } from './components/EvidenceNotebook';
import { SuspectsDossier } from './components/SuspectsDossier';
import { InterrogationRoom } from './components/InterrogationRoom';
import { CityMapModal } from './components/CityMapModal';
import { RealTimePuzzleModal } from './components/RealTimePuzzleModal';
import { DeductionClimaxModal } from './components/DeductionClimaxModal';
import { EvidenceCustomizerModal } from './components/EvidenceCustomizerModal';
import { GadgetToolbar } from './components/GadgetToolbar';
import { ConanSoundtrackPlayer } from './components/ConanSoundtrackPlayer';
import { MusicManagerModal } from './components/MusicManagerModal';
import { conanAudio } from './audio/conanSoundEngine';
import { conanVoice } from './audio/voiceEngine';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('TITLE');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('EASY');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);
  const [cases, setCases] = useState<CaseData[]>(CASES_LIST);
  const [activeInterrogationSuspectId, setActiveInterrogationSuspectId] = useState<string>('SUSPECT_TATSUMI');
  
  // Custom evidence counts per case state
  const [customEvidenceCounts, setCustomEvidenceCounts] = useState<Record<string, number>>({});
  const [isEvidenceCustomizerOpen, setIsEvidenceCustomizerOpen] = useState<boolean>(false);

  // Modals & Gadget toggles
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [isPuzzleOpen, setIsPuzzleOpen] = useState<boolean>(false);
  const [isDeductionOpen, setIsDeductionOpen] = useState<boolean>(false);
  const [isMusicManagerOpen, setIsMusicManagerOpen] = useState<boolean>(false);
  const [isCaseSolvedModal, setIsCaseSolvedModal] = useState<boolean>(false);
  const [activeGlassesMode, setActiveGlassesMode] = useState<boolean>(false);
  const [isPixelBWMode, setIsPixelBWMode] = useState<boolean>(true);

  const rawActiveCase = cases[currentCaseIndex];

  // Dynamically derive active case with customized evidence count
  const activeCase = React.useMemo(() => {
    const customLimit = customEvidenceCounts[rawActiveCase.id] ?? rawActiveCase.evidence.length;
    if (customLimit >= rawActiveCase.evidence.length) {
      return rawActiveCase;
    }
    // Key evidence items prioritized first
    const sortedEv = [...rawActiveCase.evidence].sort((a, b) => (b.isKeyEvidence ? 1 : 0) - (a.isKeyEvidence ? 1 : 0));
    const activeEv = sortedEv.slice(0, customLimit);
    const activeEvIds = new Set(activeEv.map(e => e.id));

    const filteredHotspots = rawActiveCase.hotspots.map(h => {
      if (h.evidenceIdGranted && !activeEvIds.has(h.evidenceIdGranted)) {
        return {
          ...h,
          description: `${h.description} [Chế độ tùy chỉnh: Vị trí này không có vật chứng trong số ${customLimit} vật chứng đã chọn]`,
          evidenceIdGranted: undefined,
        };
      }
      return h;
    });

    return {
      ...rawActiveCase,
      evidence: activeEv,
      hotspots: filteredHotspots,
    };
  }, [rawActiveCase, customEvidenceCounts]);

  const handleUpdateCustomCount = (caseId: string, newCount: number) => {
    setCustomEvidenceCounts(prev => ({
      ...prev,
      [caseId]: newCount,
    }));
  };

  // Collect evidence handler
  const handleCollectEvidence = (evidenceId: string) => {
    setCases(prevCases => {
      const newCases = [...prevCases];
      const caseItem = { ...newCases[currentCaseIndex] };
      caseItem.evidence = caseItem.evidence.map(ev => {
        if (ev.id === evidenceId) {
          return { ...ev, collected: true };
        }
        return ev;
      });
      newCases[currentCaseIndex] = caseItem;
      return newCases;
    });
  };

  const collectedEvidenceCount = activeCase.evidence.filter(e => e.collected).length;
  const canDeduce = collectedEvidenceCount >= 3;

  // Interrogation routing
  const handleStartInterrogation = (suspectId: string) => {
    setActiveInterrogationSuspectId(suspectId);
    setCurrentScreen('INTERROGATION');
  };

  const activeSuspect = activeCase.suspects.find(s => s.id === activeInterrogationSuspectId) || activeCase.suspects[0];

  // City Map Location Travel
  const handleSelectMapLocation = (locId: string) => {
    setIsMapOpen(false);
    if (locId === 'LOC_CRIME_SCENE') {
      setCurrentScreen('CRIME_SCENE');
    } else if (locId === 'LOC_MORI_AGENCY' || locId === 'LOC_POLICE_HQ') {
      setCurrentScreen('SUSPECTS');
    } else {
      setCurrentScreen('CRIME_SCENE');
    }
  };

  // Puzzle success
  const handlePuzzleSuccess = () => {
    setIsPuzzleOpen(false);
    handleCollectEvidence('EVD_HIDDEN_SAFE_DOCS');
  };

  // Case solved handler
  const handleCaseSolved = () => {
    setIsDeductionOpen(false);
    setIsCaseSolvedModal(true);
    conanAudio.playEpiphany();
    conanVoice.speak('CONAN', 'Chúc mừng bạn! Vụ án căn phòng khóa kín tại khách sạn Beika đã được phá giải hoàn hảo!');
  };

  const handleNextCase = () => {
    setIsCaseSolvedModal(false);
    if (currentCaseIndex < cases.length - 1) {
      setCurrentCaseIndex(prev => prev + 1);
      setCurrentScreen('CRIME_SCENE');
      conanAudio.playBgm('THEME');
    } else {
      setCurrentCaseIndex(0);
      setCurrentScreen('TITLE');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none pb-28 lg:pb-16">
      {/* Top Navigation */}
      <TopNav
        currentScreen={currentScreen}
        setScreen={(screen) => {
          if (screen === 'MAP') {
            setIsMapOpen(true);
          } else {
            setCurrentScreen(screen);
          }
        }}
        evidenceCount={collectedEvidenceCount}
        totalEvidence={activeCase.evidence.length}
        onOpenDeduction={() => setIsDeductionOpen(true)}
        onOpenMusicManager={() => setIsMusicManagerOpen(true)}
        onOpenCustomizerModal={() => setIsEvidenceCustomizerOpen(true)}
        canDeduce={canDeduce}
        isPixelBWMode={isPixelBWMode}
        onTogglePixelBWMode={() => setIsPixelBWMode(prev => !prev)}
      />

      {/* Main Screen Router */}
      <main className="flex-1">
        {currentScreen === 'TITLE' && (
          <TitleScreen
            cases={cases}
            selectedCase={activeCase}
            onSelectCase={(c) => {
              const idx = cases.findIndex(item => item.id === c.id);
              if (idx !== -1) setCurrentCaseIndex(idx);
            }}
            onStartGame={() => setCurrentScreen('CRIME_SCENE')}
            onOpenMusicManager={() => setIsMusicManagerOpen(true)}
            difficulty={difficulty}
            onSelectDifficulty={setDifficulty}
            isPixelBWMode={isPixelBWMode}
            customEvidenceCounts={customEvidenceCounts}
            onUpdateCustomCount={handleUpdateCustomCount}
            onOpenCustomizerModal={() => setIsEvidenceCustomizerOpen(true)}
          />
        )}

        {currentScreen === 'CRIME_SCENE' && (
          <CrimeSceneView
            currentCase={activeCase}
            hotspots={activeCase.hotspots}
            evidenceList={activeCase.evidence}
            activeGlassesMode={activeGlassesMode}
            onCollectEvidence={handleCollectEvidence}
            onOpenPuzzle={() => setIsPuzzleOpen(true)}
            isPixelBWMode={isPixelBWMode}
          />
        )}

        {currentScreen === 'EVIDENCE' && (
          <EvidenceNotebook
            evidenceList={activeCase.evidence}
            suspects={activeCase.suspects}
            difficulty={difficulty}
            onNavigateToInterrogation={handleStartInterrogation}
          />
        )}

        {currentScreen === 'SUSPECTS' && (
          <SuspectsDossier
            suspects={activeCase.suspects}
            difficulty={difficulty}
            onStartInterrogation={handleStartInterrogation}
          />
        )}

        {currentScreen === 'INTERROGATION' && (
          <InterrogationRoom
            suspect={activeSuspect}
            evidenceList={activeCase.evidence}
            difficulty={difficulty}
            onBack={() => setCurrentScreen('SUSPECTS')}
            onSolveCasePrompt={() => setIsDeductionOpen(true)}
            isPixelBWMode={isPixelBWMode}
          />
        )}
      </main>

      {/* Gadget Toolbar (Always accessible during play) */}
      {currentScreen !== 'TITLE' && (
        <GadgetToolbar
          activeGlassesMode={activeGlassesMode}
          onToggleGlasses={() => {
            conanAudio.playEpiphany();
            setActiveGlassesMode(!activeGlassesMode);
          }}
          onUseStunDart={() => setIsDeductionOpen(true)}
        />
      )}

      {/* Movie 29 Soundtrack & Voice Equalizer Player */}
      <ConanSoundtrackPlayer
        onOpenMusicManager={() => setIsMusicManagerOpen(true)}
      />

      {/* Custom Music Manager Modal */}
      <MusicManagerModal
        isOpen={isMusicManagerOpen}
        onClose={() => setIsMusicManagerOpen(false)}
      />

      {/* City Map Modal */}
      {isMapOpen && (
        <CityMapModal
          onSelectLocation={handleSelectMapLocation}
          onClose={() => setIsMapOpen(false)}
          isPixelBWMode={isPixelBWMode}
        />
      )}

      {/* Real-time Puzzle Modal */}
      {isPuzzleOpen && (
        <RealTimePuzzleModal
          puzzleData={activeCase.realTimePuzzle}
          difficulty={difficulty}
          onSuccess={handlePuzzleSuccess}
          onClose={() => setIsPuzzleOpen(false)}
        />
      )}

      {/* Deduction Climax Modal */}
      {isDeductionOpen && (
        <DeductionClimaxModal
          currentCase={activeCase}
          onCaseSolved={handleCaseSolved}
          onClose={() => setIsDeductionOpen(false)}
        />
      )}

      {/* Case Solved Victory Celebration Modal */}
      {isCaseSolvedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-xl animate-bounce">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                PHÁ GIẢI HOÀN TẤT VỤ ÁN #{activeCase.caseNumber} · {difficulty === 'EASY' ? 'MỨC ĐỘ DỄ' : 'MỨC ĐỘ KHÓ'}
              </div>
              <h2 className="text-2xl font-black text-white">
                XUẤT SẮC! BẠN LÀ THÁM TỬ LỪNG DANH!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                {activeCase.caseNumber === 1 && 'Tatsumi Ryuichi đã bị áp giải về Sở Cảnh sát Tokyo. Toàn bộ mánh khóe căn phòng khóa kín bằng sợi cước và khối đá lạnh đã được vạch trần trước sự thán phục của Thanh tra Megure và chú Mori!'}
                {activeCase.caseNumber === 2 && 'Quả bom hẹn giờ tại Tháp Tokyo đã được tháo ngòi thành công. Bài thơ Haiku bí mật và kẻ đánh bom đã hoàn toàn quy phục trước trí tuệ của Conan!'}
                {activeCase.caseNumber === 3 && 'Shindo Ren đã phải cúi đầu nhận tội. Viên hồng ngọc Huyết Nguyệt trong chiếc chuông gió đồng và thủ đoạn chén trà bọc sáp độc đã được phơi bày trọn vẹn!'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  setIsCaseSolvedModal(false);
                  setCurrentScreen('TITLE');
                }}
                className="flex items-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 uppercase tracking-wider transition-all"
              >
                <span>Về Trang Chủ Chọn Vụ Án</span>
              </button>

              {currentCaseIndex < cases.length - 1 ? (
                <button
                  onClick={handleNextCase}
                  className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/40 uppercase tracking-wider transition-all"
                >
                  <span>Vụ Án Tiếp Theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNextCase}
                  className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/40 uppercase tracking-wider transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi Lại Từ Đầu</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Evidence Customizer Modal */}
      <EvidenceCustomizerModal
        isOpen={isEvidenceCustomizerOpen}
        onClose={() => setIsEvidenceCustomizerOpen(false)}
        selectedCase={rawActiveCase}
        customCount={customEvidenceCounts[rawActiveCase.id] ?? rawActiveCase.evidence.length}
        onUpdateCustomCount={handleUpdateCustomCount}
        isPixelBWMode={isPixelBWMode}
      />
    </div>
  );
}
