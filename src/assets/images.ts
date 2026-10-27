import heroImg from './images/conan_deduction_hero_1792666677871.jpg';
import mansionImg from './images/crime_scene_mansion_1792666677757.jpg';
import towerImg from './images/crime_scene_tower_1792669417590.jpg';
import teahouseImg from './images/crime_scene_teahouse_1792669419005.jpg';
import cityMapImg from './images/beika_city_map_1792666678247.jpg';
import interrogationImg from './images/suspects_interrogation_1792666678276.jpg';

export const GAME_IMAGES = {
  hero: heroImg,
  mansion: mansionImg,
  tower: towerImg,
  teahouse: teahouseImg,
  cityMap: cityMapImg,
  interrogation: interrogationImg,
};

export function getCrimeSceneImage(caseId: string, customPath?: string): string {
  if (caseId === 'CASE_01_LOCKED_ROOM') return mansionImg;
  if (caseId === 'CASE_02_TOKYO_TOWER') return towerImg;
  if (caseId === 'CASE_03_WIND_CHIME') return teahouseImg;

  if (customPath) {
    if (customPath.includes('mansion')) return mansionImg;
    if (customPath.includes('tower')) return towerImg;
    if (customPath.includes('teahouse')) return teahouseImg;
    if (customPath.startsWith('/') && !customPath.startsWith('/src')) {
      return customPath;
    }
  }

  return mansionImg;
}
