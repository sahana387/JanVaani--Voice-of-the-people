export type Language = 'en' | 'hi' | 'kn';

export interface Translations {
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  searchPlaceholder: string;
  askJanVaani: string;
  policiesAffectingArea: string;
  recentChanges: string;
  activeConsultations: string;
  explainLikeCitizen: string;
  originalGovtText: string;
  simpleExplanation: string;
  whatChanged: string;
  whoIsAffected: string;
  whereItApplies: string;
  whenTakesEffect: string;
  requirements: string;
  positiveImpacts: string;
  negativeImpacts: string;
  deadlines: string;
  glossary: string;
  officialCitation: string;
  confidenceScore: string;
  publicSentiment: string;
  quadraticVoting: string;
  comparePolicies: string;
  citizenImpactReport: string;
  citizenResponseAssistant: string;
  alertsNotifications: string;
  forYou: string;
  exploreMap: string;
  adminPortal: string;
  votingCredits: string;
  creditsRemaining: string;
  votesAllocated: string;
  support: string;
  oppose: string;
  neutral: string;
  generateDraft: string;
  officialSourceDisclaimer: string;
  insufficientEvidenceMessage: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "JANVAANI",
    tagline: "Voice of the People",
    heroHeadline: "Government policies shouldn't be difficult to understand.",
    heroSubheadline: "Understand municipal notifications, analyze impacts on your neighborhood, ask grounded AI questions, and make your voice heard through quadratic civic voting.",
    searchPlaceholder: "Search policies by keyword, ward, or topic (e.g., 'zoning', 'waste segregation', '560038')...",
    askJanVaani: "Ask JanVaani",
    policiesAffectingArea: "Policies Affecting Your Area",
    recentChanges: "Recent Policy Changes",
    activeConsultations: "Active Public Consultations",
    explainLikeCitizen: "Explain Like I'm a Citizen",
    originalGovtText: "Original Government Text",
    simpleExplanation: "Simple Explanation",
    whatChanged: "What changed?",
    whoIsAffected: "Who is affected?",
    whereItApplies: "Where does it apply?",
    whenTakesEffect: "When does it take effect?",
    requirements: "Important Requirements",
    positiveImpacts: "Possible Benefits",
    negativeImpacts: "Possible Concerns",
    deadlines: "Important Deadlines",
    glossary: "Definitions of Key Terms",
    officialCitation: "Official Gazette Citation",
    confidenceScore: "Evidence Grounding Confidence",
    publicSentiment: "Public Sentiment",
    quadraticVoting: "Quadratic Voting",
    comparePolicies: "Compare Policies",
    citizenImpactReport: "Citizen Impact Report",
    citizenResponseAssistant: "Citizen Response Assistant",
    alertsNotifications: "Civic Alerts & Notices",
    forYou: "For You",
    exploreMap: "Interactive Civic Map",
    adminPortal: "Admin Portal",
    votingCredits: "Civic Voting Credits",
    creditsRemaining: "Credits Remaining",
    votesAllocated: "Votes Allocated",
    support: "Support",
    oppose: "Oppose",
    neutral: "Neutral",
    generateDraft: "Generate Formal Civic Draft",
    officialSourceDisclaimer: "Official government gazette records remain the authoritative source. AI translations and summaries are for accessible civic understanding.",
    insufficientEvidenceMessage: "I couldn't find enough evidence in the available official documents to answer this confidently."
  },
  hi: {
    appName: "जनवाणी",
    tagline: "जनता की आवाज़",
    heroHeadline: "सरकारी नीतियों को समझना कठिन नहीं होना चाहिए।",
    heroSubheadline: "नगर निगम की अधिसूचनाओं को समझें, अपने क्षेत्र पर प्रभाव जानें, प्रामाणिक AI से सवाल पूछें और द्विघात मतदान के माध्यम से अपनी राय दर्ज करें।",
    searchPlaceholder: "कीवर्ड, वार्ड या विषय से नीतियां खोजें (उदा. 'ज़ोनिंग', 'कचरा पृथक्करण')...",
    askJanVaani: "जनवाणी से पूछें",
    policiesAffectingArea: "आपके क्षेत्र को प्रभावित करने वाली नीतियां",
    recentChanges: "हाल के नीतिगत बदलाव",
    activeConsultations: "सक्रिय सार्वजनिक परामर्श",
    explainLikeCitizen: "नागरिक के लिए सरल भाषा में समझें",
    originalGovtText: "मूल सरकारी दस्तावेज़",
    simpleExplanation: "सरल स्पष्टीकरण",
    whatChanged: "क्या बदलाव हुआ?",
    whoIsAffected: "कौन प्रभावित होगा?",
    whereItApplies: "यह कहाँ लागू होता है?",
    whenTakesEffect: "यह कब लागू होगा?",
    requirements: "महत्वपूर्ण आवश्यकताएँ",
    positiveImpacts: "संभावित लाभ",
    negativeImpacts: "संभावित चिंताएं",
    deadlines: "महत्वपूर्ण समय सीमा",
    glossary: "प्रमुख तकनीकी शब्दों के अर्थ",
    officialCitation: "आधिकारिक राजपत्र संदर्भ",
    confidenceScore: "साक्ष्य प्रामाणिकता स्कोर",
    publicSentiment: "जनमत और भावना",
    quadraticVoting: "द्विघात मतदान (Quadratic Voting)",
    comparePolicies: "नीतियों की तुलना करें",
    citizenImpactReport: "नागरिक प्रभाव रिपोर्ट",
    citizenResponseAssistant: "नागरिक प्रतिक्रिया सहायक",
    alertsNotifications: "नागरिक अलर्ट व सूचनाएं",
    forYou: "आपके लिए",
    exploreMap: "इंटरैक्टिव नागरिक मानचित्र",
    adminPortal: "प्रशासक पोर्टल",
    votingCredits: "नागरिक मतदान क्रेडिट",
    creditsRemaining: "शेष क्रेडिट",
    votesAllocated: "आवंटित वोट",
    support: "समर्थन",
    oppose: "विरोध",
    neutral: "तटस्थ",
    generateDraft: "नागरिक प्रारूप तैयार करें",
    officialSourceDisclaimer: "मूल सरकारी दस्तावेज़ ही प्रामाणिक स्रोत हैं। यह एआई द्वारा जनरेट किया गया अनुवाद है।",
    insufficientEvidenceMessage: "उपलब्ध आधिकारिक दस्तावेजों में विश्वासपूर्वक उत्तर देने के लिए पर्याप्त साक्ष्य नहीं मिले।"
  },
  kn: {
    appName: "ಜನವಾಣಿ",
    tagline: "ಜನರ ಧ್ವನಿ",
    heroHeadline: "ಸರ್ಕಾರಿ ನೀತಿಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು ಕಷ್ಟಕರವಾಗಿರಬಾರದು.",
    heroSubheadline: "ನಗರ ಪಾಲಿಕೆಯ ನಿಯಮಗಳನ್ನು ಸುಲಭವಾಗಿ ತಿಳಿಯಿರಿ, ನಿಮ್ಮ ಬಡಾವಣೆಯ ಮೇಲಾಗುವ ಪರಿಣಾಮಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ ಮತ್ತು ಕ್ವಾಡ್ರಾಟಿಕ್ ಮತದಾನದ ಮೂಲಕ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ದಾಖಲಿಸಿ.",
    searchPlaceholder: "ಕೀವರ್ಡ್, ವಾರ್ಡ್ ಅಥವಾ ವಿಷಯದ ಮೂಲಕ ಹುಡುಕಿ (ಉದಾ: 'ವಲಯ ನಿಯಮಾವಳಿ', 'ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ')...",
    askJanVaani: "ಜನವಾಣಿ ಜೊತೆ ಮಾತನಾಡಿ",
    policiesAffectingArea: "ನಿಮ್ಮ ಪ್ರದೇಶಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ನೀತಿಗಳು",
    recentChanges: "ಇತ್ತೀಚಿನ ನಿಯಮಗಳ ಬದಲಾವಣೆ",
    activeConsultations: "ಸಾರ್ವಜನಿಕ ಸಮಾಲೋಚನೆಗಳು",
    explainLikeCitizen: "ಸರಳ ಕನ್ನಡದಲ್ಲಿ ವಿವರಣೆ",
    originalGovtText: "ಮೂಲ ಸರ್ಕಾರಿ ಕಡತ ಪಠ್ಯ",
    simpleExplanation: "ಸರಳ ವಿವರಣೆ",
    whatChanged: "ಏನು ಬದಲಾಗಿದೆ?",
    whoIsAffected: "ಯಾರಿಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?",
    whereItApplies: "ಇದು ಎಲ್ಲಿ ಅನ್ವಯಿಸುತ್ತದೆ?",
    whenTakesEffect: "ಇದು ಯಾವಾಗ ಜಾರಿಗೆ ಬರುತ್ತದೆ?",
    requirements: "ಪ್ರಮುಖ ನಿಯಮಗಳು",
    positiveImpacts: "ಸಂಭಾವ್ಯ ಪ್ರಯೋಜನಗಳು",
    negativeImpacts: "ಸಂಭಾವ್ಯ ಕಾಳಜಿಗಳು",
    deadlines: "ಪ್ರಮುಖ ಗಡುವುಗಳು",
    glossary: "ಪ್ರಮುಖ ಶಬ್ದಕೋಶ",
    officialCitation: "ಅಧಿಕೃತ ಗೆಜೆಟ್ ಉಲ್ಲೇಖ",
    confidenceScore: "ಸಾಕ್ಷ್ಯಾಧಾರಿತ ವಿಶ್ವಾಸಾರ್ಹತೆ",
    publicSentiment: "ಸಾರ್ವಜನಿಕ ಅಭಿಪ್ರಾಯ",
    quadraticVoting: "ಕ್ವಾಡ್ರಾಟಿಕ್ ಮತದಾನ",
    comparePolicies: "ನೀತಿಗಳ ಹೋಲಿಕೆ",
    citizenImpactReport: "ನಾಗರಿಕ ಪರಿಣಾಮ ವರದಿ",
    citizenResponseAssistant: "ನಾಗರಿಕ ಪ್ರತಿಕ್ರಿಯೆ ಸಹಾಯಕ",
    alertsNotifications: "ನಾಗರಿಕ ಎಚ್ಚರಿಕೆಗಳು",
    forYou: "ನಿಮಗಾಗಿ",
    exploreMap: "ನಾಗರಿಕ ನಕ್ಷೆ",
    adminPortal: "ಆಡಳಿತ ಪೋರ್ಟಲ್",
    votingCredits: "ಮತದಾನ ಕ್ರೆಡಿಟ್‌ಗಳು",
    creditsRemaining: "ಉಳಿದ ಕ್ರೆಡಿಟ್‌ಗಳು",
    votesAllocated: "ನೀಡಿದ ಮತಗಳು",
    support: "ಬೆಂಬಲ",
    oppose: "ವಿರೋಧ",
    neutral: "ತಟಸ್ಥ",
    generateDraft: "ನಾಗರಿಕ ಕರಡು ರಚಿಸಿ",
    officialSourceDisclaimer: "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ದಾಖಲೆಗಳೇ ಪ್ರಾಮಾಣಿಕ ಮೂಲವಾಗಿದೆ. ಇದು ಎಐ ಮೂಲಕ ರಚಿಸಲಾದ ಅನುವಾದವಾಗಿದೆ.",
    insufficientEvidenceMessage: "ಲಭ್ಯವಿರುವ ಅಧಿಕೃತ ದಾಖಲೆಗಳಲ್ಲಿ ಖಚಿತವಾಗಿ ಉತ್ತರಿಸಲು ಸಾಕಷ್ಟು ಸಾಕ್ಷ್ಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ."
  }
};
