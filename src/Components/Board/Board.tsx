import React, { useState } from 'react';
import RGL, { WidthProvider } from "react-grid-layout";
import "./Board.css";

const ReactGridLayout = WidthProvider(RGL);


const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#108ee9',
};
const layoutInitialValue: RGL.Layout[] = [
    { i: "1", x: 0, y: 0, w: 1, h: 2 },
    { i: "2", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "3", x: 4, y: 0, w: 1, h: 2 }
];

interface BoardProps {

}
const Board: React.FC<BoardProps> = () => {

    const [counter, setcounter] = useState<number>(3);
    const [layout, setLayout] = useState<RGL.Layout[]>(layoutInitialValue);

    const getId = (): string => {
        setcounter(counter + 1);
        return counter.toString();
    }

    const handleAddItem = () => {
        const id = getId();
        const newItem: RGL.Layout = { i: id, x: 0, y: 0, w: 1, h: 1 }

        setLayout([...layout, newItem]);
    }


    return (
        <ReactGridLayout onLayoutChange={(l) => { setLayout(l); }}>
            <button onClick={handleAddItem}>Add item</button>
            {layout.map((item) => {
                return (
                    <div key={item.i}>
                        <span>{item.i}</span>
                    </div>
                );
            })}
        </ReactGridLayout>
    );
}

export default Board;