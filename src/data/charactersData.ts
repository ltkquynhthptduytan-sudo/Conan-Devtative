import conanImg from '../assets/images/conan_avatar_1793273319523.jpg';
import kaitoKidImg from '../assets/images/kaito_kid_avatar_1793273238147.jpg';
import heijiImg from '../assets/images/heiji_avatar_1793273252741.jpg';
import shinichiImg from '../assets/images/shinichi_avatar_1793273266344.jpg';
import kogoroImg from '../assets/images/kogoro_avatar_1793273277962.jpg';
import amuroImg from '../assets/images/amuro_avatar_1793273292655.jpg';
import haibaraImg from '../assets/images/haibara_avatar_1793273306004.jpg';

export interface DetectiveCharacter {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatarUrl: string;
  avatarSeed: string;
  bonusTitle: string;
  bonusDesc: string;
  extraTimeSeconds: number;
  maxManualViews: number;
  badgeBg: string;
  borderColor: string;
  accentColor: string;
  price: number; // Conan Coins cost to buy
}

export const DETECTIVE_CHARACTERS: DetectiveCharacter[] = [
  {
    id: 'CHAR_CONAN',
    name: 'Edogawa Conan',
    title: 'Thám Tử Nhí Lừng Danh',
    quote: 'Chân tướng sự thật luôn chỉ có một!',
    avatarUrl: conanImg,
    avatarSeed: 'conan',
    bonusTitle: 'Bảo Bối Kính Định Vị Agasa',
    bonusDesc: '+10s thời gian giải đố mật mã & gỡ bom khẩn cấp.',
    extraTimeSeconds: 10,
    maxManualViews: 1,
    badgeBg: 'bg-blue-950/80 text-blue-300',
    borderColor: 'border-blue-500',
    accentColor: 'text-blue-400',
    price: 0, // Mặc định miễn phí
  },
  {
    id: 'CHAR_KAITO_KID',
    name: 'Kaito Kid (Kuroba Kaito)',
    title: 'Siêu Trộm 1412 Dưới Ánh Trăng',
    quote: 'Tên trộm là một nghệ sĩ sáng tạo, còn thám tử chỉ là kẻ đi sau bình luận...',
    avatarUrl: kaitoKidImg,
    avatarSeed: 'kaito_kid',
    bonusTitle: 'Ảo Thuật Bắn Bài & Trốn Chạy',
    bonusDesc: '+20s thời gian gỡ bom & Cho phép xem sổ gỡ bom 2 LẦN!',
    extraTimeSeconds: 20,
    maxManualViews: 2,
    badgeBg: 'bg-sky-950/80 text-sky-300',
    borderColor: 'border-sky-400',
    accentColor: 'text-sky-300',
    price: 300, // 300 Xu Conan
  },
  {
    id: 'CHAR_HEIJI',
    name: 'Hattori Heiji',
    title: 'Thám Tử Trung Học Miền Tây',
    quote: 'Thám tử Osaka Kanto không bao giờ chịu thua!',
    avatarUrl: heijiImg,
    avatarSeed: 'heiji',
    bonusTitle: 'Phản Xạ Kendo Miền Tây',
    bonusDesc: '+15s thời gian tháo ngòi nổ bom khẩn cấp.',
    extraTimeSeconds: 15,
    maxManualViews: 1,
    badgeBg: 'bg-amber-950/80 text-amber-300',
    borderColor: 'border-amber-500',
    accentColor: 'text-amber-400',
    price: 100,
  },
  {
    id: 'CHAR_SHINICHI',
    name: 'Kudo Shinichi',
    title: 'Thám Tử Học Sinh Kanto',
    quote: 'Khi loại trừ những điều vô lý, cái còn lại dù phi lý đến đâu cũng là sự thật!',
    avatarUrl: shinichiImg,
    avatarSeed: 'shinichi',
    bonusTitle: 'Suy Luận Sắc Bén',
    bonusDesc: '+10s thời gian & tăng độ chuẩn xác gợi ý hiện trường.',
    extraTimeSeconds: 10,
    maxManualViews: 1,
    badgeBg: 'bg-indigo-950/80 text-indigo-300',
    borderColor: 'border-indigo-500',
    accentColor: 'text-indigo-400',
    price: 100,
  },
  {
    id: 'CHAR_KOGORO',
    name: 'Mouri Kogoro',
    title: 'Thám Tử Lừng Danh Ngủ Gật',
    quote: 'Hahahahaha! Mouri Kogoro đại thám tử xuất chiêu!',
    avatarUrl: kogoroImg,
    avatarSeed: 'kogoro',
    bonusTitle: 'Thần May Mắn Ngủ Gật',
    bonusDesc: 'Được xem Sổ Hướng Dẫn Gỡ Bom 2 LẦN (Tăng thêm 1 lần xem).',
    extraTimeSeconds: 5,
    maxManualViews: 2,
    badgeBg: 'bg-emerald-950/80 text-emerald-300',
    borderColor: 'border-emerald-500',
    accentColor: 'text-emerald-400',
    price: 100,
  },
  {
    id: 'CHAR_AMURO',
    name: 'Amuro Tooru (Bourbon)',
    title: 'Mật Vụ PSB & Áo Đen',
    quote: 'Đất nước này chính là người tình của tôi!',
    avatarUrl: amuroImg,
    avatarSeed: 'amuro',
    bonusTitle: 'Kỹ Năng Mật Vụ Bậc Thầy',
    bonusDesc: '+10s gỡ bom & Giảm 20% thời gian hình phạt khi sai.',
    extraTimeSeconds: 10,
    maxManualViews: 1,
    badgeBg: 'bg-amber-950/80 text-yellow-300',
    borderColor: 'border-yellow-500',
    accentColor: 'text-yellow-400',
    price: 200,
  },
  {
    id: 'CHAR_HAIBARA',
    name: 'Haibara Ai',
    title: 'Cựu Nhà Khoa Học Áo Đen',
    quote: 'Con người không thể chống lại dòng chảy của thời gian...',
    avatarUrl: haibaraImg,
    avatarSeed: 'haibara',
    bonusTitle: 'Phân Tích Hóa Chất APTX',
    bonusDesc: '+10s thời gian & Giảm tác động khi bom chập điện.',
    extraTimeSeconds: 10,
    maxManualViews: 1,
    badgeBg: 'bg-rose-950/80 text-rose-300',
    borderColor: 'border-rose-500',
    accentColor: 'text-rose-400',
    price: 200,
  },
];
