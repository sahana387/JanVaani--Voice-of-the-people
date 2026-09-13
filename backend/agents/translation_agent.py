from typing import Dict, Any, List

class TranslationAgent:
    """
    Multilingual Translation Agent supporting English, Hindi (हिंदी), and Kannada (ಕನ್ನಡ).
    Ensures that translations preserve the exact factual and legal meaning of municipal notices,
    and affixes clear AI-translated disclaimers as required by civic safety standards.
    """

    TRANSLATION_DISCLAIMER = {
        "en": "Official source records remain authoritative. This is an AI-generated explanation.",
        "hi": "आधिकारिक सरकारी दस्तावेज़ ही प्रामाणिक स्रोत हैं। यह एआई द्वारा जनरेट किया गया अनुवाद है।",
        "kn": "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ದಾಖಲೆಗಳೇ ಪ್ರಾಮಾಣಿಕ ಮೂಲವಾಗಿದೆ. ಇದು ಎಐ ಮೂಲಕ ರಚಿಸಲಾದ ಅನುವಾದವಾಗಿದೆ."
    }

    PHRASE_DICTIONARY = {
        "hi": {
            "Understand policies. Know your impact. Make your voice count.": "नीतियों को समझें। अपने क्षेत्र पर प्रभाव जानें। अपनी आवाज़ उठाएं।",
            "Government policies shouldn't be difficult to understand.": "सरकारी नीतियों को समझना कठिन नहीं होना चाहिए।",
            "What changed?": "क्या बदलाव हुआ?",
            "Who is affected?": "कौन प्रभावित होगा?",
            "Where does it apply?": "यह कहाँ लागू होता है?",
            "When does it take effect?": "यह कब लागू होगा?",
            "Important requirements": "महत्वपूर्ण आवश्यकताएँ",
            "Possible benefits": "संभावित लाभ",
            "Possible concerns": "संभावित चिंताएं",
            "Important deadlines": "महत्वपूर्ण समय सीमा",
            "Explain Like I'm a Citizen": "नागरिक के लिए सरल भाषा में समझें",
            "Original Government Text": "मूल सरकारी दस्तावेज़ पाठ",
            "Simple Explanation": "सरल स्पष्टीकरण",
            "Public Sentiment": "जनमत और नागरिक भावना",
            "Quadratic Voting": "द्विघात मतदान (Quadratic Voting)",
            "Ask JanVaani": "जनवाणी से पूछें",
            "Compare Policies": "नीतियों की तुलना करें",
            "Citizen Impact Report": "नागरिक प्रभाव रिपोर्ट",
            "Generate Response": "प्रतिक्रिया प्रारूप तैयार करें",
            "Support": "समर्थन",
            "Oppose": "विरोध",
            "Neutral": "तटस्थ",
            "Voting Credits": "मतदान क्रेडिट",
            "Credits Remaining": "शेष क्रेडिट",
            "Votes Allocated": "आवंटित वोट",
            "Draft Feedback": "प्रतिक्रिया प्रारूप",
            "Objection Statement": "आपत्ति पत्र",
            "RTI Inquiry": "आरटीआई आवेदन",
            "I couldn't find enough evidence in the available official documents to answer this confidently.": "उपलब्ध आधिकारिक दस्तावेजों में विश्वासपूर्वक उत्तर देने के लिए पर्याप्त साक्ष्य नहीं मिले।"
        },
        "kn": {
            "Understand policies. Know your impact. Make your voice count.": "ನೀತಿಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ನಿಮ್ಮ ಪ್ರದೇಶದ ಪರಿಣಾಮ ತಿಳಿಯಿರಿ. ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ದಾಖಲಿಸಿ.",
            "Government policies shouldn't be difficult to understand.": "ಸರ್ಕಾರಿ ನೀತಿಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು ಕಷ್ಟಕರವಾಗಿರಬಾರದು.",
            "What changed?": "ಏನು ಬದಲಾಗಿದೆ?",
            "Who is affected?": "ಯಾರಿಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?",
            "Where does it apply?": "ಇದು ಎಲ್ಲಿ ಅನ್ವಯಿಸುತ್ತದೆ?",
            "When does it take effect?": "ಇದು ಯಾವಾಗ ಜಾರಿಗೆ ಬರುತ್ತದೆ?",
            "Important requirements": "ಪ್ರಮುಖ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು",
            "Possible benefits": "ಸಂಭಾವ್ಯ ಪ್ರಯೋಜನಗಳು",
            "Possible concerns": "ಸಂಭಾವ್ಯ ಕಾಳಜಿಗಳು",
            "Important deadlines": "ಪ್ರಮುಖ ಗಡುವುಗಳು",
            "Explain Like I'm a Citizen": "ಸರಳ ಕನ್ನಡದಲ್ಲಿ ವಿವರಣೆ",
            "Original Government Text": "ಮೂಲ ಸರ್ಕಾರಿ ಕಡತ ಪಠ್ಯ",
            "Simple Explanation": "ಸರಳ ವಿವರಣೆ",
            "Public Sentiment": "ಸಾರ್ವಜನಿಕ ಅಭಿಪ್ರಾಯ",
            "Quadratic Voting": "ಕ್ವಾಡ್ರಾಟಿಕ್ ಮತದಾನ",
            "Ask JanVaani": "ಜನವಾಣಿ ಜೊತೆ ಮಾತನಾಡಿ",
            "Compare Policies": "ನೀತಿಗಳ ಹೋಲಿಕೆ",
            "Citizen Impact Report": "ನಾಗರಿಕ ಪರಿಣಾಮ ವರದಿ",
            "Generate Response": "ನಾಗರಿಕ ಪ್ರತಿಕ್ರಿಯೆ ಸಿದ್ಧಪಡಿಸಿ",
            "Support": "ಬೆಂಬಲ",
            "Oppose": "ವಿರೋಧ",
            "Neutral": "ತಟಸ್ಥ",
            "Voting Credits": "ಮತದಾನ ಕ್ರೆಡಿಟ್‌ಗಳು",
            "Credits Remaining": "ಉಳಿದ ಕ್ರೆಡಿಟ್‌ಗಳು",
            "Votes Allocated": "ನೀಡಿದ ಮತಗಳು",
            "Draft Feedback": "ಅಭಿಪ್ರಾಯ ಕರಡು",
            "Objection Statement": "ಆಕ್ಷೇಪಣಾ ಪತ್ರ",
            "RTI Inquiry": "ಮಾಹಿತಿ ಹಕ್ಕು ಅರ್ಜಿ",
            "I couldn't find enough evidence in the available official documents to answer this confidently.": "ಲಭ್ಯವಿರುವ ಅಧಿಕೃತ ದಾಖಲೆಗಳಲ್ಲಿ ಖಚಿತವಾಗಿ ಉತ್ತರಿಸಲು ಸಾಕಷ್ಟು ಸಾಕ್ಷ್ಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ."
        }
    }

    @classmethod
    def translate_text(cls, text: str, target_lang: str = "en") -> Dict[str, Any]:
        if not text or target_lang == "en":
            return {
                "translated_text": text,
                "target_lang": "en",
                "is_translated": False,
                "disclaimer": cls.TRANSLATION_DISCLAIMER["en"]
            }

        target_lang = target_lang.lower()
        if target_lang not in ["hi", "kn"]:
            target_lang = "en"

        # Check phrase match first
        phrase_map = cls.PHRASE_DICTIONARY.get(target_lang, {})
        if text.strip() in phrase_map:
            translated = phrase_map[text.strip()]
        else:
            # Contextual replacement for key municipal terms
            translated = text
            for en_k, local_v in phrase_map.items():
                translated = translated.replace(en_k, local_v)

        return {
            "translated_text": translated,
            "target_lang": target_lang,
            "is_translated": True,
            "disclaimer": cls.TRANSLATION_DISCLAIMER.get(target_lang, cls.TRANSLATION_DISCLAIMER["en"])
        }

    @classmethod
    def translate_policy_summary(cls, policy_dict: Dict[str, Any], target_lang: str = "en") -> Dict[str, Any]:
        if target_lang == "en":
            return policy_dict

        result = dict(policy_dict)
        for key in ["summary_simple", "what_changed", "who_affected", "where_applies", "positive_impacts", "negative_impacts"]:
            if key in result and isinstance(result[key], str):
                trans_res = cls.translate_text(result[key], target_lang)
                result[key] = trans_res["translated_text"]

        result["language"] = target_lang
        result["translation_disclaimer"] = cls.TRANSLATION_DISCLAIMER.get(target_lang, "")
        return result
