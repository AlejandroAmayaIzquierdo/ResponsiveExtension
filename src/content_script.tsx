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

const root = createRoot(document.getElementById("root")!);

root.render(
    <Board />
);