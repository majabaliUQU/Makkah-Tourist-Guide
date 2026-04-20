/**
 * data/places.js
 * ─────────────────────────────────────────────
 * Default dataset for Makkah tourism places.
 * Add or remove entries here to change the
 * seed data that loads on first visit.
 *
 * Schema:
 *   id        {number}  — Unique integer ID
 *   name      {string}  — Arabic place name
 *   category  {string}  — One of CATEGORIES
 *   desc      {string}  — Short Arabic description
 *   emoji     {string}  — Single emoji representing the place
 *   userAdded {boolean} — Always false for seed data
 * ─────────────────────────────────────────────
 */

const CATEGORIES = ['ديني', 'تاريخي', 'معماري', 'ثقافي', 'طبيعي', 'أخرى'];

const DEFAULT_PLACES = [
  {
    id: 1,
    name: 'المسجد الحرام',
    category: 'ديني',
    desc: 'أقدس بقاع الأرض وأكبر مساجد العالم، يضم الكعبة المشرفة والمطاف ومقام إبراهيم وبئر زمزم.',
    emoji: '🕋',
    userAdded: false,
  },
  {
    id: 2,
    name: 'الكعبة المشرفة',
    category: 'ديني',
    desc: 'بيت الله الحرام وقبلة المسلمين حول العالم، تتوسط المسجد الحرام وتُكسى بالكسوة السوداء المطرزة.',
    emoji: '🕌',
    userAdded: false,
  },
  {
    id: 3,
    name: 'جبل النور وغار حراء',
    category: 'تاريخي',
    desc: 'الجبل الذي نزل فيه أول وحي على النبي محمد ﷺ في غار حراء. ارتفاعه نحو 640 متراً فوق مستوى البحر.',
    emoji: '⛰️',
    userAdded: false,
  },
  {
    id: 4,
    name: 'جبل ثور',
    category: 'تاريخي',
    desc: 'الجبل الذي اختبأ فيه النبي ﷺ وصاحبه أبو بكر الصديق ثلاثة أيام خلال هجرته إلى المدينة المنورة.',
    emoji: '🏔️',
    userAdded: false,
  },
  {
    id: 5,
    name: 'منى',
    category: 'ديني',
    desc: 'وادٍ يقع بين مكة المكرمة وعرفات، يمتلئ بالحجاج في موسم الحج ويضم جمرات رمي الحجارة.',
    emoji: '🏕️',
    userAdded: false,
  },
  {
    id: 6,
    name: 'عرفات',
    category: 'ديني',
    desc: 'سهل يبعد عن مكة نحو 22 كم، يُعد الوقوف فيه ركناً أساسياً لا تصح الحج بدونه.',
    emoji: '🌄',
    userAdded: false,
  },
  {
    id: 7,
    name: 'برج ساعة مكة',
    category: 'معماري',
    desc: 'أحد أطول الأبراج في العالم وأكبر ساعة برجية، يقع بمجمع أبراج البيت المطل على المسجد الحرام مباشرةً.',
    emoji: '🏙️',
    userAdded: false,
  },
  {
    id: 8,
    name: 'متحف الحرمين الشريفين',
    category: 'ثقافي',
    desc: 'متحف يوثق تاريخ المسجد الحرام والمسجد النبوي الشريف وتطورهما المعماري عبر العصور الإسلامية.',
    emoji: '🏛️',
    userAdded: false,
  },
  {
    id: 9,
    name: 'مسجد الجن',
    category: 'ديني',
    desc: 'المسجد الذي يُقال إن نفراً من الجن استمعوا فيه لتلاوة النبي ﷺ للقرآن الكريم وأسلموا.',
    emoji: '🌙',
    userAdded: false,
  },
  {
    id: 10,
    name: 'المزدلفة',
    category: 'ديني',
    desc: 'منطقة مشعر مقدس تقع بين منى وعرفات، يبيت فيها الحجاج ليلة العيد ويجمعون حصى الجمرات.',
    emoji: '✨',
    userAdded: false,
  },
  {
    id: 11,
    name: 'بئر زمزم',
    category: 'ديني',
    desc: 'بئر مقدسة داخل المسجد الحرام تنبع بمياه زمزم المباركة منذ آلاف السنين لا تنضب.',
    emoji: '💧',
    userAdded: false,
  },
  {
    id: 12,
    name: 'أبراج البيت',
    category: 'معماري',
    desc: 'مجمع أبراج فندقية ضخمة على بعد خطوات من المسجد الحرام يضم فنادق فاخرة ومراكز تسوق ومطاعم.',
    emoji: '🏗️',
    userAdded: false,
  },
];
