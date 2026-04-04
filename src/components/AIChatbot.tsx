'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, MessageCircle, Phone, Globe, ArrowRight, Users, Calendar, MapPin, Car } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type Language = 'en' | 'hi' | 'kn' | 'ta' | 'ml';

type ChatStep =
  | 'language-select'
  | 'ask-destination'
  | 'show-places'
  | 'ask-people'
  | 'ask-dates'
  | 'ask-pickup'
  | 'ask-vehicle'
  | 'confirmation'
  | 'free-chat';

// ─── Constants ───────────────────────────────────────────────────────────────

const LANGUAGES: { code: Language; label: string; native: string; emoji: string }[] = [
  { code: 'en', label: 'English', native: 'English', emoji: '1️⃣' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', emoji: '2️⃣' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', emoji: '3️⃣' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', emoji: '4️⃣' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', emoji: '5️⃣' },
];

const WHATSAPP_NUMBER = '919108597154';

// ─── Destination data (no prices) ────────────────────────────────────────────

interface Destination {
  key: string;
  places: { name: string; highlight: string }[];
}

const DESTINATIONS: Record<Language, Destination[]> = {
  en: [
    { key: 'Karnataka', places: [
      { name: 'Mysuru', highlight: 'Royal Palace & Chamundi Hills' },
      { name: 'Coorg', highlight: 'Coffee estates & Abbey Falls' },
      { name: 'Hampi', highlight: 'Ancient ruins & Stone Chariot' },
      { name: 'Chikmagalur', highlight: 'Hill stations & coffee plantations' },
      { name: 'Mangalore', highlight: 'Beaches & temples' },
    ]},
    { key: 'Kerala', places: [
      { name: 'Munnar', highlight: 'Tea gardens & cool climate' },
      { name: 'Alleppey', highlight: 'Backwaters & houseboats' },
      { name: 'Wayanad', highlight: 'Forests & waterfalls' },
      { name: 'Kovalam', highlight: 'Beautiful beach' },
      { name: 'Thekkady', highlight: 'Wildlife sanctuary' },
    ]},
    { key: 'Tamil Nadu', places: [
      { name: 'Ooty', highlight: 'Hill station & botanical garden' },
      { name: 'Madurai', highlight: 'Meenakshi Temple' },
      { name: 'Rameswaram', highlight: 'Pilgrimage & Pamban Bridge' },
      { name: 'Kodaikanal', highlight: 'Princess of hill stations' },
      { name: 'Pondicherry', highlight: 'French colonial charm' },
    ]},
    { key: 'Andhra Pradesh', places: [
      { name: 'Tirupati', highlight: 'Sacred Venkateswara Temple' },
      { name: 'Araku Valley', highlight: 'Coffee plantations & hills' },
      { name: 'Visakhapatnam', highlight: 'Beaches & submarine museum' },
    ]},
    { key: 'Goa', places: [
      { name: 'Baga Beach', highlight: 'Vibrant nightlife & water sports' },
      { name: 'Old Goa', highlight: 'Portuguese churches & heritage' },
      { name: 'Dudhsagar Falls', highlight: 'Spectacular waterfall' },
      { name: 'Palolem Beach', highlight: 'Serene crescent beach' },
    ]},
  ],
  hi: [
    { key: 'कर्नाटक', places: [
      { name: 'मैसूर', highlight: 'रॉयल पैलेस और चामुंडी हिल्स' },
      { name: 'कोड़गु', highlight: 'कॉफी एस्टेट और एब्बे फॉल्स' },
      { name: 'हम्पी', highlight: 'प्राचीन खंडहर और स्टोन चैरियट' },
      { name: 'चिकमगलूर', highlight: 'हिल स्टेशन और कॉफी प्लांटेशन' },
      { name: 'मंगलूर', highlight: 'बीच और मंदिर' },
    ]},
    { key: 'केरल', places: [
      { name: 'मुन्नार', highlight: 'चाय बागान और ठंडा मौसम' },
      { name: 'अलेप्पी', highlight: 'बैकवाटर और हाउसबोट' },
      { name: 'वायनाड', highlight: 'जंगल और झरने' },
      { name: 'कोवलम', highlight: 'सुंदर बीच' },
      { name: 'तेक्कड़ी', highlight: 'वाइल्डलाइफ सैंक्चुअरी' },
    ]},
    { key: 'तमिल नाडु', places: [
      { name: 'उड़ी', highlight: 'हिल स्टेशन और बॉटनिकल गार्डन' },
      { name: 'मदुरै', highlight: 'मीनाक्षी मंदिर' },
      { name: 'रामेश्वरम', highlight: 'तीर्थयात्रा और पंबन ब्रिज' },
      { name: 'कोडाईकनाल', highlight: 'हिल स्टेशन की राजकुमारी' },
      { name: 'पॉन्डिचेरी', highlight: 'फ्रेंच औपनिवेशिक शान' },
    ]},
    { key: 'आंध्र प्रदेश', places: [
      { name: 'तिरुपति', highlight: 'पवित्र वेंकटेश्वर मंदिर' },
      { name: 'अराकु घाटी', highlight: 'कॉफी प्लांटेशन और पहाड़' },
      { name: 'विशाखापत्तनम', highlight: 'बीच और सबमरीन म्यूजियम' },
    ]},
    { key: 'गोवा', places: [
      { name: 'बागा बीच', highlight: 'जीवंत नाइटलाइफ और वॉटर स्पोर्ट्स' },
      { name: 'ओल्ड गोवा', highlight: 'पुर्तगाली चर्च और विरासत' },
      { name: 'दूधसागर जलप्रपात', highlight: 'शानदार झरना' },
      { name: 'पालोलेम बीच', highlight: 'शांत बीच' },
    ]},
  ],
  kn: [
    { key: 'ಕರ್ನಾಟಕ', places: [
      { name: 'ಮೈಸೂರು', highlight: 'ಅರಮನೆ ಮತ್ತು ಚಾಮುಂಡಿ ಬೆಟ್ಟ' },
      { name: 'ಕೊಡಗು', highlight: 'ಕಾಫಿ ತೋಟಗಳು ಮತ್ತು ಅಬ್ಬಿ ಜಲಪಾತ' },
      { name: 'ಹಂಪಿ', highlight: 'ಪ್ರಾಚೀನ ಅವಶೇಷಗಳು ಮತ್ತು ಕಲ್ಲಿನ ರಥ' },
      { name: 'ಚಿಕ್ಮಗಳೂರು', highlight: 'ಬೆಟ್ಟದ ನಿಲಯ ಮತ್ತು ಕಾಫಿ ತೋಟಗಳು' },
      { name: 'ಮಂಗಳೂರು', highlight: 'ಬೀಚ್ ಮತ್ತು ದೇವಾಲಯಗಳು' },
    ]},
    { key: 'ಕೇರಳ', places: [
      { name: 'ಮುನ್ನಾರ್', highlight: 'ಟೀ ತೋಟಗಳು ಮತ್ತು ತಂಪು ವಾತಾವರಣ' },
      { name: 'ಅಲೆಪ್ಪಿ', highlight: 'ಬ್ಯಾಕ್‌ವಾಟರ್ ಮತ್ತು ಹೌಸ್‌ಬೋಟ್' },
      { name: 'ವಯನಾಡ', highlight: 'ಕಾಡುಗಳು ಮತ್ತು ಜಲಪಾತಗಳು' },
      { name: 'ಕೋವಲಂ', highlight: 'ಸುಂದರ ಬೀಚ್' },
      { name: 'ತೆಕ್ಕಡಿ', highlight: 'ವನ್ಯಜೀವಿ ಅಭಯಾರಣ್ಯ' },
    ]},
    { key: 'ತಮಿಳುನಾಡು', places: [
      { name: 'ಊಟಿ', highlight: 'ಬೆಟ್ಟದ ನಿಲಯ ಮತ್ತು ಸಸ್ಯೋದ್ಯಾನ' },
      { name: 'ಮಧುರೈ', highlight: 'ಮೀನಾಕ್ಷಿ ದೇವಾಲಯ' },
      { name: 'ರಾಮೇಶ್ವರಂ', highlight: 'ತೀರ್ಥಯಾತ್ರೆ ಮತ್ತು ಪಾಂಬನ್ ಸೇತುವೆ' },
      { name: 'ಕೊಡೈಕಾನಲ್', highlight: 'ಬೆಟ್ಟದ ನಿಲಯದ ರಾಜಕುಮಾರಿ' },
      { name: 'ಪಾಂಡಿಚೇರಿ', highlight: 'ಫ್ರೆಂಚ್ ವಸಾಹತು ಶೈಲಿ' },
    ]},
    { key: 'ಆಂಧ್ರ ಪ್ರದೇಶ', places: [
      { name: 'ತಿರುಪತಿ', highlight: 'ಪವಿತ್ರ ವೆಂಕಟೇಶ್ವರ ದೇವಾಲಯ' },
      { name: 'ಅರಕು ಕಣಿವೆ', highlight: 'ಕಾಫಿ ತೋಟಗಳು ಮತ್ತು ಬೆಟ್ಟಗಳು' },
      { name: 'ವಿಶಾಖಪಟ್ಟಣಂ', highlight: 'ಬೀಚ್ ಮತ್ತು ಸಬ್‌ಮರೀನ್ ವಸ್ತುಸಂಗ್ರಹಾಲಯ' },
    ]},
    { key: 'ಗೋವಾ', places: [
      { name: 'ಬಾಗಾ ಬೀಚ್', highlight: 'ಪ್ರವಾಸಿಗಳ ಬೀಚ್ ಮತ್ತು ಜಲಕ್ರೀಡೆ' },
      { name: 'ಓಲ್ಡ್ ಗೋವಾ', highlight: 'ಪೋರ್ಚುಗೀಸ್ ಚರ್ಚ್‌ಗಳು' },
      { name: 'ದೂಧಸಾಗರ ಜಲಪಾತ', highlight: 'ಅದ್ಭುತ ಜಲಪಾತ' },
      { name: 'ಪಾಲೋಲೆಮ್ ಬೀಚ್', highlight: 'ಶಾಂತ ಬೀಚ್' },
    ]},
  ],
  ta: [
    { key: 'கர்நாடகம்', places: [
      { name: 'மைசூர்', highlight: 'அரண்மனை & சாமுண்டி மலை' },
      { name: 'குடகு', highlight: 'காபி தோட்டங்கள் & அப்பே அருவி' },
      { name: 'ஹம்பி', highlight: 'பழமையான சிதைவுகள் & கல் தேர்' },
      { name: 'சிக்மகளூர்', highlight: 'மலை நிலையங்கள்' },
      { name: 'மங்களூர்', highlight: 'கடற்கரைகள் & கோவில்கள்' },
    ]},
    { key: 'கேரளம்', places: [
      { name: 'முன்னார்', highlight: 'தேயிலை தோட்டங்கள் & குளிர்ச்சி' },
      { name: 'அலெப்பி', highlight: 'பின்னோட்டங்கள் & வீட்டுப் படகு' },
      { name: 'வயநாடு', highlight: 'காடுகள் & அருவிகள்' },
      { name: 'கோவளம்', highlight: 'அழகான கடற்கரை' },
      { name: 'தேக்கடி', highlight: 'வனவிலங்கு சரணாலயம்' },
    ]},
    { key: 'தமிழ்நாடு', places: [
      { name: 'ஊட்டி', highlight: 'மலை நிலையம் & தாவரவியல் பூங்கா' },
      { name: 'மதுரை', highlight: 'மீனாட்சி கோவில்' },
      { name: 'ராமேஸ்வரம்', highlight: 'புனித யாத்திரை & பாம்பன் பாலம்' },
      { name: 'கொடைக்கானல்', highlight: 'மலை நிலையத்தின் இளவரசி' },
      { name: 'பாண்டிச்சேரி', highlight: 'பிரெஞ்சு காலனித்துவ அழகு' },
    ]},
    { key: 'ஆந்திரப் பிரதேசம்', places: [
      { name: 'திருப்பதி', highlight: 'புனித வெங்கடேஸ்வரர் கோவில்' },
      { name: 'அரக்கு பள்ளத்தாடி', highlight: 'காபி தோட்டங்கள் & மலைகள்' },
      { name: 'விசாகப்பட்டினம்', highlight: 'கடற்கரை & நீர்மூழ்கிக் கப்பல் அருங்காட்சியகம்' },
    ]},
    { key: 'கோவா', places: [
      { name: 'பாகா கடற்கரை', highlight: 'இரவு வாழ்க்கை & நீர் விளையாட்டு' },
      { name: 'பழைய கோவா', highlight: 'போர்த்துகீசிய தேவாலயங்கள்' },
      { name: 'தூத்சாகர் அருவி', highlight: 'அற்புத அருவி' },
      { name: 'பாலோலெம் கடற்கரை', highlight: 'அமைதியான கடற்கரை' },
    ]},
  ],
  ml: [
    { key: 'കർണാടക', places: [
      { name: 'മൈസൂർ', highlight: 'കൊട്ടാരം & ചാമുണ്ടി ഹിൽസ്' },
      { name: 'കൊടഗു', highlight: 'കാപ്പി തോട്ടങ്ങൾ & അബ്ബെ വെള്ളച്ചാട്ടം' },
      { name: 'ഹംപി', highlight: 'പുരാതന അവശിഷ്ടങ്ങൾ & കല്ല് രഥം' },
      { name: 'ചിക്മഗളൂർ', highlight: 'മലയ നിലയങ്ങൾ' },
      { name: 'മംഗലാപുരം', highlight: 'ബീച്ചുകൾ & ക്ഷേത്രങ്ങൾ' },
    ]},
    { key: 'കേരളം', places: [
      { name: 'മുന്നാർ', highlight: 'ടീ തോട്ടങ്ങൾ & തണുപ്പ്' },
      { name: 'ആലപ്പുഴ', highlight: 'ബാക്ക്‌വാട്ടറുകൾ & ഹൗസ്ബോട്ട്' },
      { name: 'വയനാട്', highlight: 'വനങ്ങൾ & വെള്ളച്ചാട്ടങ്ങൾ' },
      { name: 'കോവളം', highlight: 'മനോഹരമായ ബീച്ച്' },
      { name: 'തേക്കടി', highlight: 'വന്യജീവി സങ്കേതം' },
    ]},
    { key: 'തമിഴ്‌നാട്', places: [
      { name: 'ഊട്ടി', highlight: 'മലയ നിലയം & ബൊട്ടാണിക്കൽ ഗാർഡൻ' },
      { name: 'മധുരൈ', highlight: 'മീനാക്ഷി ക്ഷേത്രം' },
      { name: 'രാമേശ്വരം', highlight: 'തീർത്ഥാടനം & പാമ്പൻ പാലം' },
      { name: 'കൊടൈക്കനാൽ', highlight: 'മലയ നിലയത്തിന്റെ രാജകുമാരി' },
      { name: 'പോണ്ടിച്ചേരി', highlight: 'ഫ്രഞ്ച് കൊളോണിയൽ ചാരം' },
    ]},
    { key: 'ആന്ധ്രാപ്രദേശ്', places: [
      { name: 'തിരുപ്പതി', highlight: 'പുണ്യ വെങ്കടേശ്വര ക്ഷേത്രം' },
      { name: 'അരക്കു താഴ്വര', highlight: 'കാപ്പി തോട്ടങ്ങൾ & മലകൾ' },
      { name: 'വിശാഖപട്ടണം', highlight: 'ബീച്ചുകൾ & സബ്മറൈൻ മ്യൂസിയം' },
    ]},
    { key: 'ഗോവ', places: [
      { name: 'ബാഗ ബീച്ച്', highlight: 'രാത്രി ജീവിതം & വാട്ടർ സ്പോർട്സ്' },
      { name: 'ഓൾഡ് ഗോവ', highlight: 'പോർച്ചുഗീസ് പള്ളികൾ' },
      { name: 'ദുധ്സാഗർ വെള്ളച്ചാട്ടം', highlight: 'മനോഹരമായ വെള്ളച്ചാട്ടം' },
      { name: 'പാലോലെം ബീച്ച്', highlight: 'സമാധാനമായ ബീച്ച്' },
    ]},
  ],
};

// ─── Multi-step conversation messages ────────────────────────────────────────

const STEP_MESSAGES: Record<Language, Record<string, string>> = {
  en: {
    greeting: "Hello 👋 Welcome to **RRM Holidays**!\n\nWe help you explore South India with customized vehicle services 🚗\n\nPlease choose your preferred language:",
    destination: "Great! 😊 Please tell us which destination or state you would like to explore:",
    askPeople: "How many people are traveling? 👥",
    askDates: "What are your travel dates (approximate)? 📅",
    askPickup: "Where should we pick you up? 📍",
    askVehicle: "What type of vehicle do you prefer?",
    confirmation: "Thank you for the details 👍\n\nWe provide customized vehicle services based on your requirement 🚗\n\nFor booking and best quotation, please connect with us directly on WhatsApp.\n\nOur team will respond quickly with a custom plan for you!",
    priceReply: "Kindly share your travel details. 📋\n\nWe will provide the best quotation on WhatsApp based on your requirement.\n\nLet me help you plan — which destination would you like to explore?",
    packageReply: "We do not provide fixed packages. 🚗\n\nWe offer fully customized travel with vehicle service as per your needs.\n\nPlease share your destination and travel details — we will tailor everything for you!",
    engagement: "Would you like suggestions for popular places in your selected destination? 😊",
    confused: 'No worries 😊\n\nTell us your group size and travel plan, we will suggest the best vehicle for you.',
    patience: "Thank you for your patience 🙏\n\nOur team is checking availability and will respond shortly.\n\nMeanwhile, feel free to share any additional requirements 😊",
  },
  hi: {
    greeting: "नमस्ते 👋 **RRM Holidays** में आपका स्वागत है!\n\nहम आपको कस्टमाइज्ड वाहन सेवा के साथ दक्षिण भारत की यात्रा कराते हैं 🚗\n\nकृपया अपनी भाषा चुनें:",
    destination: "बढ़िया! 😊 कृपया बताएं आप कौन सा डेस्टिनेशन या राज्य घूमना चाहते हैं:",
    askPeople: "कितने लोग यात्रा कर रहे हैं? 👥",
    askDates: "आपकी यात्रा की तारीख क्या है (लगभग)? 📅",
    askPickup: "हम आपको कहां से पिकअप करें? 📍",
    askVehicle: "आपको कौन सा वाहन पसंद है?",
    confirmation: "आपके विवरण के लिए धन्यवाद 👍\n\nहमारी टीम आपके लिए सबसे अच्छी योजना तैयार कर रही है।\n\nहम आपकी ज़रूरत के अनुसार कस्टमाइज्ड वाहन सेवा प्रदान करते हैं 🚗\n\nहमारी टीम जल्द ही WhatsApp पर कोट के साथ संपर्क करेगी।",
    priceReply: "कृपया अपनी यात्रा की जानकारी साझा करें। 📋\n\nहम आपकी ज़रूरत के अनुसार WhatsApp पर सबसे अच्छा कोट प्रदान करेंगे।",
    packageReply: "हम फिक्स्ड पैकेज नहीं देते। 🚗\n\nहम आपकी ज़रूरत के अनुसार पूरी तरह कस्टमाइज्ड यात्रा और वाहन सेवा देते हैं।",
    engagement: "क्या आप अपने चुने हुए डेस्टिनेशन के लोकप्रिय स्थलों के सुझाव चाहते हैं? 😊",
    confused: 'कोई बात नहीं 😊\n\nहमें अपने ग्रुप साइज़ और यात्रा प्लान बताएं, हम आपके लिए सबसे अच्छा वाहन सुझाएंगे।',
    patience: "आपके धैर्य के लिए धन्यवाद 🙏\n\nहमारी टीम उपलब्धता जांच रही है और जल्द ही जवाब देगी।",
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ 👋 **RRM Holidays** ಗೆ ಸ್ವಾಗತ!\n\nನಾವು ಕಸ್ಟಮೈಜ್ಡ್ ವಾಹನ ಸೇವೆಯೊಂದಿಗೆ ದಕ್ಷಿಣ ಭಾರತವನ್ನು ಪರಿಶೀಲಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ 🚗\n\nದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕಿಸಿ:",
    destination: "ಒಳ್ಳೆಯದು! 😊 ದಯವಿಟ್ಟು ಹೇಳಿ ನೀವು ಯಾವ ತಾಣ ಅಥವಾ ರಾಜ್ಯವನ್ನು ಪರಿಶೀಲಿಸಲು ಬಯಸುತ್ತೀರಿ:",
    askPeople: "ಎಷ್ಟು ಜನರು ಪ್ರಯಾಣ ಮಾಡುತ್ತಿದ್ದಾರೆ? 👥",
    askDates: "ನಿಮ್ಮ ಪ್ರಯಾಣದ ದಿನಾಂಕ ಯಾವುದು (ಸುಮಾರು)? 📅",
    askPickup: "ನಿಮ್ಮನ್ನು ಎಲ್ಲಿ ಪಿಕಪ್ ಮಾಡಬೇಕು? 📍",
    askVehicle: "ನಿಮಗೆ ಯಾವ ಬಗೆಯ ವಾಹನ ಇಷ್ಟವಾಗುತ್ತದೆ?",
    confirmation: "ವಿವರಗಳಿಗೆ ಧನ್ಯವಾದಗಳು 👍\n\nನಮ್ಮ ತಂಡ ನಿಮಗಾಗಿ ಉತ್ತಮ ಯೋಜನೆಯನ್ನು ತಯಾರಿಸುತ್ತಿದೆ.\n\nನಾವು ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಕಸ್ಟಮೈಜ್ಡ್ ವಾಹನ ಸೇವೆಯನ್ನು ಒದಗಿಸುತ್ತೇವೆ 🚗\n\nನಮ್ಮ ತಂಡವು ಶೀಘ್ರದಲ್ಲಿ WhatsApp ಮೂಲಕ ಕೋಟೇಶನ್ ನೀಡುತ್ತದೆ.",
    priceReply: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಯಾಣದ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ. 📋\n\nನಾವು ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ WhatsApp ಮೇಲೆ ಉತ್ತಮ ಕೋಟೇಶನ್ ನೀಡುತ್ತೇವೆ.",
    packageReply: "ನಾವು ನಿಗದಿತ ಪ್ಯಾಕೇಜ್‌ಗಳನ್ನು ನೀಡುವುದಿಲ್ಲ. 🚗\n\nನಾವು ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಸಂಪೂರ್ಣ ಕಸ್ಟಮೈಜ್ಡ್ ಪ್ರಯಾಣ ಸೇವೆಯನ್ನು ನೀಡುತ್ತೇವೆ.",
    engagement: "ನೀವು ಆಯ್ಕೆ ಮಾಡಿದ ತಾಣದ ಜನಪ್ರಿಯ ಸ್ಥಳಗಳ ಸಲಹೆಗಳನ್ನು ಬಯಸುತ್ತೀರಾ? 😊",
    confused: 'ಚಿಂತೆ ಇಲ್ಲ 😊\n\nನಮಗೆ ನಿಮ್ಮ ಗುಂಪಿನ ಗಾತ್ರ ಮತ್ತು ಪ್ರಯಾಣ ಯೋಜನೆಯನ್ನು ಹೇಳಿ, ನಾವು ನಿಮಗೆ ಉತ್ತಮ ವಾಹನವನ್ನು ಸೂಚಿಸುತ್ತೇವೆ.',
    patience: "ನಿಮ್ಮ ತಾಳ್ಮೆಗೆ ಧನ್ಯವಾದಗಳು 🙏\n\nನಮ್ಮ ತಂಡ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದೆ.",
  },
  ta: {
    greeting: "வணக்கம் 👋 **RRM Holidays** க்கு வரவேற்கிறோம்!\n\nதனிப்பயன் வாகன சேவையுடன் தென்னிந்தியாவை ஆராய உங்களுக்கு உதவுகிறோம் 🚗\n\nஉங்கள் மொழியைத் தேர்ந்தெடுக்கவும்:",
    destination: "அருமை! 😊 எந்த இடத்தையோ அல்லது மாநிலத்தையோ பார்வையிட விரும்புகிறீர்களா சொல்லுங்கள்:",
    askPeople: "எத்தனை பேர் பயணம் செய்கிறார்கள்? 👥",
    askDates: "பயண தேதி என்ன (தோராயமாக)? 📅",
    askPickup: "உங்களை எங்கு பிக்கப் செய்ய வேண்டும்? 📍",
    askVehicle: "எந்த வகை வாகனம் விரும்புகிறீர்கள்?",
    confirmation: "விவரங்களுக்கு நன்றி 👍\n\nஎங்கள் குழு உங்களுக்கு சிறந்த திட்டத்தை தயாரிக்கிறது.\n\nஉங்கள் தேவைக்கு ஏற்ற தனிப்பயன் வாகன சேவை வழங்குகிறோம் 🚗\n\nஎங்கள் குழு விரைவில் WhatsApp-ல் தொடர்பு கொள்ளும்.",
    priceReply: "தயவுசெய்து உங்கள் பயண விவரங்களை பகிரவும். 📋\n\nஉங்கள் தேவைக்கு ஏற்ற சிறந்த கோட்டேஷனை WhatsApp-ல் வழங்குவோம்.",
    packageReply: "நாங்கள் நிலையான தொகுப்புகள் வழங்குவதில்லை. 🚗\n\nஉங்கள் தேவைக்கு ஏற்ற முழுமையான தனிப்பயன் பயண சேவை வழங்குகிறோம்.",
    engagement: "நீங்கள் தேர்வு செய்த இடத்தின் பிரபலமான இடங்களை பற்றிய பரிந்துரைகள் வேண்டுமா? 😊",
    confused: 'கவலையில்லை 😊\n\nஉங்கள் குழு அளவு மற்றும் பயணத் திட்டத்தை சொல்லுங்கள், நாங்கள் உங்களுக்கு சிறந்த வாகனத்தை பரிந்துரைப்போம்.',
    patience: "உங்கள் பொறுமைக்கு நன்றி 🙏\n\nஎங்கள் குழு கிடைக்கும் தன்மையை சரிபார்க்கிறது.",
  },
  ml: {
    greeting: "നമസ്കാരം 👋 **RRM Holidays**-ലേക്ക് സ്വാഗതം!\n\nകസ്റ്റം വാഹന സേവനത്തോടെ ദക്ഷിണേന്ത്യ പര്യടനം ചെയ്യാൻ സഹായിക്കുന്നു 🚗\n\nദയവായി നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക:",
    destination: "നന്ദി! 😊 ഏത് ലക്ഷ്യസ്ഥാനമോ സംസ്ഥാനമോ സന്ദർശിക്കാൻ ആഗ്രഹിക്കുന്നുവോ പറയൂ:",
    askPeople: "എത്ര പേർ യാത്ര ചെയ്യുന്നു? 👥",
    askDates: "യാത്ര തീയതി എന്താണ് (ഏകദേശം)? 📅",
    askPickup: "എവിടെ നിന്നാണ് പിക്കപ്പ് ചെയ്യേണ്ടത്? 📍",
    askVehicle: "ഏത് തരം വാഹനമാണ് ഇഷ്ടപ്പെടുന്നത്?",
    confirmation: "വിശദാംശങ്ങൾക്ക് നന്ദി 👍\n\nഞങ്ങളുടെ ടീം നിങ്ങൾക്കായി മികച്ച പ്ലാൻ തയ്യാറാക്കുന്നു.\n\nഞങ്ങൾ നിങ്ങളുടെ ആവശ്യങ്ങൾക്ക് അനുയോജ്യമായ കസ്റ്റം വാഹന സേവനം നൽകുന്നു 🚗\n\nഞങ്ങളുടെ ടീം ഉടൻ WhatsApp-ൽ കോട്ടേഷനോടൊപ്പം ബന്ധപ്പെടും.",
    priceReply: "ദയവായി നിങ്ങളുടെ യാത്രാ വിശദാംശങ്ങൾ പങ്കിടുക. 📋\n\nനിങ്ങളുടെ ആവശ്യങ്ങൾക്ക് അനുയോജ്യമായ മികച്ച കോട്ടേഷൻ WhatsApp-ൽ നൽകും.",
    packageReply: "ഞങ്ങൾ ഫിക്സ്ഡ് പാക്കേജുകൾ നൽകുന്നില്ല. 🚗\n\nഞങ്ങൾ നിങ്ങളുടെ ആവശ്യങ്ങൾക്ക് അനുയോജ്യമായ കസ്റ്റം ട്രാവൽ സേവനം നൽകുന്നു.",
    engagement: "നിങ്ങൾ തിരഞ്ഞെടുത്ത ലക്ഷ്യസ്ഥാനത്തിലെ ജനപ്രിയ സ്ഥലങ്ങളെക്കുറിച്ച് നിർദ്ദേശങ്ങൾ വേണോ? 😊",
    confused: 'വിഷമിക്കേണ്ട 😊\n\nനിങ്ങളുടെ ഗ്രൂപ്പ് വലുപ്പവും യാത്രാ പ്ലാനും പറയൂ, ഞങ്ങൾ നിങ്ങൾക്ക് മികച്ച വാഹനം നിർദ്ദേശിക്കും.',
    patience: "നിങ്ങളുടെ ക്ഷമയ്ക്ക് നന്ദി 🙏\n\nഞങ്ങളുടെ ടീം ലഭ്യത പരിശോധിക്കുകയാണ്.",
  },
};

const DESTINATION_KEYS: Record<Language, string[]> = {
  en: ['Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Goa'],
  hi: ['कर्नाटक', 'केरल', 'तमिल नाडु', 'आंध्र प्रदेश', 'गोवा'],
  kn: ['ಕರ್ನಾಟಕ', 'ಕೇರಳ', 'ತಮಿಳುನಾಡು', 'ಆಂಧ್ರ ಪ್ರದೇಶ', 'ಗೋವಾ'],
  ta: ['கர்நாடகம்', 'கேரளம்', 'தமிழ்நாடு', 'ஆந்திரப் பிரதேசம்', 'கோவா'],
  ml: ['കർണാടക', 'കേരളം', 'തമിഴ്‌നാട്', 'ആന്ധ്രാപ്രദേശ്', 'ഗോവ'],
};

const VEHICLE_OPTIONS: Record<Language, string[]> = {
  en: ['Sedan (Etios/Dzire)', 'Innova (7 seater)', 'Innova Crysta (Premium)', 'Tempo Traveller (12)', 'Urbania (10/13/16)', 'Mini Bus (21)', 'Bus (25/33/50)', 'Need Suggestion'],
  hi: ['सेडान (एटियोस/डिज़ायर)', 'इनोवा (7 सीटर)', 'इनोवा क्रिस्टा (प्रीमियम)', 'टेम्पो ट्रैवलर (12)', 'अर्बेनिया (10/13/16)', 'मिनी बस (21)', 'बस (25/33/50)', 'सुझाव चाहिए'],
  kn: ['ಸೆಡಾನ್ (ಎಟಿಯೋಸ್/ಡಿಜೈರ್)', 'ಇನ್ನೋವಾ (7 ಆಸನ)', 'ಇನ್ನೋವಾ ಕ್ರಿಸ್ಟಾ (ಪ್ರೀಮಿಯಂ)', 'ಟೆಂಪೊ ಟ್ರಾವೆಲರ್ (12)', 'ಅರ್ಬೇನಿಯಾ (10/13/16)', 'ಮಿನಿ ಬಸ್ (21)', 'ಬಸ್ (25/33/50)', 'ಸಲಹೆ ಬೇಕು'],
  ta: ['செடான் (எட்டியோஸ்/டிஸைர்)', 'இன்னோவா (7 இருக்கை)', 'இன்னோவா கிரிஸ்டா (பிரீமியம்)', 'டெம்போ டிராவலர் (12)', 'அர்பனியா (10/13/16)', 'மினி பஸ் (21)', 'பஸ் (25/33/50)', 'பரிந்துரை வேண்டும்'],
  ml: ['സെഡാൻ (എറ്റിയോസ്/ഡിസൈർ)', 'ഇന്നോവ (7 സീറ്റ്)', 'ഇന്നോവ ക്രിസ്റ്റ (പ്രീമിയം)', 'ടെമ്പോ ട്രാവലർ (12)', 'അർബാനിയ (10/13/16)', 'മിനി ബസ് (21)', 'ബസ് (25/33/50)', 'നിർദ്ദേശം വേണ്ടി'],
};

// ─── Vehicle Overview Message (NO prices) ─────────────────────────────────────

const VEHICLE_OVERVIEW: Record<Language, string> = {
  en: '🚗 We have a wide range of vehicles for your travel needs:\n\n• **Sedan** – Perfect for 2–4 people, comfortable for city rides & short trips\n• **MUV (Innova)** – Suitable for 4–7 people, more space and comfort\n• **Premium MUV (Crysta)** – Luxury seating for 4–7, captain seats & entertainment\n• **Tempo Traveller** – Best for 8–12 people, ideal for group travel\n• **Force Urbania** – Modern 10/13/16 seater, best for medium to large groups\n• **Mini Bus** – Comfortable for 15–21 people, corporate & wedding events\n• **Bus & Luxury Coach** – For 25–50 people, pilgrimages & large group tours\n\nAll our vehicles are well-maintained and driven by professional drivers.\n\nWe provide customized vehicle services based on your travel plan. 🗺️',
  hi: '🚗 हम आपकी यात्रा ज़रूरत के लिए कई तरह के वाहन उपलब्ध कराते हैं:\n\n• **सेडान** – 2–4 लोगों के लिए, शहर की सवारी और छोटी यात्राओं के लिए\n• **एमयूवी (इनोवा)** – 4–7 लोगों के लिए, अधिक जगह और आराम\n• **प्रीमियम एमयूवी (क्रिस्टा)** – 4–7 लोगों के लिए लक्ज़री सीटिंग\n• **टेम्पो ट्रैवलर** – 8–12 लोगों के लिए, समूह यात्रा के लिए सबसे अच्छा\n• **फोर्स अर्बेनिया** – आधुनिक 10/13/16 सीटर, मध्यम से बड़े समूहों के लिए\n• **मिनी बस** – 15–21 लोगों के लिए, कॉर्पोरेट और शादी समारोह\n• **बस और लक्ज़री कोच** – 25–50 लोगों के लिए, तीर्थयात्रा और बड़े समूह\n\nहमारे सभी वाहन अच्छी तरह से रखरखाव किए गए हैं और पेशेवर ड्राइवर चलाते हैं।\n\nहम आपकी यात्रा योजना के अनुसार कस्टमाइज्ड वाहन सेवा प्रदान करते हैं। 🗺️',
  kn: '🚗 ನಾವು ನಿಮ್ಮ ಪ್ರಯಾಣದ ಅಗತ್ಯಗಳಿಗಾಗಿ ವಿವಿಧ ರೀತಿಯ ವಾಹನಗಳನ್ನು ನೀಡುತ್ತೇವೆ:\n\n• **ಸೆಡಾನ್** – 2–4 ಜನರಿಗೆ, ನಗರ ಸವಾರಿ ಮತ್ತು ಸಣ್ಣ ಪ್ರವಾಸಗಳಿಗೆ\n• **ಎಂಯುವಿ (ಇನ್ನೋವಾ)** – 4–7 ಜನರಿಗೆ, ಹೆಚ್ಚು ಜಾಗ ಮತ್ತು ಆರಾಮ\n• **ಪ್ರೀಮಿಯಂ ಎಂಯುವಿ (ಕ್ರಿಸ್ಟಾ)** – 4–7 ಜನರಿಗೆ ಐಷಾರಾಮಿ ಆಸನ\n• **ಟೆಂಪೊ ಟ್ರಾವೆಲರ್** – 8–12 ಜನರಿಗೆ, ಗುಂಪು ಪ್ರಯಾಣಕ್ಕೆ\n• **ಫೋರ್ಸ್ ಅರ್ಬೇನಿಯಾ** – ಆಧುನಿಕ 10/13/16 ಆಸನ, ಮಧ್ಯಮ ದಿಂದ ದೊಡ್ಡ ಗುಂಪುಗಳಿಗೆ\n• **ಮಿನಿ ಬಸ್** – 15–21 ಜನರಿಗೆ, ಕಾರ್ಪೊರೇಟ್ ಮತ್ತು ಮದುವೆ ಸಮಾರಂಭ\n• **ಬಸ್ ಮತ್ತು ಲಕ್ಸರಿ ಕೋಚ್** – 25–50 ಜನರಿಗೆ, ತೀರ್ಥಯಾತ್ರೆ ಮತ್ತು ದೊಡ್ಡ ಗುಂಪು\n\nನಮ್ಮ ಎಲ್ಲಾ ವಾಹನಗಳು ಚೆನ್ನಾಗಿ ನಿರ್ವಹಿಸಲ್ಪಟ್ಟಿವೆ.\n\nನಾವು ನಿಮ್ಮ ಪ್ರಯಾಣ ಯೋಜನೆಯ ಆಧಾರದ ಮೇಲೆ ಕಸ್ಟಮೈಜ್ಡ್ ವಾಹನ ಸೇವೆಯನ್ನು ಒದಗಿಸುತ್ತೇವೆ. 🗺️',
  ta: '🚗 நாங்கள் உங்கள் பயணத் தேவைகளுக்கு பல்வேறு வகை வாகனங்களை வழங்குகிறோம்:\n\n• **செடான்** – 2–4 பேருக்கு, நகர சுற்றுப்பயணம் மற்றும் குறுகிய பயணங்களுக்கு\n• **எம்யூவி (இன்னோவா)** – 4–7 பேருக்கு, அதிக இடமும் ஆறுதலும்\n• **பிரீமியம் எம்யூவி (கிரிஸ்டா)** – 4–7 பேருக்கு அலங்கார இருக்கைகள்\n• **டெம்போ டிராவலர்** – 8–12 பேருக்கு, குழு பயணத்திற்கு சிறந்தது\n• **ஃபோர்ஸ் அர்பனியா** – நவீன 10/13/16 இருக்கை, நடுத்தர முதல் பெரிய குழுக்களுக்கு\n• **மினி பஸ்** – 15–21 பேருக்கு, நிறுவன மற்றும் திருமண நிகழ்வுகள்\n• **பஸ் & லக்சரி கோச்** – 25–50 பேருக்கு, புனித யாத்திரை மற்றும் பெரிய குழு\n\nஎங்கள் அனைத்து வாகனங்களும் நல்ல நிலையில் உள்ளன.\n\nநாங்கள் உங்கள் பயணத் திட்டத்திற்கு ஏற்ற தனிப்பயன் வாகன சேவையை வழங்குகிறோம். 🗺️',
  ml: '🚗 ഞങ്ങൾ നിങ്ങളുടെ യാത്രാ ആവശ്യങ്ങൾക്കായി വിവിധ തരം വാഹനങ്ങൾ നൽകുന്നു:\n\n• **സെഡാൻ** – 2–4 പേർക്ക്, നഗര യാത്രയ്ക്കും ഹ്രസ്വ ട്രിപ്പുകൾക്കും\n• **എംയുവി (ഇന്നോവ)** – 4–7 പേർക്ക്, കൂടുതൽ ഇടവും സൗകര്യവും\n• **പ്രീമിയം എംയുവി (ക്രിസ്റ്റ)** – 4–7 പേർക്ക് ലക്ഷറി സീറ്റിംഗ്\n• **ടെമ്പോ ട്രാവലർ** – 8–12 പേർക്ക്, ഗ്രൂപ്പ് യാത്രയ്ക്ക് മികച്ചത്\n• **ഫോഴ്സ് അർബാനിയ** – ആധുനിക 10/13/16 സീറ്റ്, ഇടത്തരം മുതൽ വലുത് ഗ്രൂപ്പുകൾക്ക്\n• **മിനി ബസ്** – 15–21 പേർക്ക്, കോർപ്പറേറ്റ് & വിവാഹ ചടങ്ങുകൾ\n• **ബസ് & ലക്ഷറി കോച്ച്** – 25–50 പേർക്ക്, തീർഥാടനം & വലുത് ഗ്രൂപ്പ്\n\nഞങ്ങളുടെ എല്ലാ വാഹനങ്ങളും നന്നായി പരിപാലിക്കുന്നവയാണ്.\n\nഞങ്ങൾ നിങ്ങളുടെ യാത്രാ പ്ലാനിന് അനുയോജ്യമായ കസ്റ്റം വാഹന സേവനം നൽകുന്നു. 🗺️',
};

const CONFUSED_REPLY: Record<Language, string> = {
  en: 'No worries 😊\n\nTell us your group size and travel plan, we will suggest the best vehicle for you.',
  hi: 'कोई बात नहीं 😊\n\nहमें अपने ग्रुप साइज़ और यात्रा प्लान बताएं, हम आपके लिए सबसे अच्छा वाहन सुझाएंगे।',
  kn: 'ಚಿಂತೆ ಇಲ್ಲ 😊\n\nನಮಗೆ ನಿಮ್ಮ ಗುಂಪಿನ ಗಾತ್ರ ಮತ್ತು ಪ್ರಯಾಣ ಯೋಜನೆಯನ್ನು ಹೇಳಿ, ನಾವು ನಿಮಗೆ ಉತ್ತಮ ವಾಹನವನ್ನು ಸೂಚಿಸುತ್ತೇವೆ.',
  ta: 'கவலையில்லை 😊\n\nஉங்கள் குழு அளவு மற்றும் பயணத் திட்டத்தை சொல்லுங்கள், நாங்கள் உங்களுக்கு சிறந்த வாகனத்தை பரிந்துரைப்போம்.',
  ml: 'വിഷമിക്കേണ്ട 😊\n\nനിങ്ങളുടെ ഗ്രൂപ്പ് വലുപ്പവും യാത്രാ പ്ലാനും പറയൂ, ഞങ്ങൾ നിങ്ങൾക്ക് മികച്ച വാഹനം നിർദ്ദേശിക്കും.',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatStep, setChatStep] = useState<ChatStep>('language-select');
  const [language, setLanguage] = useState<Language>('en');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [customerData, setCustomerData] = useState({ people: '', dates: '', pickup: '', vehicle: '' });
  const [showInactivityPopup, setShowInactivityPopup] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasShownPopupRef = useRef(false);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  // Focus input
  useEffect(() => {
    if (isOpen && chatStep !== 'language-select' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, chatStep]);

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!showLangDropdown) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-lang-dropdown]')) setShowLangDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showLangDropdown]);

  // ── Inactivity timer: show popup after 15s when chatbot is closed ─────
  useEffect(() => {
    if (isOpen) {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
      return;
    }

    const startTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      const timer = setTimeout(() => {
        if (!hasShownPopupRef.current) {
          hasShownPopupRef.current = true;
          setShowInactivityPopup(true);
        }
      }, 15000);
      inactivityTimerRef.current = timer;
    };

    startTimer();

    const handleInteraction = () => startTimer();
    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction, { passive: true });

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [isOpen]);

  // ── Build places message for selected destination ───────────────────────
  const buildPlacesMessage = useCallback((destKey: string): string => {
    const dests = DESTINATIONS[language];
    const dest = dests.find(d => d.key === destKey);
    if (!dest) return '';
    const lines = dest.places.map(p => `• **${p.name}** – ${p.highlight}`).join('\n');
    const closing = language === 'en' ? 'We provide customized vehicle services based on your needs.' :
      language === 'hi' ? 'हम आपकी ज़रूरत के अनुसार वाहन सेवा प्रदान करते हैं।' :
      language === 'kn' ? 'ನಾವು ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ವಾಹನ ಸೇವೆಯನ್ನು ಒದಗಿಸುತ್ತೇವೆ.' :
      language === 'ta' ? 'உங்கள் தேவைக்கு ஏற்ற வாகன சேவை வழங்குகிறோம்.' :
      'നിങ്ങളുടെ ആവശ്യങ്ങൾക്ക് അനുയോജ്യമായ വാഹന സേവനം നൽകുന്നു.';
    return `**${destKey}** 🌴\n\nTop places to visit:\n${lines}\n\n${closing}`;
  }, [language]);

  // ── Language selection ─────────────────────────────────────────────────
  const handleLanguageSelect = useCallback((lang: Language) => {
    setLanguage(lang);
    setShowLangDropdown(false);
    setChatStep('ask-destination');
    setMessages([]);
    setSelectedDestination('');
    setCustomerData({ people: '', dates: '', pickup: '', vehicle: '' });
    setTimeout(() => {
      setMessages([
        { role: 'assistant', content: VEHICLE_OVERVIEW[lang] },
        { role: 'assistant', content: STEP_MESSAGES[lang].destination },
      ]);
    }, 300);
  }, []);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    setShowLangDropdown(false);
    setChatStep('ask-destination');
    setMessages([]);
    setSelectedDestination('');
    setCustomerData({ people: '', dates: '', pickup: '', vehicle: '' });
    setTimeout(() => {
      setMessages([
        { role: 'assistant', content: VEHICLE_OVERVIEW[lang] },
        { role: 'assistant', content: STEP_MESSAGES[lang].destination },
      ]);
    }, 300);
  }, []);

  // ── Process user input based on current step ───────────────────────────
  const processInput = useCallback((text: string) => {
    const trimmed = text.trim().toLowerCase();
    const msgs = STEP_MESSAGES[language];

    // Detect confused user (any step)
    const confusedWords = ['confused', 'dont know', "don't know", 'not sure', 'help me', 'what to do', 'suggest', 'no idea', 'kya kare', 'enu madu', 'ennal cheyyan', 'ente cheyyan'];

    if (confusedWords.some(w => trimmed.includes(w))) {
      setMessages(prev => [...prev, { role: 'assistant', content: CONFUSED_REPLY[language] }]);
      return;
    }

    // Detect price/package queries (any step)
    const priceWords = ['price', 'cost', 'rate', 'charge', 'how much', 'kitna', 'kitne', 'eshtu', 'evide', 'yennal'];
    const packageWords = ['package', 'deal', 'offer', 'plan', 'combo', 'itinerary'];

    if (priceWords.some(w => trimmed.includes(w))) {
      setMessages(prev => [...prev, { role: 'assistant', content: msgs.priceReply }]);
      return;
    }

    if (packageWords.some(w => trimmed.includes(w))) {
      setMessages(prev => [...prev, { role: 'assistant', content: msgs.packageReply }]);
      return;
    }

    // Step-based processing
    switch (chatStep) {
      case 'ask-destination': {
        const destKeys = DESTINATION_KEYS[language];
        const matchedKey = destKeys.find(d => trimmed.includes(d.toLowerCase())) ||
          Object.values(DESTINATION_KEYS.en).find(d => trimmed.includes(d.toLowerCase()));
        if (matchedKey) {
          setSelectedDestination(matchedKey);
          const placesMsg = buildPlacesMessage(matchedKey);
          setMessages(prev => [...prev, { role: 'assistant', content: placesMsg }]);
          setChatStep('ask-people');
          setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: msgs.askPeople }]);
          }, 600);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: msgs.destination }]);
        }
        break;
      }

      case 'ask-people': {
        setCustomerData(prev => ({ ...prev, people: text.trim() }));
        setMessages(prev => [...prev, { role: 'assistant', content: msgs.askDates }]);
        setChatStep('ask-dates');
        break;
      }

      case 'ask-dates': {
        setCustomerData(prev => ({ ...prev, dates: text.trim() }));
        setMessages(prev => [...prev, { role: 'assistant', content: msgs.askPickup }]);
        setChatStep('ask-pickup');
        break;
      }

      case 'ask-pickup': {
        setCustomerData(prev => ({ ...prev, pickup: text.trim() }));
        setMessages(prev => [...prev, { role: 'assistant', content: msgs.askVehicle }]);
        setChatStep('ask-vehicle');
        break;
      }

      case 'ask-vehicle': {
        setCustomerData(prev => ({ ...prev, vehicle: text.trim() }));
        setMessages(prev => [...prev, { role: 'assistant', content: msgs.confirmation }]);
        setChatStep('confirmation');
        break;
      }

      case 'confirmation':
      case 'free-chat': {
        setMessages(prev => [...prev, { role: 'assistant', content: msgs.patience }]);
        setChatStep('free-chat');
        break;
      }

      default:
        break;
    }
  }, [chatStep, language, buildPlacesMessage]);

  // ── Send message ──────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    // Process through step logic (no API call needed for the flow)
    processInput(text);
    setIsLoading(false);
  }, [isLoading, processInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  // ── Format **bold** text ───────────────────────────────────────────────
  const formatMessage = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-amber-300 font-semibold">{part.slice(2, -2)}</strong>;
      }
      // Handle newlines
      const lines = part.split('\n');
      if (lines.length > 1) {
        return <span key={i}>{lines.map((line, li) => <React.Fragment key={li}>{li > 0 && <br />}{line}</React.Fragment>)}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  // ── Quick replies for current step ────────────────────────────────────
  const getQuickReplies = (): string[] => {
    if (isLoading) return [];
    switch (chatStep) {
      case 'ask-destination':
        return DESTINATION_KEYS[language];
      case 'ask-people':
        return ['1-2', '3-5', '6-10', '11-20', '21-35', '35+'];
      case 'ask-vehicle':
        return VEHICLE_OPTIONS[language];
      case 'confirmation':
        return [];
      case 'free-chat':
        return [STEP_MESSAGES[language].engagement];
      default:
        return [];
    }
  };

  // ── Build WhatsApp summary message ────────────────────────────────────
  const buildWhatsAppMessage = () => {
    return `🚗 *Vehicle Booking — RRM Holidays*

📍 *Destination:* ${selectedDestination}
📅 *Travel Date:* ${customerData.dates || 'Not specified'}
👥 *Travellers:* ${customerData.people || 'Not specified'}
🚙 *Pickup:* ${customerData.pickup || 'Not specified'}
🚗 *Vehicle:* ${customerData.vehicle || 'Need suggestion'}

Please share a custom quotation. Thank you!`;
  };

  // ── Current language info ──────────────────────────────────────────────
  const currentLangInfo = LANGUAGES.find(l => l.code === language);

  // ── Language Selection Screen ───────────────────────────────────────────
  const renderLanguageSelect = () => (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 bg-gradient-to-b from-amber-500/10 to-transparent px-6 pt-6 pb-4 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Bot size={30} className="text-black" />
        </div>
        <h2 className="text-lg font-bold text-stone-100">Welcome to RRM Holidays</h2>
        <p className="text-sm text-stone-400 mt-1">Please choose your language 👇</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-neutral-800/60 border border-white/[0.06] hover:bg-amber-500/10 hover:border-amber-500/30 transition-all duration-200 group text-left"
          >
            <span className="text-2xl flex-shrink-0 w-10 h-10 rounded-full bg-neutral-700/60 group-hover:bg-amber-500/20 flex items-center justify-center transition-colors">
              {lang.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-100 group-hover:text-amber-200 transition-colors">{lang.native}</p>
              <p className="text-xs text-stone-500 group-hover:text-stone-400 transition-colors">{lang.label}</p>
            </div>
          </button>
        ))}
        <div className="pt-4 text-center">
          <p className="text-[10px] text-stone-600">Powered by RRM Holidays AI</p>
        </div>
      </div>
    </div>
  );

  // ── Chat Screen ────────────────────────────────────────────────────────
  const renderChat = () => {
    const quickReplies = getQuickReplies();

    return (
      <>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mr-2 mt-0.5 shadow-md shadow-amber-500/10">
                  <Bot size={13} className="text-black" />
                </div>
              )}
              <div className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500/20 text-amber-100 rounded-2xl rounded-br-md border border-amber-500/10'
                  : 'bg-neutral-800/80 text-stone-200 rounded-2xl rounded-bl-md border border-white/[0.04]'
              }`}>
                {formatMessage(msg.content)}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mr-2 shadow-md shadow-amber-500/10">
                <Bot size={13} className="text-black" />
              </div>
              <div className="bg-neutral-800/80 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5 border border-white/[0.04]">
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Confirmation WhatsApp CTA */}
          {chatStep === 'confirmation' && !isLoading && (
            <div className="flex justify-start">
              <div className="w-7" />
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/20"
              >
                <MessageCircle size={16} /> Get Quotation on WhatsApp
              </a>
            </div>
          )}

          {/* Free-chat WhatsApp CTA */}
          {chatStep === 'free-chat' && !isLoading && (
            <div className="flex justify-start">
              <div className="w-7" />
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600/20 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-600/30 transition-all"
              >
                <MessageCircle size={14} /> Continue on WhatsApp
              </a>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {quickReplies.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-neutral-800/50 text-stone-300 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-300 transition-all duration-200 shrink-0"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/5 bg-neutral-900/80">
          <form onSubmit={handleSubmit} className="flex items-center gap-2" suppressHydrationWarning>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={chatStep === 'ask-people' ? '👥 e.g. 4 people' :
                chatStep === 'ask-dates' ? '📅 e.g. 15th April' :
                chatStep === 'ask-pickup' ? '📍 e.g. Mysuru, Bangalore' :
                chatStep === 'ask-vehicle' ? '🚗 Choose or type...' :
                'Type your message...'}
              disabled={isLoading}
              className="flex-1 bg-neutral-800/80 border border-white/10 rounded-xl text-stone-200 placeholder-stone-500 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/40 disabled:opacity-50 transition-colors"
              suppressHydrationWarning
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-black disabled:opacity-30 hover:from-amber-400 hover:to-amber-500 transition-all active:scale-95"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>

          {/* WhatsApp CTA */}
          <div className="pt-2">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi RRM Holidays! I'd like to plan a trip.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-green-600/10 border border-green-500/15 text-green-400/80 text-[11px] font-medium hover:bg-green-600/20 transition-all"
            >
              <Phone size={12} /> +91 91085 97154 · WhatsApp
            </a>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-[10px] text-stone-600">RRM Holidays AI</p>
            <div className="flex items-center gap-1 text-[10px] text-stone-600">
              <Globe size={8} />
              <span>{currentLangInfo?.native}</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  // ── Main Render ────────────────────────────────────────────────────────
  return (
    <>
      {/* Inactivity Popup */}
      {showInactivityPopup && !isOpen && (
        <div className="fixed bottom-24 right-6 z-[45] max-w-[300px] p-4 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-white/10 shadow-xl animate-[fade-up_0.5s_ease]">
          <button
            onClick={() => setShowInactivityPopup(false)}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-200 hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
          <p className="text-sm text-stone-200 mb-3 pr-5">Need help planning your trip? 🗺️</p>
          <button
            onClick={() => {
              setShowInactivityPopup(false);
              setIsOpen(true);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/20"
          >
            Chat Now
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        data-chatbot-toggle
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:from-amber-400 hover:to-amber-500 transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'rotate-0 scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        aria-label="Open AI Chat"
      >
        <MessageCircle size={24} className="text-black" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-neutral-900 animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ width: '380px', maxWidth: 'calc(100vw - 2rem)' }}
      >
        <div
          className="bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden"
          style={{ height: '540px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-neutral-900 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/10">
                <Bot size={18} className="text-black" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-100">RRM Holidays</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-stone-400">
                    {chatStep === 'language-select' ? 'Select Language' :
                     chatStep === 'confirmation' ? '✅ Details Received' :
                     chatStep === 'free-chat' ? 'Online' : 'Online'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Progress dots */}
              {chatStep !== 'language-select' && (
                <div className="flex items-center gap-1 mr-1">
                  {['ask-destination', 'show-places', 'ask-people', 'ask-dates', 'ask-pickup', 'ask-vehicle', 'confirmation'].map((step, i) => {
                    const stepOrder = ['ask-destination', 'show-places', 'ask-people', 'ask-dates', 'ask-pickup', 'ask-vehicle', 'confirmation'];
                    const currentIdx = stepOrder.indexOf(chatStep);
                    const isComplete = i < currentIdx || chatStep === 'confirmation' || chatStep === 'free-chat';
                    const isCurrent = i === currentIdx;
                    return (
                      <span
                        key={step}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          isComplete ? 'bg-amber-400' : isCurrent ? 'bg-amber-400 animate-pulse' : 'bg-neutral-700'
                        }`}
                      />
                    );
                  })}
                </div>
              )}
              {/* Globe language switcher */}
              {chatStep !== 'language-select' && (
                <div className="relative" data-lang-dropdown>
                  <button
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                    className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
                    aria-label="Change language"
                  >
                    <Globe size={16} />
                  </button>
                  {showLangDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-800 border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/5 ${language === lang.code ? 'bg-amber-500/10' : ''}`}
                        >
                          <span className="text-base">{lang.emoji}</span>
                          <span className={`text-xs font-medium ${language === lang.code ? 'text-amber-300' : 'text-stone-200'}`}>{lang.native}</span>
                          {language === lang.code && <span className="w-2 h-2 rounded-full bg-amber-500 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          {chatStep === 'language-select' ? renderLanguageSelect() : renderChat()}
        </div>
      </div>
    </>
  );
}
