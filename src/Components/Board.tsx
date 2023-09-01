import React from 'react';
import GridLayout from "react-grid-layout";

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#108ee9',
};


interface BoardProps {

}
const Board: React.FC<BoardProps> = () => {
    const layout = [
        { i: "a", x: 0, y: 0, w: 1, h: 2 },
        { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
        { i: "c", x: 4, y: 0, w: 1, h: 2 }
    ];
    return (
        <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={30}
            width={1200}
            style={{ position: "absolute", top: "0px", left: "0px", width: "100%", height: "100%", margin: 0, padding: 0, borderRadius: 0 }}
        >
            <div key="a">a</div>
            <div key="b">b</div>
            <div key="c">c</div>
        </GridLayout>
    );
}

export default Board;