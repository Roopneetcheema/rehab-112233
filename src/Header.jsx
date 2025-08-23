import React, { useState, useEffect } from "react";
import { User, Settings, Bell, Globe, ChevronDown } from "lucide-react";

export default function Header({ currentView, setCurrentView, userStats }) {
  const { streak } = userStats;
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Load Google Translate script once
  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      const addScript = document.createElement("script");
      addScript.id = "google-translate-script";
      addScript.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(addScript);
    }

    window.googleTranslateElementInit = () => {
      if (!document.getElementById("google_translate_element").children.length) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };
  }, []);

  // Custom function to trigger language change
  const handleLanguageChange = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
    setIsLangOpen(false);
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
    { code: "de", label: "Deutsch" },
    { code: "zh-CN", label: "中文" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-1">
            <h1
              style={{ fontFamily: "MyFont" }}
              className="text-xl font-logo font-bold text-gray-300 tracking-wide"
            >
              Rehabify
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all"
              >
                <Globe size={16} />
                <ChevronDown size={16} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-900 text-white rounded-lg shadow-lg z-50 border border-gray-700">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-700"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hidden Google Translate Element */}
            <div
              id="google_translate_element"
              style={{ display: "none" }}
            ></div>

            {/* Profile */}
            <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded-full px-4 py-2 transition-all shadow-md border border-gray-600 hover:border-[#85c8ff]">
              <User className="w-5 h-5 text-[#85c8ff]" />
              <span className="text-gray-100 text-sm hidden sm:block">
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}