import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { LOCALES, existLocate } from "./i18n/locales";

const Popup = () => {
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    // URL of the blank page or local HTML file you want to open

    const extensionId = chrome.runtime.id; // current extension id

    let language = chrome.i18n.getUILanguage();

    // If it's a language variant like es-es, extract the base language code (es)
    if (language.includes("-"))
      language = language.split("-")[0];
    if(!existLocate(language))
      language = LOCALES.ENGLISH;
    const newTabURL = `chrome-extension://${extensionId}/index.html?url=${currentURL}&lang=${language}`;

    chrome.tabs.create({ url: newTabURL }, (tab) => {
      console.log("New tab created with ID:", tab.id);
    });
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <div className="current-url">
          <span>Current URL:</span>
          <p>{currentURL}</p>
        </div>
        <button className="change-background-button" onClick={changeBackground}>
          are you responsive?
        </button>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <Popup />
);
