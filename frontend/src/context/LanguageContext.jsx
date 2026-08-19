import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const dictionary = {
  en: {
    brandName: "FARM2CITY",
    tagline: "Empowering Rural Farmers, Serving Urban Tables",
    heroTitle: "Fresh Produce, Direct From Soil to City",
    heroSub: "Connecting rural farmers directly with city tables. Bypassing middlemen to deliver the freshest vegetables, fruits, dairy, and grains at affordable prices.",
    searchPlaceholder: "Search fresh veggies, fruits, grains...",
    organicTag: "100% Organic",
    addToCart: "Add to Cart",
    outOfStock: "Sold Out",
    voiceSearchActive: "Listening for crop name...",
    chatbotTitle: "Krishi AI Assistant",
    weatherTitle: "Live Climate & Crop Advisory",
    priceAdvisor: "AI Price Trend Recommender"
  },
  hi: {
    brandName: "फार्म२सिटी",
    tagline: "ग्रामीण किसानों का सशक्तिकरण, शहरी थालियों की सेवा",
    heroTitle: "ताजी उपज, सीधे मिट्टी से शहर तक",
    heroSub: "ग्रामीण किसानों को सीधे शहर के ग्राहकों से जोड़ना। बिचौलियों को हटाकर सबसे ताजी सब्जियां, फल, डेयरी और अनाज किफायती दामों पर पहुंचाना।",
    searchPlaceholder: "ताजी सब्जियां, फल, अनाज खोजें...",
    organicTag: "१००% जैविक",
    addToCart: "कार्ट में डालें",
    outOfStock: "समाप्त",
    voiceSearchActive: "फसल का नाम बोलें...",
    chatbotTitle: "कृषि एआई सहायक",
    weatherTitle: "लाइव मौसम और फसल सलाह",
    priceAdvisor: "एआई मूल्य ट्रेंड सलाहकार"
  },
  mr: {
    brandName: "फार्म२सिटी",
    tagline: "ग्रामीण शेतकऱ्यांचे सक्षमीकरण, शहरी ताटांची सेवा",
    heroTitle: "ताजी पिके, थेट शेतातून शहरात",
    heroSub: "ग्रामीण शेतकऱ्यांना थेट शहराच्या ग्राहकांशी जोडणे. मध्यस्थांना वगळून सर्वात ताजी भाजीपाला, फळे, दुग्धजन्य पदार्थ आणि धान्ये वाजवी दरात पोहोचवणे.",
    searchPlaceholder: "ताजी भाजीपाला, फळे, धान्य शोधा...",
    organicTag: "१००% सेंद्रिय",
    addToCart: "कार्टमध्ये जोडा",
    outOfStock: "संपले",
    voiceSearchActive: "पिकाचे नाव बोला...",
    chatbotTitle: "कृषी एआई सहाय्यक",
    weatherTitle: "थेट हवामान आणि पीक सल्ला",
    priceAdvisor: "एआई किंमत ट्रेंड सल्लागार"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key) => {
    return dictionary[lang]?.[key] || dictionary['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
