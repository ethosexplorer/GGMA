// ─── Internationalization (i18n) System ───
// Multi-language support for GGP-OS platform
// Priority: Spanish (Monica Green's Hispanic client base), then global coverage

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  region?: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  // Primary
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr', region: 'Americas' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇲🇽', direction: 'ltr', region: 'Americas' },

  // Americas
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', direction: 'ltr', region: 'Americas' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr', region: 'Europe' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', flag: '🇭🇹', direction: 'ltr', region: 'Americas' },

  // Asian (common in US cannabis industry)
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文(简体)', flag: '🇨🇳', direction: 'ltr', region: 'Asia' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '中文(繁體)', flag: '🇹🇼', direction: 'ltr', region: 'Asia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', direction: 'ltr', region: 'Asia' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', direction: 'ltr', region: 'Asia' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', direction: 'ltr', region: 'Asia' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭', direction: 'ltr', region: 'Asia' },
  { code: 'hmn', name: 'Hmong', nativeName: 'Hmoob', flag: '🏔️', direction: 'ltr', region: 'Asia' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr', region: 'Asia' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', direction: 'rtl', region: 'Asia' },
  { code: 'my', name: 'Burmese', nativeName: 'ဗမာစာ', flag: '🇲🇲', direction: 'ltr', region: 'Asia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', direction: 'ltr', region: 'Asia' },

  // Middle East & Africa
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl', region: 'Middle East' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', direction: 'ltr', region: 'Africa' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', direction: 'ltr', region: 'Africa' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', direction: 'ltr', region: 'Africa' },

  // Europe
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr', region: 'Europe' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr', region: 'Europe' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr', region: 'Europe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', direction: 'ltr', region: 'Europe' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', direction: 'ltr', region: 'Europe' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', direction: 'ltr', region: 'Europe' },

  // Indigenous / Native
  { code: 'nv', name: 'Navajo', nativeName: 'Diné Bizaad', flag: '🏜️', direction: 'ltr', region: 'Americas' },
];

// ─── Core UI translations (expandable) ───
export type TranslationKey =
  | 'nav.login'
  | 'nav.signup'
  | 'nav.stateFacts'
  | 'nav.ggmaSector'
  | 'nav.ripIntelligence'
  | 'nav.sincCompliance'
  | 'nav.bookConcierge'
  | 'hero.tagline'
  | 'hero.title1'
  | 'hero.title2'
  | 'hero.subtitle'
  | 'hero.searchPlaceholder'
  | 'hero.quickSearch'
  | 'hero.accessHub'
  | 'hero.viewTiers'
  | 'pricing.title'
  | 'pricing.subtitle'
  | 'pricing.monthly'
  | 'pricing.annual'
  | 'pricing.save'
  | 'pricing.startTrial'
  | 'pricing.contactSales'
  | 'pricing.getFree'
  | 'pricing.trialBadge'
  | 'pricing.trialNotice'
  | 'pricing.cardRequired'
  | 'pricing.customPlan'
  | 'pricing.addons'
  | 'footer.disclaimer'
  | 'footer.terms'
  | 'footer.privacy'
  | 'footer.accessibility'
  | 'footer.support'
  | 'common.language'
  | 'common.selectLanguage'
  | 'common.poweredBy'
  | 'common.allRightsReserved';

type Translations = Record<TranslationKey, string>;

const TRANSLATIONS: Record<string, Translations> = {
  en: {
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.stateFacts': 'State Facts',
    'nav.ggmaSector': 'GGMA Sector',
    'nav.ripIntelligence': 'RIP Intelligence',
    'nav.sincCompliance': 'SINC Compliance',
    'nav.bookConcierge': 'Book with GGE AI Concierge',
    'hero.tagline': 'GLOBAL GREEN ENTERPRISE INC INTRODUCING',
    'hero.title1': 'The Gold Standard in',
    'hero.title2': 'Compliance Infrastructure',
    'hero.subtitle': 'Global Green Enterprise Inc introduces the Global Green Hybrid Platform (GGHP) — a unified compliance ecosystem for GGMA, RIP, and SINC.',
    'hero.searchPlaceholder': 'Search state laws, statutes, or business regulations...',
    'hero.quickSearch': 'Quick Search',
    'hero.accessHub': 'Access Enterprise Hub',
    'hero.viewTiers': 'View Compliance Tiers',
    'pricing.title': 'Compliance Membership',
    'pricing.subtitle': 'Scalable infrastructure for patients, commercial entities, and regulatory bodies. Choose your role to see tailored plans.',
    'pricing.monthly': 'Monthly',
    'pricing.annual': 'Annual',
    'pricing.save': 'SAVE',
    'pricing.startTrial': 'Start Free Trial',
    'pricing.contactSales': 'Contact Sales',
    'pricing.getFree': 'Get Started Free',
    'pricing.trialBadge': '30 Days Free',
    'pricing.trialNotice': 'Free for 30 days. Credit/debit card required. Auto-renews at listed price. Cancel anytime.',
    'pricing.cardRequired': 'Card required. Auto-renews after trial.',
    'pricing.customPlan': 'Need a custom plan? Our team can build a tailored package for your organization.',
    'pricing.addons': 'Available Add-Ons',
    'footer.disclaimer': 'Disclaimer: Global Green Enterprise Inc (GGHP) infrastructure is designed to aggregate and assist with regulatory compliance across GGMA, RIP, and SINC sectors. Compliance is subject to state, local, and federal jurisdictions. Use of this platform does not constitute legal advice.',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.accessibility': 'Accessibility',
    'footer.support': 'Support: 1-405-492-7297',
    'common.language': 'Language',
    'common.selectLanguage': 'Select Language',
    'common.poweredBy': 'Powered by GGP-OS',
    'common.allRightsReserved': 'All Rights Reserved',
  },
  es: {
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.stateFacts': 'Datos Estatales',
    'nav.ggmaSector': 'Sector GGMA',
    'nav.ripIntelligence': 'Inteligencia RIP',
    'nav.sincCompliance': 'Cumplimiento SINC',
    'nav.bookConcierge': 'Reservar con IA Concierge GGE',
    'hero.tagline': 'GLOBAL GREEN ENTERPRISE INC PRESENTA',
    'hero.title1': 'El Estándar de Oro en',
    'hero.title2': 'Infraestructura de Cumplimiento',
    'hero.subtitle': 'Global Green Enterprise Inc presenta la Plataforma Híbrida Global Green (GGHP) — un ecosistema unificado de cumplimiento para GGMA, RIP y SINC.',
    'hero.searchPlaceholder': 'Buscar leyes estatales, estatutos o regulaciones comerciales...',
    'hero.quickSearch': 'Búsqueda Rápida',
    'hero.accessHub': 'Acceder al Centro Empresarial',
    'hero.viewTiers': 'Ver Niveles de Cumplimiento',
    'pricing.title': 'Membresía de Cumplimiento',
    'pricing.subtitle': 'Infraestructura escalable para pacientes, entidades comerciales y organismos reguladores. Elija su rol para ver planes personalizados.',
    'pricing.monthly': 'Mensual',
    'pricing.annual': 'Anual',
    'pricing.save': 'AHORRO',
    'pricing.startTrial': 'Iniciar Prueba Gratuita',
    'pricing.contactSales': 'Contactar Ventas',
    'pricing.getFree': 'Comenzar Gratis',
    'pricing.trialBadge': '30 Días Gratis',
    'pricing.trialNotice': 'Gratis por 30 días. Se requiere tarjeta de crédito/débito. Se renueva automáticamente al precio indicado. Cancele en cualquier momento.',
    'pricing.cardRequired': 'Se requiere tarjeta. Renovación automática después del período de prueba.',
    'pricing.customPlan': '¿Necesita un plan personalizado? Nuestro equipo puede crear un paquete a medida para su organización.',
    'pricing.addons': 'Complementos Disponibles',
    'footer.disclaimer': 'Aviso Legal: La infraestructura de Global Green Enterprise Inc (GGHP) está diseñada para agregar y asistir con el cumplimiento regulatorio en los sectores GGMA, RIP y SINC. El cumplimiento está sujeto a las jurisdicciones estatales, locales y federales. El uso de esta plataforma no constituye asesoramiento legal.',
    'footer.terms': 'Términos de Servicio',
    'footer.privacy': 'Política de Privacidad',
    'footer.accessibility': 'Accesibilidad',
    'footer.support': 'Soporte: 1-405-492-7297',
    'common.language': 'Idioma',
    'common.selectLanguage': 'Seleccionar Idioma',
    'common.poweredBy': 'Impulsado por GGP-OS',
    'common.allRightsReserved': 'Todos los Derechos Reservados',
  },
  zh: {
    'nav.login': '登录',
    'nav.signup': '注册',
    'nav.stateFacts': '州事实',
    'nav.ggmaSector': 'GGMA部门',
    'nav.ripIntelligence': 'RIP情报',
    'nav.sincCompliance': 'SINC合规',
    'nav.bookConcierge': '预约GGE AI礼宾',
    'hero.tagline': 'GLOBAL GREEN ENTERPRISE INC 推出',
    'hero.title1': '合规基础设施的',
    'hero.title2': '黄金标准',
    'hero.subtitle': 'Global Green Enterprise Inc 推出 Global Green 混合平台 (GGHP) — 为 GGMA、RIP 和 SINC 打造的统一合规生态系统。',
    'hero.searchPlaceholder': '搜索州法律、法规或商业法规...',
    'hero.quickSearch': '快速搜索',
    'hero.accessHub': '访问企业中心',
    'hero.viewTiers': '查看合规等级',
    'pricing.title': '合规会员资格',
    'pricing.subtitle': '为患者、商业实体和监管机构提供可扩展的基础设施。选择您的角色以查看定制计划。',
    'pricing.monthly': '月付',
    'pricing.annual': '年付',
    'pricing.save': '优惠',
    'pricing.startTrial': '开始免费试用',
    'pricing.contactSales': '联系销售',
    'pricing.getFree': '免费开始',
    'pricing.trialBadge': '30天免费',
    'pricing.trialNotice': '免费30天。需要信用卡/借记卡。按列出的价格自动续费。随时取消。',
    'pricing.cardRequired': '需要银行卡。试用后自动续费。',
    'pricing.customPlan': '需要定制计划？我们的团队可以为您的组织打造量身定制的方案。',
    'pricing.addons': '可用附加组件',
    'footer.disclaimer': '免责声明：Global Green Enterprise Inc (GGHP) 基础设施旨在汇集和协助 GGMA、RIP 和 SINC 部门的合规工作。合规受州、地方和联邦管辖。使用本平台不构成法律建议。',
    'footer.terms': '服务条款',
    'footer.privacy': '隐私政策',
    'footer.accessibility': '无障碍',
    'footer.support': '支持热线: 1-405-492-7297',
    'common.language': '语言',
    'common.selectLanguage': '选择语言',
    'common.poweredBy': '由 GGP-OS 驱动',
    'common.allRightsReserved': '版权所有',
  },
  vi: {
    'nav.login': 'Đăng Nhập',
    'nav.signup': 'Đăng Ký',
    'nav.stateFacts': 'Dữ Liệu Bang',
    'nav.ggmaSector': 'Ngành GGMA',
    'nav.ripIntelligence': 'Tình Báo RIP',
    'nav.sincCompliance': 'Tuân Thủ SINC',
    'nav.bookConcierge': 'Đặt lịch AI Concierge GGE',
    'hero.tagline': 'GLOBAL GREEN ENTERPRISE INC GIỚI THIỆU',
    'hero.title1': 'Tiêu Chuẩn Vàng Trong',
    'hero.title2': 'Hạ Tầng Tuân Thủ',
    'hero.subtitle': 'Global Green Enterprise Inc giới thiệu Nền tảng Hybrid Global Green (GGHP) — hệ sinh thái tuân thủ thống nhất cho GGMA, RIP và SINC.',
    'hero.searchPlaceholder': 'Tìm kiếm luật bang, quy chế hoặc quy định kinh doanh...',
    'hero.quickSearch': 'Tìm Nhanh',
    'hero.accessHub': 'Truy Cập Trung Tâm',
    'hero.viewTiers': 'Xem Các Cấp Tuân Thủ',
    'pricing.title': 'Thành Viên Tuân Thủ',
    'pricing.subtitle': 'Cơ sở hạ tầng mở rộng cho bệnh nhân, doanh nghiệp và cơ quan quản lý. Chọn vai trò để xem kế hoạch phù hợp.',
    'pricing.monthly': 'Hàng Tháng',
    'pricing.annual': 'Hàng Năm',
    'pricing.save': 'TIẾT KIỆM',
    'pricing.startTrial': 'Bắt Đầu Dùng Thử',
    'pricing.contactSales': 'Liên Hệ Bán Hàng',
    'pricing.getFree': 'Bắt Đầu Miễn Phí',
    'pricing.trialBadge': '30 Ngày Miễn Phí',
    'pricing.trialNotice': 'Miễn phí 30 ngày. Yêu cầu thẻ tín dụng/ghi nợ. Tự động gia hạn theo giá niêm yết. Hủy bất cứ lúc nào.',
    'pricing.cardRequired': 'Yêu cầu thẻ. Tự động gia hạn sau dùng thử.',
    'pricing.customPlan': 'Cần kế hoạch tùy chỉnh? Đội ngũ của chúng tôi có thể xây dựng gói phù hợp cho tổ chức của bạn.',
    'pricing.addons': 'Tiện Ích Bổ Sung',
    'footer.disclaimer': 'Tuyên bố: Hạ tầng Global Green Enterprise Inc (GGHP) được thiết kế để tổng hợp và hỗ trợ tuân thủ quy định trên các lĩnh vực GGMA, RIP và SINC.',
    'footer.terms': 'Điều Khoản Dịch Vụ',
    'footer.privacy': 'Chính Sách Bảo Mật',
    'footer.accessibility': 'Trợ Năng',
    'footer.support': 'Hỗ Trợ: 1-405-492-7297',
    'common.language': 'Ngôn Ngữ',
    'common.selectLanguage': 'Chọn Ngôn Ngữ',
    'common.poweredBy': 'Được hỗ trợ bởi GGP-OS',
    'common.allRightsReserved': 'Bảo Lưu Mọi Quyền',
  },
  ko: {
    'nav.login': '로그인',
    'nav.signup': '가입',
    'nav.stateFacts': '주 현황',
    'nav.ggmaSector': 'GGMA 부문',
    'nav.ripIntelligence': 'RIP 인텔리전스',
    'nav.sincCompliance': 'SINC 준수',
    'nav.bookConcierge': 'GGE AI 컨시어지 예약',
    'hero.tagline': 'GLOBAL GREEN ENTERPRISE INC 소개',
    'hero.title1': '규정 준수 인프라의',
    'hero.title2': '골드 스탠다드',
    'hero.subtitle': 'Global Green Enterprise Inc는 GGMA, RIP, SINC를 위한 통합 규정 준수 생태계인 Global Green Hybrid Platform(GGHP)을 소개합니다.',
    'hero.searchPlaceholder': '주법, 법령 또는 사업 규정 검색...',
    'hero.quickSearch': '빠른 검색',
    'hero.accessHub': '엔터프라이즈 허브 접속',
    'hero.viewTiers': '준수 등급 보기',
    'pricing.title': '준수 멤버십',
    'pricing.subtitle': '환자, 상업 단체 및 규제 기관을 위한 확장 가능한 인프라. 맞춤 플랜을 보려면 역할을 선택하세요.',
    'pricing.monthly': '월간',
    'pricing.annual': '연간',
    'pricing.save': '할인',
    'pricing.startTrial': '무료 체험 시작',
    'pricing.contactSales': '영업팀 연락',
    'pricing.getFree': '무료로 시작',
    'pricing.trialBadge': '30일 무료',
    'pricing.trialNotice': '30일 무료. 신용카드/체크카드 필요. 명시된 가격으로 자동 갱신. 언제든 취소 가능.',
    'pricing.cardRequired': '카드 필요. 체험 후 자동 갱신.',
    'pricing.customPlan': '맞춤 플랜이 필요하신가요? 저희 팀이 조직에 맞는 패키지를 만들어 드립니다.',
    'pricing.addons': '사용 가능한 부가기능',
    'footer.disclaimer': '면책 조항: Global Green Enterprise Inc(GGHP) 인프라는 GGMA, RIP 및 SINC 부문의 규정 준수를 집계하고 지원하도록 설계되었습니다.',
    'footer.terms': '서비스 약관',
    'footer.privacy': '개인정보 처리방침',
    'footer.accessibility': '접근성',
    'footer.support': '지원: 1-405-492-7297',
    'common.language': '언어',
    'common.selectLanguage': '언어 선택',
    'common.poweredBy': 'GGP-OS 제공',
    'common.allRightsReserved': '모든 권리 보유',
  },
  ar: {
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.stateFacts': 'حقائق الولاية',
    'nav.ggmaSector': 'قطاع GGMA',
    'nav.ripIntelligence': 'استخبارات RIP',
    'nav.sincCompliance': 'امتثال SINC',
    'nav.bookConcierge': 'حجز مع مساعد GGE الذكي',
    'hero.tagline': 'تقدم GLOBAL GREEN ENTERPRISE INC',
    'hero.title1': 'المعيار الذهبي في',
    'hero.title2': 'البنية التحتية للامتثال',
    'hero.subtitle': 'تقدم Global Green Enterprise Inc منصة Global Green الهجينة (GGHP) — نظام بيئي موحد للامتثال لـ GGMA و RIP و SINC.',
    'hero.searchPlaceholder': 'البحث في قوانين الولاية أو اللوائح التجارية...',
    'hero.quickSearch': 'بحث سريع',
    'hero.accessHub': 'الوصول إلى المركز',
    'hero.viewTiers': 'عرض مستويات الامتثال',
    'pricing.title': 'عضوية الامتثال',
    'pricing.subtitle': 'بنية تحتية قابلة للتوسع للمرضى والكيانات التجارية والهيئات التنظيمية.',
    'pricing.monthly': 'شهري',
    'pricing.annual': 'سنوي',
    'pricing.save': 'وفر',
    'pricing.startTrial': 'ابدأ التجربة المجانية',
    'pricing.contactSales': 'اتصل بالمبيعات',
    'pricing.getFree': 'ابدأ مجاناً',
    'pricing.trialBadge': '30 يوماً مجاناً',
    'pricing.trialNotice': 'مجاني لمدة 30 يوماً. بطاقة ائتمان/خصم مطلوبة. يتجدد تلقائياً.',
    'pricing.cardRequired': 'بطاقة مطلوبة. تجديد تلقائي بعد التجربة.',
    'pricing.customPlan': 'هل تحتاج خطة مخصصة؟ فريقنا يمكنه بناء حزمة مخصصة لمؤسستك.',
    'pricing.addons': 'إضافات متاحة',
    'footer.disclaimer': 'إخلاء المسؤولية: البنية التحتية لشركة Global Green Enterprise Inc مصممة للمساعدة في الامتثال التنظيمي.',
    'footer.terms': 'شروط الخدمة',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.accessibility': 'إمكانية الوصول',
    'footer.support': 'الدعم: 1-405-492-7297',
    'common.language': 'اللغة',
    'common.selectLanguage': 'اختر اللغة',
    'common.poweredBy': 'مدعوم من GGP-OS',
    'common.allRightsReserved': 'جميع الحقوق محفوظة',
  },
};

// ─── Translation Helper ───
export function t(key: TranslationKey, lang: string = 'en'): string {
  const translations = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  return translations[key] || TRANSLATIONS['en'][key] || key;
}

// ─── Language Detection ───
export function detectBrowserLanguage(): string {
  const browserLang = navigator.language?.split('-')[0] || 'en';
  const supported = SUPPORTED_LANGUAGES.find(l => l.code === browserLang);
  return supported ? supported.code : 'en';
}

// ─── Get languages grouped by region ───
export function getLanguagesByRegion(): Record<string, Language[]> {
  const grouped: Record<string, Language[]> = {};
  for (const lang of SUPPORTED_LANGUAGES) {
    const region = lang.region || 'Other';
    if (!grouped[region]) grouped[region] = [];
    grouped[region].push(lang);
  }
  return grouped;
}
