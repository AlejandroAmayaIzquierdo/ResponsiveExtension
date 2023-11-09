import React from 'react';
import { createRoot } from "react-dom/client";
import Board from './Components/Board/Board';
import { Toaster } from 'sonner';
import { IntlProvider } from 'react-intl';
import { messages } from './i18n/messages';
import { LOCALES, existLocate } from './i18n/locales';

const root = createRoot(document.getElementById("root")!);

const  url = new URLSearchParams(window.location.search).get("url");

const langParam = new URLSearchParams(window.location.search).get("lang") || LOCALES.ENGLISH;
const lang = existLocate(langParam) ? langParam : LOCALES.ENGLISH;


root.render(
    <>
        <IntlProvider messages={messages[lang]} locale={lang} defaultLocale={LOCALES.ENGLISH}>
            <Toaster />
            <Board url={url || ""} />
        </IntlProvider>
    </>

);