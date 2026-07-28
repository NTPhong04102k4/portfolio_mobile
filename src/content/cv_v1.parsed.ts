export const cvV1Data = {
  intro:
    'Mobile Developer với chuyên môn sâu về React Native & Flutter, giàu kinh nghiệm phát triển Native Code (Kotlin & Swift). Đã phát triển thành công CredHR (Ứng dụng Quản lý nhân sự tích hợp ForgeRock IAM, Biometric, Goong Maps) và Eatsy (500k+ người dùng).',
  profile: {
    title: 'Mobile Developer (React Native / Flutter / Native Swift & Kotlin)',
    company: 'CredHR & Eatsy JSC',
    location: 'Hà Nội',
  },
  skills: {
    mobile: [
      'Native Development (Swift & Kotlin) — Chuyên sâu Native Bridge, Biometrics, WidgetKit & Jetpack Glance',
      'React Native (Bare Workflow) — Architecture, Custom Native Modules, Bridge API, Performance Tuning',
      'Flutter & GetX — Quản lý state GetX, Reactive programming, Custom Widgets',
      'Embedded Web Controller — Nhúng WebView giao tiếp 2 chiều với Native App',
    ],
    stateAndData: [
      'GetX (Flutter) / Zustand (React Native) — Global State Management, Dependency Injection',
      'Redux, Redux Saga, Context API',
      'REST API & WebSockets — Interceptors, Map API Key, Axios / Dio',
    ],
    authAndIntegration: [
      'ForgeRock IAM — Hệ thống quản lý định danh & xác thực doanh nghiệp cao cấp',
      'Biometric Authentication — Đăng nhập Vân tay (Fingerprint) & FaceID qua Native Code',
      'Goong Maps API — Tích hợp bản đồ Việt Nam, xử lý Geocoding & Map API Key check-in',
      'OAuth 2.0 / Social Login — Facebook SDK, Google Sign-In, Token Lifecycle',
    ],
    performance: [
      'FlatList & ListView Optimization — Memory profiling, keyExtractor, getItemLayout, memo',
      'Native Performance Profiling — Xcode Instruments, Android Profiler, Flipper',
      'Refactoring & Clean Code — SOLID, Clean Architecture',
    ],
    tools: [
      'Xcode / Android Studio / VS Code / Cursor AI',
      'Git / GitHub Flow — Branching strategy, Code Review',
      'Agile / Scrum — Daily standup, Task Estimation',
    ],
  },

  // ── CredHR ────────────────────────────────────────────────────────────
  experience: {
    company: 'CredHR — App Quản Lý Nhân Sự Nội Bộ',
    role: 'Mobile Developer (Flutter)',
    period: '01/2026 – Hiện tại',
    location: 'Hà Nội',
    techStack: ['Flutter', 'Swift', 'Kotlin', 'ForgeRock IAM', 'Goong Maps', 'Firebase'],
    summary:
      'Phát triển CredHR - ứng dụng quản lý nhân sự nội bộ doanh nghiệp. Chịu trách nhiệm trực tiếp viết Native Code Swift & Kotlin cho các module bảo mật cao (ForgeRock IAM, Vân tay), tích hợp Flutter GetX và bản đồ Goong Maps.',
    playStoreLink: 'https://play.google.com/store/apps/details?id=hrm.thaithinhmedic.vn',

    detailCategories: [
      {
        title: 'Bảo mật & Xác thực (Authentication)',
        icon: '🔐',
        items: [
          'Tích hợp hệ thống quản lý định danh ForgeRock IAM thông qua giao tiếp với Native code (Swift cho iOS và Kotlin cho Android)',
          'Triển khai tính năng đăng nhập bằng sinh trắc học (Biometrics) để tăng cường bảo mật và trải nghiệm người dùng',
        ],
      },
      {
        title: 'Build Variants & Flavors',
        icon: '⚙️',
        items: [
          'Thiết lập và chia các môi trường (flavors) bài bản: Dev, Staging, Prod',
          'Mỗi flavor chia thành 2 build types: Release và Bundle',
          'Tổng cộng 6 build variants: DevRelease, DevBundle, StagingRelease, StagingBundle, ProdRelease, ProdBundle',
        ],
      },
      {
        title: 'Cấu hình Dịch vụ bên thứ 3',
        icon: '🔧',
        items: [
          'Tách biệt cấu hình Firebase tương ứng cho từng môi trường (flavor) để đảm bảo an toàn dữ liệu',
          'Tích hợp bản đồ số Goong Maps để xử lý các nghiệp vụ liên quan đến vị trí',
        ],
      },
      {
        title: 'UI & Webview',
        icon: '📱',
        items: [
          'Xử lý và đồng bộ giao tiếp giữa app và nền tảng web thông qua Web Controller',
          'Xây dựng module UI động bằng Flutter & GetX state management',
        ],
      },
      {
        title: 'Triển khai (Deployment)',
        icon: '🚀',
        items: [
          'Chịu trách nhiệm build, cấu hình chứng chỉ và đẩy ứng dụng lên App Store và Google Play',
          'Ứng dụng nội bộ cho nhân viên công ty Thai Thinh Medic',
        ],
      },
    ],

    // Legacy flat arrays kept for backward compatibility
    features: [
      'Phát triển Module Xác thực ForgeRock IAM bằng Native Code Kotlin (Android) và Swift (iOS), hỗ trợ Single Sign-On (SSO) doanh nghiệp',
      'Tích hợp Sinh trắc học Biometric (Vân tay & TouchID/FaceID) thông qua Native Bridge với độ an toàn cao',
      'Tích hợp Goong Maps API (xử lý Map API Key, Geocoding, định vị check-in địa điểm chấm công nhân sự)',
      'Xây dựng module UI động bằng Flutter & GetX state management, nhúng Web Controller (WebView) giao tiếp 2 chiều',
    ],
    apiAndData: [
      'Quản lý Map API Key linh hoạt cho Goong Maps, bảo mật token endpoint ForgeRock',
      'Xử lý Web Controller bridge truyền nhận dữ liệu giữa Web và Native App',
    ],
    nativeAndPerf: [
      'Viết 100% Native Code (Kotlin & Swift) cho phần core Auth, Biometrics và Location Tracking',
      'Tối ưu hóa thời gian khởi động ứng dụng và khả năng phản hồi khi xác thực vân tay',
    ],
    testingAndRelease: [
      'Kiểm thử bảo mật định danh nội bộ, phân phối bản build thử nghiệm cho doanh nghiệp',
    ],
  },

  // ── Eatsy ─────────────────────────────────────────────────────────────
  previousExperience: {
    company: 'Eatsy JSC — Ứng dụng Sức Khỏe & Dinh Dưỡng',
    role: 'React Native Developer (Dev chính)',
    period: '08/2023 – 12/2025',
    location: 'Hà Nội',
    techStack: [
      'React Native',
      'TypeScript',
      'Redux (Saga)',
      'Zustand',
      'Context API',
      'TanStack Query',
      'React Hook Form',
      'Zod',
    ],
    summary:
      'Dev chính phát triển ứng dụng mobile phục vụ hơn 500,000 người dùng trên iOS & Android — trực tiếp kéo Figma ra giao diện, tối ưu animation, xử lý thanh toán QR và monetization (IAA/IAP).',

    detailCategories: [
      {
        title: 'Kiến trúc & Quản lý State',
        icon: '🏗️',
        items: [
          'Tuân thủ chặt chẽ tiêu chuẩn TypeScript trong toàn bộ dự án',
          'Redux & Redux Saga cho logic phức tạp',
          'Zustand và Context API cho global state nhẹ gọn',
          'TanStack Query để quản lý server state hiệu quả',
        ],
      },
      {
        title: 'UI & Design (Figma → Code)',
        icon: '🎨',
        items: [
          'Trực tiếp kéo Figma ra giao diện pixel-perfect',
          'Tối ưu animation mượt mà với react-native-reanimated',
          'Xử lý các tương tác vuốt/chạm phức tạp với react-native-gesture-handler',
        ],
      },
      {
        title: 'Tối ưu hóa Hiệu năng (Performance)',
        icon: '⚡',
        items: [
          'Tối ưu hóa hiển thị danh sách lớn (FlatList) với pagination mượt mà',
          'AutoFocus khi thực hiện scroll infinity',
          'Xây dựng hiệu ứng chuyển động (animations) native-like',
        ],
      },
      {
        title: 'Tối ưu hóa Mạng & API',
        icon: '🌐',
        items: [
          'Xử lý API qua Axios, kiểm soát chặt chẽ luồng dữ liệu bằng AbortController',
          'Xử lý triệt để tình trạng Race Conditions',
          'Tự xây dựng cơ chế Search Cache để giảm tải cho server',
        ],
      },
      {
        title: 'Native & Native Modules',
        icon: '📲',
        items: [
          'Viết code Native xử lý Splash Screen',
          'Tích hợp Native Widgets (Swift WidgetKit & Kotlin Glance)',
          'Triển khai Push Notifications qua Notifee FCM',
        ],
      },
      {
        title: 'Xác thực & Form',
        icon: '🔑',
        items: [
          'Tích hợp đăng nhập mạng xã hội (OAuth2) qua Facebook và Google',
          'Xử lý forms phức tạp kết hợp validation chặt chẽ bằng React Hook Form và Zod',
        ],
      },
      {
        title: 'Thanh toán & Monetization',
        icon: '💰',
        items: [
          'Xử lý thanh toán QR trong ứng dụng',
          'Tích hợp In-App Advertising (IAA)',
          'Triển khai In-App Purchase (IAP)',
        ],
      },
    ],
  },

  project: {
    name: 'CredHR — Quản Lý Nhân Sự Nội Bộ Enterprise',
    platform: 'iOS & Android (Flutter, Native Kotlin/Swift)',
    backend: 'Node.js / ForgeRock IAM',
    database: 'PostgreSQL / Secure Storage',
    scale: 'Dùng nội bộ Doanh Nghiệp',
    features: [
      'Xác thực ForgeRock IAM & Sinh trắc học Vân tay',
      'Goong Maps API Check-in địa điểm nhân sự',
      'Flutter GetX & Nhúng Web Controller',
      'Build Variants: 6 variants (Dev/Staging/Prod × Release/Bundle)',
    ],
    link: 'https://play.google.com/store/apps/details?id=hrm.thaithinhmedic.vn',
  },
  goals: {
    shortTerm:
      'Làm chủ toàn bộ hệ sinh thái Mobile bao gồm React Native, Flutter và đặc biệt là Native Development (Swift & Kotlin). Tiếp tục nâng cao chuyên môn về Bảo mật di động (IAM, Biometrics) và tối ưu hóa hệ thống định vị bản đồ.',
    longTerm:
      'Hướng tới vị trí Lead Mobile Architect / Senior Mobile Engineer, dẫn dắt các dự án Mobile Enterprise có quy mô lớn, đòi hỏi kiến trúc Native chuyên sâu và bảo mật cao.',
  },
  education: 'Trường Đại Học Giao Thông Vận Tải (UTC)',
  hobbies: ['Tìm hiểu Native Tech (Swift/Kotlin)', 'Lập trình Mobile & AI', 'Chia sẻ kiến thức công nghệ'],
};

export type CvV1Data = typeof cvV1Data;
