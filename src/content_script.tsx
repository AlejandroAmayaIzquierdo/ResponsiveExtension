import React from 'react';
import { createRoot } from "react-dom/client";
import Board from './Components/Board/Board';
import { Toaster } from 'sonner';
import { IntlProvider } from 'react-intl';
import { messages } from './i18n/messages';
import { LOCALES, existLocate } from './i18n/locales';
const {version} = require('../package.json');

const root = createRoot(document.getElementById("root")!);

const  url = new URLSearchParams(window.location.search).get("url");

const langParam = new URLSearchParams(window.location.search).get("lang") || LOCALES.ENGLISH;
const lang = existLocate(langParam) ? langParam : LOCALES.ENGLISH;


root.render(
        <IntlProvider messages={messages[lang]} locale={lang} defaultLocale={LOCALES.ENGLISH}>
            <Toaster />
            <Board url={url ?? ""} />
            <span style={{position: "absolute",bottom: "1%",left:"1%",fontSize: "20px",zIndex: -1,userSelect: "none",WebkitUserSelect: "none",msUserSelect: "none"}}>{version}</span>
        </IntlProvider>
);