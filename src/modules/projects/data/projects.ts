import {
  Globe,
  Layers,
  Palette,
  Rocket,
  Settings2,
  ShieldCheck,
  TabletSmartphone,
  Wallet,
  Wrench,
  Zap,
} from 'lucide-react';

import type { AppIcon } from '@/config/icons';

export type DetailCategory = {
  title: string;
  icon: AppIcon;
  items: string[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  role: string;
  period: string;
  techStack: string[];
  link?: string;
  playStoreLink?: string;
  highlight?: boolean;
  detailCategories: DetailCategory[];
};

export const projects: Project[] = [
  {
    id: 'credhr',
    name: 'CredHR — Quản Lý Nhân Sự Nội Bộ Enterprise',
    description:
      'Ứng dụng quản lý nhân sự bảo mật cao. Viết Native Code Kotlin (Android) & Swift (iOS) cho ForgeRock IAM, xác thực Vân tay (Biometric), nhúng Web Controller và tích hợp bản đồ Goong Maps API check-in địa điểm.',
    role: 'Mobile Developer (Flutter)',
    period: '01/2026 – Hiện tại',
    techStack: [
      'Flutter',
      'Native Swift',
      'Native Kotlin',
      'ForgeRock IAM',
      'Biometrics',
      'Goong Maps API',
      'Firebase',
      'Web Controller',
    ],
    playStoreLink: 'https://play.google.com/store/apps/details?id=hrm.thaithinhmedic.vn',
    highlight: true,
    detailCategories: [
      {
        title: 'Bảo mật & Xác thực',
        icon: ShieldCheck,
        items: [
          'Tích hợp ForgeRock IAM thông qua Native code (Swift/Kotlin)',
          'Đăng nhập sinh trắc học (Biometrics)',
        ],
      },
      {
        title: 'Build Variants & Flavors',
        icon: Settings2,
        items: [
          '3 flavors: Dev, Staging, Prod',
          'Mỗi flavor × 2 build types (Release, Bundle) = 6 variants',
        ],
      },
      {
        title: 'Firebase & Goong Maps',
        icon: Wrench,
        items: [
          'Firebase config tách biệt theo từng flavor',
          'Goong Maps xử lý nghiệp vụ vị trí',
        ],
      },
      {
        title: 'UI/Webview & Deployment',
        icon: Rocket,
        items: [
          'Giao tiếp app ↔ web qua Web Controller',
          'Build & đẩy lên App Store / Google Play',
        ],
      },
    ],
  },
  {
    id: 'eatsy',
    name: 'Eatsy — Health & Nutrition App (800k+ downloads)',
    description:
      'Dev chính ứng dụng mobile về sức khỏe & dinh dưỡng phục vụ 800,000+ lượt tải. Trực tiếp kéo Figma ra giao diện, tối ưu animation, xử lý thanh toán QR và monetization (IAA/IAP).',
    role: 'React Native Developer (Dev chính)',
    period: '08/2023 – 12/2025',
    techStack: [
      'React Native',
      'TypeScript',
      'Redux (Saga)',
      'Zustand',
      'TanStack Query',
      'React Hook Form',
      'Zod',
    ],
    link: 'https://eatsyvn.app.link/QaUq7EJsttb',
    highlight: true,
    detailCategories: [
      {
        title: 'Kiến trúc & State',
        icon: Layers,
        items: [
          'TypeScript strict, Redux Saga, Zustand, Context API, TanStack Query',
        ],
      },
      {
        title: 'UI & Design (Figma)',
        icon: Palette,
        items: [
          'Trực tiếp kéo Figma → UI pixel-perfect',
          'Tối ưu animation, gesture-handler',
        ],
      },
      {
        title: 'Performance',
        icon: Zap,
        items: [
          'FlatList optimize, pagination, autoFocus scroll infinity',
        ],
      },
      {
        title: 'Network & API',
        icon: Globe,
        items: [
          'Axios, AbortController, Race Conditions, Search Cache',
        ],
      },
      {
        title: 'Native Modules',
        icon: TabletSmartphone,
        items: [
          'Splash Screen native, Widgets (WidgetKit/Glance), Notifee FCM',
        ],
      },
      {
        title: 'Payment & Monetization',
        icon: Wallet,
        items: [
          'Thanh toán QR, In-App Advertising (IAA), In-App Purchase (IAP)',
        ],
      },
    ],
  },
];
