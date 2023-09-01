import React from 'react';
import { createRoot } from "react-dom/client";
import Board from './Components/Board';

const MultiResComponent: React.FC = () => {
    return (
        <div>
            Hello, from Alejandro Amaya.
        </div>
    );
}

const body = document.querySelector('body');
const app = document.createElement('div');
app.id = 'react-root';

if (body) {
    body.prepend(app);
}

// Check if the element with id 'react-root' exists
const existingRoot = document.getElementById('react-root');

if (existingRoot) {
    const root = createRoot(existingRoot);

    root.render(
        <>
            <MultiResComponent />
            <Board />
        </>
    );
} else {
    console.error("Element with id 'react-root' not found");
}