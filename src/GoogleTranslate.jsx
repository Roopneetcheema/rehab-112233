import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,fr,es,de,zh-CN", // languages you want
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  // hidden div (Google injects its widget here, but we hide it)
  return <div id="google_translate_element" style={{ display: "none" }}></div>;
}