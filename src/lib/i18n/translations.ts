export type Language = "en" | "ur";

export interface TranslationDictionary {
  // Navigation
  nav_brand: string;
  nav_tagline: string;
  nav_dashboard: string;
  nav_meds: string;
  nav_triage: string;
  nav_profile: string;
  nav_signin: string;
  nav_signup: string;
  nav_demo: string;
  nav_logout: string;
  nav_menu: string;
  nav_close: string;

  // Common UI
  btn_save: string;
  btn_saving: string;
  btn_cancel: string;
  btn_close: string;
  btn_submit: string;
  btn_loading: string;
  btn_print: string;
  btn_view: string;
  btn_open: string;
  badge_demo: string;
  badge_emergency: string;
  badge_urgent: string;
  badge_routine: string;
  badge_home: string;

  // Footer
  footer_desc: string;
  footer_quick_links: string;
  footer_emergency_title: string;
  footer_emergency_1122: string;
  footer_emergency_umang: string;
  footer_disclaimer_title: string;
  footer_disclaimer_text: string;
  footer_privacy: string;
  footer_terms: string;
  footer_copyright: string;
  footer_sdg3: string;

  // Home Page
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_dashboard: string;
  hero_cta_demo: string;
  hero_cta_signup: string;
  hero_trust_offline: string;
  hero_trust_who: string;
  hero_trust_fast: string;
  modules_title: string;
  modules_subtitle: string;
  module_meds_title: string;
  module_meds_desc: string;
  module_triage_title: string;
  module_triage_desc: string;
  module_sbar_title: string;
  module_sbar_desc: string;

  // Dashboard Page
  dash_greeting: string;
  dash_subtitle: string;
  dash_triage_btn: string;
  dash_vitals_title: string;
  dash_age: string;
  dash_gender: string;
  dash_conditions: string;
  dash_allergies: string;
  dash_meds: string;
  dash_none_reported: string;
  dash_edit_profile: string;

  // Meds Page
  meds_title: string;
  meds_subtitle: string;
  meds_input_label: string;
  meds_input_placeholder: string;
  meds_presets_label: string;
  meds_btn_analyze: string;
  meds_btn_analyzing: string;
  meds_results_title: string;
  meds_allergy_alert: string;
  meds_schedule_title: string;
  meds_morning: string;
  meds_afternoon: string;
  meds_evening: string;
  meds_night: string;
  meds_food_instruction: string;
  meds_warnings: string;

  // Triage Page
  triage_title: string;
  triage_subtitle: string;
  triage_starter_label: string;
  triage_input_placeholder: string;
  triage_btn_send: string;
  triage_btn_reset: string;
  triage_btn_sbar: string;
  triage_emergency_banner_title: string;
  triage_emergency_banner_desc: string;
  triage_emergency_call_btn: string;

  // Profile Page
  profile_title: string;
  profile_subtitle: string;
  profile_basic_info: string;
  profile_age_label: string;
  profile_gender_label: string;
  profile_conditions_title: string;
  profile_allergies_title: string;
  profile_meds_title: string;
  profile_add_btn: string;
  profile_saved_toast: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav_brand: "TabeebCare",
    nav_tagline: "AI Health Literacy & Triage",
    nav_dashboard: "Dashboard",
    nav_meds: "Prescription Scanner",
    nav_triage: "Symptom Triage",
    nav_profile: "Health Profile",
    nav_signin: "Sign In",
    nav_signup: "Create Account",
    nav_demo: "Judge Demo Mode",
    nav_logout: "Sign Out",
    nav_menu: "Menu",
    nav_close: "Close",

    btn_save: "Save Changes",
    btn_saving: "Saving...",
    btn_cancel: "Cancel",
    btn_close: "Close",
    btn_submit: "Submit",
    btn_loading: "Processing...",
    btn_print: "Print / Save PDF",
    btn_view: "View",
    btn_open: "Open Module",
    badge_demo: "Demo Patient",
    badge_emergency: "Emergency",
    badge_urgent: "Urgent Care",
    badge_routine: "Routine Care",
    badge_home: "Home Care",

    footer_desc:
      "TabeebCare (طبیب کیئر) is an educational AI health literacy, prescription demystifier, and clinical triage companion built for Pakistani patients under UN SDG 3 (Good Health and Well-Being).",
    footer_quick_links: "Quick Navigation",
    footer_emergency_title: "Emergency Helplines (Pakistan)",
    footer_emergency_1122: "Rescue 1122 (Ambulance & Fire)",
    footer_emergency_umang: "Umang Mental Health: 0317-4288665",
    footer_disclaimer_title: "Medical Notice",
    footer_disclaimer_text:
      "TabeebCare is an educational triage navigation and health literacy platform. It does not replace professional medical advice, diagnosis, or clinical prescriptions. In life-threatening emergencies, dial 1122 immediately.",
    footer_privacy: "Privacy Notice",
    footer_terms: "Terms of Use",
    footer_copyright: "© 2026 TabeebCare. SDG 3 Hackathon Initiative. All rights reserved.",
    footer_sdg3: "UN SDG 3: Good Health & Well-Being",

    hero_badge: "SDG 3 Hackathon Initiative • Minhaj University Lahore",
    hero_title: "Empowering Patients with Clarity, Safety & Rapid Clinical Guidance",
    hero_subtitle:
      "Understand doctor prescriptions in plain English & Urdu, receive safe triage navigation based on evidence-based WHO protocols, and generate clinical summaries for your doctor in one tap.",
    hero_cta_dashboard: "Go to Dashboard",
    hero_cta_demo: "⚡ Instant Judge Demo",
    hero_cta_signup: "Create Free Account",
    hero_trust_offline: "Encrypted Sessions & Private Health Records",
    hero_trust_who: "Evidence-Based WHO Clinical Protocol Context",
    hero_trust_fast: "Ultra-Fast Groq Inference (<1s)",
    modules_title: "Core Health Literacy Modules",
    modules_subtitle: "Targeting the 3 biggest communication barriers in outpatient care",
    module_meds_title: "1. Medicine Demystifier",
    module_meds_desc:
      "Enter any handwritten or printed medicine names to get an organized morning/noon/night schedule, food rules in English & Urdu, and automatic alerts for allergy conflicts.",
    module_triage_title: "2. Clinical Symptom Triage",
    module_triage_desc:
      "Conversational multi-turn triage chat with instant urgency evaluation (Emergency, Urgent, Routine, Home Care) and direct emergency hotline escalation.",
    module_sbar_title: "3. Doctor Handover Card (SBAR)",
    module_sbar_desc:
      "1-click printable clinical summary (Situation, Background, Assessment, Recommendation) structured for your physician visit.",

    dash_greeting: "Assalam o Alaikum",
    dash_subtitle: "Your personal health profile and clinical AI triage companion are ready.",
    dash_triage_btn: "Start Symptom Triage",
    dash_vitals_title: "Registered Health Profile",
    dash_age: "Age",
    dash_gender: "Gender",
    dash_conditions: "Chronic Conditions",
    dash_allergies: "Drug & Food Allergies",
    dash_meds: "Current Medications",
    dash_none_reported: "None reported",
    dash_edit_profile: "Update Health Profile",

    meds_title: "Prescription Demystifier",
    meds_subtitle:
      "Type medicine names or click a preset to generate a 24-hour visual dosing schedule, food precautions, and automated allergy conflict checks.",
    meds_input_label: "Enter Medication Names & Dosages",
    meds_input_placeholder: "e.g. Augmentin 625mg, Panadol 500mg, Metformin 500mg...",
    meds_presets_label: "Quick-Fill Hackathon Presets:",
    meds_btn_analyze: "Analyze & Demystify Prescription",
    meds_btn_analyzing: "Analyzing Prescription via Groq AI...",
    meds_results_title: "Decoded Prescription Schedule",
    meds_allergy_alert: "ALLERGY CONFLICT WARNING",
    meds_schedule_title: "24-Hour Schedule",
    meds_morning: "Morning",
    meds_afternoon: "Afternoon",
    meds_evening: "Evening",
    meds_night: "Night",
    meds_food_instruction: "Food & Intake Guidelines",
    meds_warnings: "Important Precautions",

    triage_title: "Clinical Symptom Triage Chat",
    triage_subtitle:
      "Conversational intake powered by evidence-based WHO protocols. Evaluates urgency and provides safe navigation without diagnosing.",
    triage_starter_label: "Common Hackathon Scenario Chips:",
    triage_input_placeholder: "Describe your symptoms (e.g. 'Mujhe tez bukhar hai', 'Chest pain', 'Severe vomiting')...",
    triage_btn_send: "Send",
    triage_btn_reset: "Reset Chat",
    triage_btn_sbar: "Generate Doctor Handover Card (SBAR)",
    triage_emergency_banner_title: "Critical Medical Emergency Alert",
    triage_emergency_banner_desc:
      "These symptoms may represent a life-threatening condition. Do not wait for an online assessment. Proceed to the nearest emergency room immediately.",
    triage_emergency_call_btn: "Call 1122 (Ambulance)",

    profile_title: "Personal Health Profile",
    profile_subtitle:
      "Your chronic conditions, allergies, and ongoing medications are used by TabeebCare to detect dangerous drug interactions and personalize clinical triage.",
    profile_basic_info: "Demographic Information",
    profile_age_label: "Age (Years)",
    profile_gender_label: "Gender",
    profile_conditions_title: "Diagnosed Chronic Conditions",
    profile_allergies_title: "Known Drug & Substance Allergies",
    profile_meds_title: "Active Daily Medications",
    profile_add_btn: "Add",
    profile_saved_toast: "Health profile updated and saved securely!",
  },

  ur: {
    nav_brand: "طبیب کیئر",
    nav_tagline: "صحت گائیڈ اور علامات ٹریآج",
    nav_dashboard: "ڈیش بورڈ",
    nav_meds: "نسخہ ڈیکوڈر",
    nav_triage: "علامات ٹریآج",
    nav_profile: "طبی پروفائل",
    nav_signin: "لاگ ان",
    nav_signup: "اکاؤنٹ بنائیں",
    nav_demo: "جج ڈیمو موڈ",
    nav_logout: "لاگ آؤٹ",
    nav_menu: "مینو",
    nav_close: "بند کریں",

    btn_save: "تبدیلیاں محفوظ کریں",
    btn_saving: "محفوظ ہو رہا ہے...",
    btn_cancel: "منسوخ",
    btn_close: "بند کریں",
    btn_submit: "ارسال کریں",
    btn_loading: "عمل جاری ہے...",
    btn_print: "پرنٹ / محفوظ کریں",
    btn_view: "دیکھیں",
    btn_open: "ماڈیول کھولیں",
    badge_demo: "ڈیمو مریض",
    badge_emergency: "ہنگامی صورتحال",
    badge_urgent: "فوری نگہداشت",
    badge_routine: "معمول کا معائنہ",
    badge_home: "گھریلو دیکھ بھال",

    footer_desc:
      "طبیب کیئر پاکستانی مریضوں کے لیے اقوام متحدہ کے ایس ڈی جی 3 کے تحت تیار کردہ جدید ترین AI طبی رہنما، نسخہ ڈیکوڈر اور کلینیکل ٹریآج پلیٹ فارم ہے۔",
    footer_quick_links: "فوری لنکس",
    footer_emergency_title: "ہنگامی ہیلپ لائنز (پاکستان)",
    footer_emergency_1122: "ریسکیو 1122 (ایمبولینس و ایمرجنسی)",
    footer_emergency_umang: "امنگ ذہنی صحت ہیلپ لائن: 0317-4288665",
    footer_disclaimer_title: "طبی تنبیہ",
    footer_disclaimer_text:
      "طبیب کیئر ایک معلوماتی اور رہنمائی کا ٹول ہے۔ یہ ڈاکٹر کے مشورے یا علاج کا متبادل نہیں ہے۔ ہنگامی صورت میں فوری 1122 پر کال کریں۔",
    footer_privacy: "پرائیویسی پالیسی",
    footer_terms: "شرائط و ضوابط",
    footer_copyright: "© 2026 طبیب کیئر۔ ایس ڈی جی 3 ہیکاتھون اقدام۔ جملہ حقوق محفوظ ہیں۔",
    footer_sdg3: "اقوام متحدہ SDG 3: اچھی صحت اور خوشحالی",

    hero_badge: "ایس ڈی جی 3 ہیکاتھون اقدام • منہاج یونیورسٹی لاہور",
    hero_title: "واضح نسخہ، محفوظ ادویات اور فوری کلینیکل رہنمائی",
    hero_subtitle:
      "ڈاکٹر کے نسخے کو آسان اردو اور انگریزی میں سمجھیں، ڈبلیو ایچ او پروٹوکول پر مبنی علامات کا فوری جائزہ حاصل کریں، اور ڈاکٹر کے لیے جامع ہینڈ اوور کارڈ تیار کریں۔",
    hero_cta_dashboard: "ڈیش بورڈ پر جائیں",
    hero_cta_demo: "⚡ فوری جج ڈیمو لاگ ان",
    hero_cta_signup: "مفت اکاؤنٹ بنائیں",
    hero_trust_offline: "محفوظ انکرپٹڈ سیشنز اور نجی طبی ریکارڈ",
    hero_trust_who: "ڈبلیو ایچ او کلینیکل پروٹوکولز پر مبنی",
    hero_trust_fast: "ایک سیکنڈ سے کم تیز رفتار Groq AI",
    modules_title: "طبیب کیئر کے اہم ماڈیولز",
    modules_subtitle: "بنیادی صحت کے تین بڑے مسائل کا مستند حل",
    module_meds_title: "1. نسخہ و ادویات ڈیکوڈر",
    module_meds_desc:
      "دواؤں کے نام لکھیں اور روزانہ صبح، دوپہر، شام، رات کا مکمل شیڈول، کھانے کے ساتھ ہدایات اور الرجی کے خطرات کے انتباہ حاصل کریں۔",
    module_triage_title: "2. علامات ٹریآج چیٹ",
    module_triage_desc:
      "قدرتی گفتگو کے ذریعے اپنی علامات بتائیں، خطرے کی سطح (ایمرجنسی، فوری، معمول، گھر پر دیکھ بھال) معلوم کریں اور ہنگامی صورت میں 1122 پر رابطہ کریں۔",
    module_sbar_title: "3. ڈاکٹر ہینڈ اوور کارڈ (SBAR)",
    module_sbar_desc:
      "اپنے کلینیکل معائنے کا 1-کلک پرنٹ ایبل خلاصہ تیار کریں جو ڈاکٹر کو آپ کی حالت سمجھانے میں مدد فراہم کرے۔",

    dash_greeting: "السلام علیکم",
    dash_subtitle: "آپ کا ذاتی ہیلتھ پورٹل اور AI طبی مشیر معاونت کے لیے تیار ہے۔",
    dash_triage_btn: "علامات ٹریآج شروع کریں",
    dash_vitals_title: "درج شدہ ہیلتھ پروفائل",
    dash_age: "عمر",
    dash_gender: "جنس",
    dash_conditions: "دائمی بیماریاں",
    dash_allergies: "معلوم الرجیز",
    dash_meds: "موجودہ ادویات",
    dash_none_reported: "کوئی نہیں",
    dash_edit_profile: "پروفائل تبدیل کریں",

    meds_title: "نسخہ و ادویات ڈیکوڈر",
    meds_subtitle:
      "اپنی ادویات کے نام درج کریں یا تیار نسخے پر کلک کر کے 24 گھنٹے کا شیڈول، پرہیز اور الرجی کے خطرات جانیں۔",
    meds_input_label: "ادویات کے نام اور مقدار درج کریں",
    meds_input_placeholder: "مثلاً: Augmentin 625mg, Panadol 500mg, Metformin 500mg...",
    meds_presets_label: "ہیکاتھون ڈیمو نسخے:",
    meds_btn_analyze: "نسخہ چیک اور ڈی کوڈ کریں",
    meds_btn_analyzing: "نسخے کا تجزیہ ہو رہا ہے...",
    meds_results_title: "تجزیہ شدہ ادویات کا شیڈول",
    meds_allergy_alert: "الرجی کا شدید خطرہ (انتباہ)",
    meds_schedule_title: "24 گھنٹے کی خوراک کا شیڈول",
    meds_morning: "صبح",
    meds_afternoon: "دوپہر",
    meds_evening: "شام",
    meds_night: "رات",
    meds_food_instruction: "کھانے کے ساتھ ہدایات",
    meds_warnings: "اہم احتیاطی تدابیر",

    triage_title: "طبی علامات ٹریآج چیٹ",
    triage_subtitle:
      "ڈبلیو ایچ او کے رہنما اصولوں کے مطابق علامات کا باہمی جائزہ۔ بغیر کسی غلط تشخیص کے خطرے کی درست درجہ بندی۔",
    triage_starter_label: "ہیکاتھون عام علامات:",
    triage_input_placeholder: "اپنی علامات بیان کریں (مثلاً: 'مجھے 2 دن سے تیز بخار ہے'، 'سینے میں درد ہے')...",
    triage_btn_send: "ارسال کریں",
    triage_btn_reset: "گفتگو نئی کریں",
    triage_btn_sbar: "ڈاکٹر ہینڈ اوور کارڈ حاصل کریں (SBAR)",
    triage_emergency_banner_title: "فوری طبی ایمرجنسی الرٹ",
    triage_emergency_banner_desc:
      "یہ علامات جان لیوا ایمرجنسی ہو سکتی ہیں۔ آن لائن چیٹ کے نتائج کا انتظار نہ کریں اور فوراً قریبی ہسپتال یا 1122 سے رابطہ کریں۔",
    triage_emergency_call_btn: "1122 پر کال کریں (ریسکیو)",

    profile_title: "ذاتی طبی پروفائل",
    profile_subtitle:
      "آپ کی دائمی بیماریاں، الرجیز اور موجودہ ادویات کو محفوظ کر کے نسخہ چیک اور علامات کے جائزے میں استعمال کیا جاتا ہے۔",
    profile_basic_info: "بنیادی معلومات",
    profile_age_label: "عمر (سال)",
    profile_gender_label: "جنس",
    profile_conditions_title: "تشخیص شدہ دائمی بیماریاں",
    profile_allergies_title: "ادویات یا خوراک کی الرجیز",
    profile_meds_title: "روزانہ کی موجودہ ادویات",
    profile_add_btn: "شامل کریں",
    profile_saved_toast: "طبی پروفائل کامیابی سے محفوظ ہو گئی!",
  },
};
