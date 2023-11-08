import React from 'react';
import { createRoot } from "react-dom/client";
import Board from './Components/Board/Board';
import { Toaster } from 'sonner';

const root = createRoot(document.getElementById("root")!);

const  url = new URLSearchParams(window.location.search).get("url");

root.render(
    <>
        <Toaster />
        <Board url={url || ""} />
    </>

);