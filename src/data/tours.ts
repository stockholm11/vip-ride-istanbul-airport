// Import tour images
import historicalPeninsulaImg from "../assets/images/tours/historical-peninsula.jpg";
import bosphorusCruiseImg from "../assets/images/tours/bosphorus-cruise.jpg";
import winterBosphorusImg from "../assets/images/tours/winter-bosphorus.jpg";
import princesIslandsImg from "../assets/images/tours/princes-islands.jpg";
import dinnerBosphorusCruiseImg from "../assets/images/tours/new/dinner-bosphorus-cruise.jpg";
import antalyaShoppingImg from "../assets/images/tours/new/antalya-shopping.jpg";
import shoppingImg from "../assets/images/tours/new/shopping.jpg";
import byzantineExplorationImg from "../assets/images/tours/new/byzantine-exploration.webp";
import ottomanHeritageImg from "../assets/images/tours/new/ottoman-heritage.jpg";

// New images
import historicalPeninsulaNewImg from "../assets/images/tours/new/historical-peninsula-istanbul.jpg";
import turkishCulinaryJourneyImg from "../assets/images/tours/new/turkish-culinary-journey.jpg";
import bosphorusCruiseNewImg from "../assets/images/tours/new/bosphorus-cruise.jpg";
import winterBosphorusNewImg from "../assets/images/tours/new/winter-bosphorus-istanbul.jpg";
import summerPrincesIslandsImg from "../assets/images/tours/new/summer-princes-islands.jpg";
import winterBosphorusIstanbulImg from "../assets/images/tours/new/winter-bosphorus-istanbul.jpg";

export interface TourType {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number; // hours
  capacity: number; // people
  includes: string[];
  image: string;
  type: string; // For category filtering
  rating?: number; // Make rating optional
  location?: string; // Make location optional
  isPopular?: boolean;
  isSeasonal?: boolean;
}

// Simplified data structure for featured tours
export interface FeaturedTourType {
  id: string;
  image: string;
  price: number;
  duration: number;
  type: string;
  isPopular?: boolean;
  isSeasonal?: boolean;
  capacity?: number;
  location?: string;
}

// Base featured tours data (language-independent properties)
const featuredToursBase: FeaturedTourType[] = [
  // Seasonal tours
  {
    id: "winter-bosphorus",
    image: winterBosphorusNewImg,
    price: 220,
    duration: 4,
    type: "yacht-boat",
    isPopular: false,
    isSeasonal: true
  },
  {
    id: "summer-princes-islands",
    image: summerPrincesIslandsImg,
    price: 240,
    duration: 8,
    type: "nature-excursion",
    isPopular: false,
    isSeasonal: true
  },

  // Regular tours (not popular, not seasonal)
  {
    id: "historical-peninsula",
    image: historicalPeninsulaNewImg,
    price: 177,
    duration: 8,
    type: "cultural-historical",
    isPopular: false,
    isSeasonal: false
  },
  {
    id: "ottoman-heritage",
    image: ottomanHeritageImg,
    price: 175,
    duration: 7,
    type: "cultural-historical",
    isPopular: true,
    isSeasonal: false
  },
  {
    id: "culinary-tour",
    image: turkishCulinaryJourneyImg,
    price: 160,
    duration: 6,
    type: "cultural-historical",
    isPopular: true,
    isSeasonal: false
  },
  
  {
    id: "byzantine-exploration",
    image: byzantineExplorationImg,
    price: 190,
    duration: 6,
    type: "cultural-historical",
    isPopular: false,
    isSeasonal: false
  },

  // Popular tours
  {
    id: "dinner-bosphorus-cruise",
    image: dinnerBosphorusCruiseImg,
    price: 497,
    duration: 3,
    type: "yacht-boat",
    isPopular: false,
    isSeasonal: true
  },
  {
    id: "bosphorus-cruise",
    image: bosphorusCruiseNewImg,
    price: 180,
    duration: 5,
    type: "yacht-boat",
    isPopular: false,
    isSeasonal: false
  },
  {
    id: "istanbul-shopping-entertainment",
    image: shoppingImg,
    price: 199,
    duration: 8,
    type: "shopping-entertainment",
    isPopular: true,
    isSeasonal: false,
    capacity: 6
  },
  {
    id: "antalya-shopping-entertainment",
    image: antalyaShoppingImg,
    price: 199,
    duration: 8,
    type: "shopping-entertainment",
    location: "Antalya",
    capacity: 6
  }
];

type LocalizedTourData = Record<string, {
    title: string;
    description: string;
    includes: string[];
  }>;

// Localized data for tours
const tourLocalization: Record<string, LocalizedTourData> = {
  // English localization
  en: {
    "historical-peninsula": {
      title: "Historical Peninsula Tour",
      description: "Explore the historical heart of Istanbul with visits to the Blue Mosque, Hagia Sophia, Topkapi Palace, and the Grand Bazaar. This comprehensive tour offers insights into the city's rich Byzantine and Ottoman heritage.",
      includes: [
        "Professional guide",
        "Luxury vehicle",
        "Museum tickets",
        "Lunch at a local restaurant",
        "Hotel pickup and drop-off"
      ]
    },
    "bosphorus-cruise": {
      title: "Bosphorus Cruise & Tour",
      description: "Experience the beauty of Istanbul from the water with our luxury Bosphorus cruise. See the city's majestic palaces and fortresses along both the European and Asian shores.",
      includes: [
        "Luxury yacht cruise",
        "Professional guide",
        "Refreshments on board",
        "Hotel pickup and drop-off",
        "Photo opportunities"
      ]
    },
    "winter-bosphorus": {
      title: "Winter Bosphorus Experience",
      description: "A special winter tour featuring heated yacht cabin, warm Turkish tea, and stunning views of Istanbul's snow-dusted landscapes. Enjoy the unique winter atmosphere of the Bosphorus.",
      includes: [
        "Heated luxury yacht",
        "Hot beverages service",
        "Professional guide",
        "Winter photography spots",
        "Hotel transfers"
      ]
    },
    "summer-princes-islands": {
      title: "Summer Islands Getaway",
      description: "Beat the summer heat with this special tour to the Princes' Islands featuring swimming stops, beach time, and cooling sea breezes. Escape the city crowds and enjoy a peaceful day.",
      includes: [
        "Ferry tickets",
        "Horse carriage tour",
        "Lunch package",
        "Swimming opportunity",
        "Professional guide"
      ]
    },
    "culinary-tour": {
      title: "Turkish Culinary Journey",
      description: "Indulge in the diverse flavors of Turkish cuisine with this gastronomic adventure. Visit local markets, participate in a cooking class, and enjoy tastings of authentic Turkish dishes, sweets, and beverages.",
      includes: [
        "Food tastings",
        "Cooking class",
        "Market tour",
        "Luxury transfers",
        "Hotel pickup and drop-off"
      ]
    },
    "ottoman-heritage": {
      title: "Ottoman Heritage Tour",
      description: "Delve into the imperial past of Istanbul with this specialized Ottoman heritage tour. Visit palaces, mosques, and other significant sites that showcase the architectural and cultural splendor of the Ottoman Empire.",
      includes: [
        "Expert historian guide",
        "Premium transportation",
        "All entrance fees",
        "Ottoman-style lunch",
        "Calligraphy demonstration"
      ]
    },
    "byzantine-exploration": {
      title: "Byzantine Istanbul Exploration",
      description: "Journey through time to Byzantine Constantinople. This specialized tour explores the remnants and influences of the Eastern Roman Empire in Istanbul, including cisterns, churches, and archaeological sites not on typical tourist routes.",
      includes: [
        "Byzantine historian guide",
        "Luxury transportation",
        "Special access to restricted sites",
        "Byzantine-inspired meal",
        "Educational materials"
      ]
    },
    "dinner-bosphorus-cruise": {
      title: "Dinner Bosphorus Cruise",
      description: "Experience an unforgettable Istanbul evening! Enjoy a 3-hour luxury cruise on the Bosphorus with dinner, live music, and entertainment while taking in magnificent views of the city.",
      includes: [
        "Free transfers from selected districts",
        "Dinner with meat, chicken or fish options",
        "Alcoholic and non-alcoholic beverages",
        "Live music and entertainment shows",
        "Bosphorus night tour"
      ]
    },
    "istanbul-shopping-entertainment": {
      title: "Istanbul Shopping & Entertainment Tour",
      description: "Discover Istanbul's shopping and entertainment world with this special tour. Visit popular shopping malls and historical bazaars, with a luxury vehicle at your service throughout the entire 8-hour experience.",
      includes: [
        "Luxury vehicle with professional driver",
        "Hotel pickup and drop-off",
        "Visit to major shopping centers",
        "Visit to historical markets",
        "Flexible itinerary"
      ]
    },
    "antalya-shopping-entertainment": {
      title: "Antalya Shopping & Entertainment Tour",
      description: "Explore Antalya's shopping and entertainment scene with this exclusive tour. Visit popular malls and the historical Kaleiçi district with a private vehicle for up to 6 people over 8 hours.",
      includes: [
        "Luxury vehicle with private driver",
        "Hotel pickup and drop-off",
        "Visits to TerraCity and MarkAntalya malls",
        "Visit to Kaleiçi historical bazaar",
        "Flexible shopping time"
      ]
    }
  },

  // Turkish localization
  tr: {
    "historical-peninsula": {
      title: "Tarihi Yarımada Turu",
      description: "Sultan Ahmet Camii, Ayasofya, Topkapı Sarayı ve Kapalı Çarşı ziyaretleri ile İstanbul'un tarihi kalbini keşfedin. Bu kapsamlı tur, şehrin zengin Bizans ve Osmanlı mirasına dair bilgiler sunar.",
      includes: [
        "Profesyonel rehber",
        "Lüks araç",
        "Müze biletleri",
        "Yerel bir restoranda öğle yemeği",
        "Otel ulaşımı"
      ]
    },
    "bosphorus-cruise": {
      title: "Boğaz Turu & Gezisi",
      description: "Lüks boğaz turuyla İstanbul'un güzelliğini denizden deneyimleyin. Şehrin hem Avrupa hem de Asya kıyılarındaki görkemli saraylarını ve kalelerini görün.",
      includes: [
        "Lüks yat turu",
        "Profesyonel rehber",
        "Teknede ikramlar",
        "Otel ulaşımı",
        "Fotoğraf imkanları"
      ]
    },
    "winter-bosphorus": {
      title: "Kış Boğaz Deneyimi",
      description: "Isıtmalı yat kabini, sıcak Türk çayı ve İstanbul'un kar kaplı manzaraları ile özel bir kış turu. Boğazın eşsiz kış atmosferinin tadını çıkarın.",
      includes: [
        "Isıtmalı lüks yat",
        "Sıcak içecek servisi",
        "Profesyonel rehber",
        "Kış fotoğraf noktaları",
        "Otel transferleri"
      ]
    },
    "summer-princes-islands": {
      title: "Yaz Adalar Kaçamağı",
      description: "Yüzme molaları, plaj zamanı ve ferahlatıcı deniz esintileri ile Prens Adaları'na özel bir yaz turu. Şehir kalabalığından uzaklaşın ve huzurlu bir gün geçirin.",
      includes: [
        "Feribot biletleri",
        "Fayton turu",
        "Öğle yemeği paketi",
        "Yüzme imkanı",
        "Profesyonel rehber"
      ]
    },
    "culinary-tour": {
      title: "Türk Mutfağı Yolculuğu",
      description: "Bu gastronomi macerası ile Türk mutfağının çeşitli lezzetlerinin tadını çıkarın. Yerel pazarları ziyaret edin, bir yemek kursuna katılın ve otantik Türk yemekleri, tatlıları ve içeceklerinin tattırımlarının keyfini çıkarın.",
      includes: [
        "Yemek tadımları",
        "Yemek kursu",
        "Pazar turu",
        "Lüks transferler",
        "Otel ulaşımı"
      ]
    },
    "ottoman-heritage": {
      title: "Osmanlı Mirası Turu",
      description: "Bu özel Osmanlı mirası turu ile İstanbul'un imparatorluk geçmişine dalın. Osmanlı İmparatorluğu'nun mimari ve kültürel ihtişamını sergileyen sarayları, camileri ve diğer önemli yerleri ziyaret edin.",
      includes: [
        "Uzman tarihçi rehber",
        "Premium ulaşım",
        "Tüm giriş ücretleri",
        "Osmanlı tarzı öğle yemeği",
        "Kaligrafi gösterisi"
      ]
    },
    "byzantine-exploration": {
      title: "Bizans İstanbul Keşfi",
      description: "Bizans Konstantinopolis'ine zamanda yolculuk yapın. Bu özel tur, sarnıçlar, kiliseler ve tipik turist rotalarında olmayan arkeolojik siteler dahil olmak üzere Doğu Roma İmparatorluğu'nun İstanbul'daki kalıntılarını ve etkilerini keşfeder.",
      includes: [
        "Bizans tarihçisi rehber",
        "Lüks ulaşım",
        "Kısıtlı alanlara özel erişim",
        "Bizans tarzı yemek",
        "Eğitim materyalleri"
      ]
    },
    "dinner-bosphorus-cruise": {
      title: "Yemekli Boğaz Turu",
      description: "Unutulmaz bir İstanbul gecesi için hazır olun! 3 saatlik lüks vapur turumuzda, muhteşem Boğaz manzarası eşliğinde akşam yemeğinin, canlı müzik ve eğlencenin tadını çıkaracaksınız.",
      includes: [
        "Ücretsiz transfer hizmeti",
        "Et, tavuk veya balık ızgara seçenekli akşam yemeği",
        "Alkollü ve alkolsüz içecekler",
        "Canlı müzik ve gösteri programı",
        "Boğaz turu"
      ]
    },
    "istanbul-shopping-entertainment": {
      title: "İstanbul Alışveriş ve Eğlence Turu",
      description: "İstanbul'un alışveriş ve eğlence dünyasını keşfedin! 8 saatlik özel turumuzda, popüler alışveriş merkezlerini ve tarihi çarşıları gezme fırsatı bulacaksınız.",
      includes: [
        "Lüks araç ve özel şoför",
        "Otel transferleri",
        "Popüler AVM ziyaretleri",
        "Tarihi çarşı ziyaretleri",
        "Esnek alışveriş programı"
      ]
    },
    "antalya-shopping-entertainment": {
      title: "Antalya Alışveriş ve Eğlence Turu",
      description: "Antalya'nın alışveriş ve eğlence dünyasını keşfedin! Bu özel turda, 6 kişiye kadar özel olarak düzenlenmiş bir programdır, popüler alışveriş merkezlerini ve tarihi çarşıları gezme fırsatı bulacaksınız.",
      includes: [
        "VIP transfer aracı",
        "Özel şoför",
        "TerraCity ve MarkAntalya AVM ziyaretleri",
        "Kaleiçi çarşı ziyareti",
        "Esnek program"
      ]
    }
  },

  // Arabic localization
  ar: {
    "historical-peninsula": {
      title: "جولة شبه الجزيرة التاريخية",
      description: "استكشف قلب إسطنبول التاريخي من خلال زيارات إلى المسجد الأزرق وآيا صوفيا وقصر توبكابي والبازار الكبير. تقدم هذه الجولة الشاملة رؤى حول التراث البيزنطي والعثماني الغني للمدينة.",
      includes: [
        "مرشد محترف",
        "مركبة فاخرة",
        "تذاكر المتحف",
        "غداء في مطعم محلي",
        "خدمة الاستلام والتوصيل من الفندق"
      ]
    },
    "bosphorus-cruise": {
      title: "رحلة بحرية في البوسفور",
      description: "استمتع بجمال إسطنبول من الماء من خلال رحلتنا البحرية الفاخرة في البوسفور. شاهد القصور والقلاع المهيبة للمدينة على طول الشواطئ الأوروبية والآسيوية.",
      includes: [
        "رحلة بحرية على يخت فاخر",
        "مرشد محترف",
        "مرطبات على متن اليخت",
        "خدمة الاستلام والتوصيل من الفندق",
        "فرص التصوير"
      ]
    },
    "winter-bosphorus": {
      title: "تجربة البوسفور الشتوية",
      description: "جولة شتوية خاصة تضم كابينة يخت مدفأة، وشاي تركي دافئ، وإطلالات خلابة على مناظر إسطنبول المغطاة بالثلوج. استمتع بالأجواء الشتوية الفريدة للبوسفور.",
      includes: [
        "يخت فاخر مدفأ",
        "خدمة المشروبات الساخنة",
        "مرشد محترف",
        "أماكن للتصوير الشتوي",
        "خدمة النقل من الفندق"
      ]
    },
    "summer-princes-islands": {
      title: "رحلة جزر الأمراء الصيفية",
      description: "تغلب على حرارة الصيف مع هذه الجولة الخاصة إلى جزر الأمراء التي تضم محطات للسباحة، وقضاء وقت على الشاطئ، ونسائم البحر المنعشة. اهرب من زحام المدينة واستمتع بيوم هادئ.",
      includes: [
        "تذاكر العبّارة",
        "جولة بعربة الخيول",
        "وجبة غداء",
        "فرصة للسباحة",
        "مرشد محترف"
      ]
    },
    "culinary-tour": {
      title: "رحلة المأكولات التركية",
      description: "استمتع بمذاق النكهات المتنوعة للمطبخ التركي من خلال هذه المغامرة الغذائية. قم بزيارة الأسواق المحلية، وشارك في فصل للطهي، واستمتع بتذوق الأطباق والحلويات والمشروبات التركية الأصيلة.",
      includes: [
        "تذوق الطعام",
        "درس طهي",
        "جولة في السوق",
        "خدمة نقل فاخرة",
        "خدمة الاستلام والتوصيل من الفندق"
      ]
    },
    "ottoman-heritage": {
      title: "جولة التراث العثماني",
      description: "تعمق في الماضي الإمبراطوري لإسطنبول من خلال جولة التراث العثماني المتخصصة هذه. قم بزيارة القصور والمساجد والمواقع المهمة الأخرى التي تعرض الروعة المعمارية والثقافية للإمبراطورية العثمانية.",
      includes: [
        "مرشد مؤرخ خبير",
        "نقل ممتاز",
        "جميع رسوم الدخول",
        "غداء على الطراز العثماني",
        "عرض فن الخط"
      ]
    },
    "byzantine-exploration": {
      title: "استكشاف إسطنبول البيزنطية",
      description: "رحلة عبر الزمن إلى القسطنطينية البيزنطية. تستكشف هذه الجولة المتخصصة بقايا وتأثيرات الإمبراطورية الرومانية الشرقية في إسطنبول، بما في ذلك الصهاريج والكنائس والمواقع الأثرية التي لا توجد في المسارات السياحية النموذجية.",
      includes: [
        "مرشد مؤرخ بيزنطي",
        "نقل فاخر",
        "وصول خاص إلى المواقع المقيدة",
        "وجبة مستوحاة من الطراز البيزنطي",
        "مواد تعليمية"
      ]
    },
    "dinner-bosphorus-cruise": {
      title: "جولة البوسفور مع عشاء",
      description: "استعد لليلة لا تُنسى في إسطنبول! استمتع برحلة بحرية فاخرة لمدة 3 ساعات على البوسفور مع العشاء والموسيقى الحية والترفيه بينما تستمتع بإطلالات رائعة على المدينة.",
      includes: [
        "خدمة النقل المجانية من المناطق المحددة",
        "عشاء مع خيارات اللحوم أو الدجاج أو السمك",
        "المشروبات الكحولية وغير الكحولية",
        "موسيقى حية وعروض ترفيهية",
        "جولة البوسفور الليلية"
      ]
    },
    "istanbul-shopping-entertainment": {
      title: "جولة التسوق والترفيه في إسطنبول",
      description: "اكتشف عالم التسوق والترفيه في إسطنبول مع هذه الجولة الخاصة. قم بزيارة مراكز التسوق الشهيرة والأسواق التاريخية، مع سيارة فاخرة في خدمتك طوال تجربة الـ 8 ساعات بالكامل.",
      includes: [
        "سيارة فاخرة مع سائق محترف",
        "خدمة الاستلام والتوصيل من الفندق",
        "زيارة إلى مراكز التسوق الرئيسية",
        "زيارة إلى الأسواق التاريخية",
        "جدول زمني مرن"
      ]
    },
    "antalya-shopping-entertainment": {
      title: "جولة التسوق والترفيه في أنطاليا",
      description: "استكشف مشهد التسوق والترفيه في أنطاليا مع هذه الجولة الحصرية. قم بزيارة مراكز التسوق الشهيرة وحي كاليتشي التاريخي مع سيارة خاصة تتسع لما يصل إلى 6 أشخاص على مدار 8 ساعات.",
      includes: [
        "سيارة فاخرة مع سائق خاص",
        "خدمة الاستلام والتوصيل من الفندق",
        "زيارات إلى مراكز تسوق تيراسيتي وماركأنطاليا",
        "زيارة إلى سوق كاليتشي التاريخي",
        "وقت تسوق مرن"
      ]
    }
  }
};

// Full tour data for VIP Tours page (language-independent properties)
const toursBase: Omit<TourType, 'title' | 'description' | 'includes'>[] = [
  // Cultural & Historical Tours
  {
    id: "historical-peninsula",
    image: historicalPeninsulaNewImg,
    price: 177,
    duration: 8,
    capacity: 6,
    type: "cultural-historical"
  },
  {
    id: "culinary-tour",
    image: turkishCulinaryJourneyImg,
    price: 160,
    duration: 6,
    capacity: 6,
    type: "cultural-historical"
  },
  {
    id: "ottoman-heritage",
    image: ottomanHeritageImg,
    price: 175,
    duration: 7,
    capacity: 5,
    type: "cultural-historical"
  },
  {
    id: "byzantine-exploration",
    image: byzantineExplorationImg,
    price: 190,
    duration: 6,
    capacity: 4,
    type: "cultural-historical"
  },
  // Yacht & Boat Tours
  {
    id: "dinner-bosphorus-cruise",
    image: dinnerBosphorusCruiseImg,
    price: 497,
    duration: 3,
    capacity: 100,
    type: "yacht-boat"
  },
  {
    id: "bosphorus-cruise",
    image: bosphorusCruiseNewImg,
    price: 180,
    duration: 5,
    capacity: 20,
    type: "yacht-boat"
  },
  // Seasonal Tours
  {
    id: "winter-bosphorus",
    image: winterBosphorusNewImg,
    price: 220,
    duration: 4,
    capacity: 15,
    type: "yacht-boat"
  },
  {
    id: "summer-princes-islands",
    image: summerPrincesIslandsImg,
    price: 240,
    duration: 8,
    capacity: 12,
    type: "nature-excursion"
  },
  // Shopping & Entertainment Tours
  {
    id: "istanbul-shopping-entertainment",
    image: shoppingImg,
    price: 199,
    duration: 8,
    type: "shopping-entertainment",
    isPopular: true,
    isSeasonal: false,
    capacity: 6
  },
  {
    id: "antalya-shopping-entertainment",
    image: antalyaShoppingImg,
    price: 199,
    duration: 8,
    type: "shopping-entertainment",
    location: "Antalya",
    capacity: 6
  }
];

/**
 * Get localized tour details based on language and tour ID
 */
export const getLocalizedTourDetails = (tourId: string, language = 'en') => {
  // Default to English if language not found
  const lang = tourLocalization[language] ? language : 'en';
  return tourLocalization[lang][tourId] || tourLocalization['en'][tourId];
};

/**
 * Get featured tours with proper localization
 */
export const getFeaturedTours = (language = 'en') => {
  return featuredToursBase.map(tour => {
    const localizedData = getLocalizedTourDetails(tour.id, language);
    return {
      ...tour,
      title: localizedData.title,
      description: localizedData.description,
      isPopular: tour.isPopular,
      isSeasonal: tour.isSeasonal
    };
  });
};

/**
 * Get all tours with proper localization for the VIP Tours page
 */
export const getAllTours = (language = 'en') => {
  return toursBase.map(tour => {
    const localizedData = getLocalizedTourDetails(tour.id, language);
    return {
      ...tour,
      title: localizedData.title,
      description: localizedData.description,
      includes: localizedData.includes
    };
  });
};

export default {
  getFeaturedTours,
  getAllTours,
  getLocalizedTourDetails
};
