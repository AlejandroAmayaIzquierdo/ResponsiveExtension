import React, { useState } from "react";
import "./Window.css";

const nextZIndex = () => {
  let maxZ = 0;
  for (const w of document.querySelectorAll(".window-container")) {
    const z = parseInt((w as HTMLElement).style.zIndex);
    maxZ = Math.max(isNaN(z) ? 0 : z, maxZ);
  }
  return maxZ + 1;
};


export interface WindowProps {
  id?: string;
  children?: React.ReactNode;
  height?: number;
  width?: number;
  initialTop?: number;
  initialLeft?: number;
  top?:number;
  left?:number;
  resizable?: boolean;
  titleBar?: {
    icon?: string;
    title?: string;
    buttons?: {
      minimize?: boolean;
      maximize?: boolean;
      close?: boolean;
    };
  };
  handleClose?: (id: string) => void;
  onDragEnd?: (item: WindowProps) => void;
}

const Window: React.FC<WindowProps> = ({
  id,
  children,
  height = 100,
  width = 100,
  initialTop,
  initialLeft,
  resizable = false,
  titleBar,
  handleClose,
  onDragEnd
}) => {


  const [top, setTop] = useState<number>(initialTop || 0);
  const [left, setLeft] = useState<number>(initialLeft || 0);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [level, setLevel] = useState(nextZIndex());
  const [visibility, setWindowVisibility] = useState<number>(1.0);

  const handleDragStart = (e: React.DragEvent<HTMLSpanElement>) => {
    setYOffset(e.clientY - top);
    setXOffset(e.clientX - left);
    setLevel(nextZIndex());
    setWindowVisibility(0.5);
  };

  const handleDrag = (e: React.DragEvent<HTMLSpanElement>) => {
    setLeft((e.clientX || e.screenX || left + xOffset) - xOffset);
    setTop((e.clientY || e.screenY || top + yOffset) - yOffset);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLSpanElement>) => {
    setLeft((e.clientX || e.screenX) - xOffset);
    setTop((e.clientY || e.screenY) - yOffset);
    setWindowVisibility(1.0);
    if(onDragEnd) onDragEnd({
      id,
      top,
      left
    });
  };

  const handleMinimize = () => {};

  const handleMaximize = () => {};

  return (
    <div
      id={id}
      className="window-container"
      style={!resizable ? {
        height: height,
        width: width,
        top: top,
        left: left,
        zIndex: level,
        opacity: visibility,
      } : {
        height: height,
        width: width,
        top: top,
        left: left,
        resize : "both",
        zIndex: level,
        opacity: visibility,
      }}
      onClick={() => {
        setLevel(nextZIndex());
      }}
    >
      {titleBar && (
        <div
          className="title-bar"
          data-parent={id}
          style={{
            opacity: visibility,
          }}
        >
          {titleBar.icon && (
            <span className="icon">{titleBar.icon}</span>
          )}
          {titleBar.buttons && (
            <div className="buttonContainer">
              {titleBar.buttons.minimize && (
                <button className="windowButton" onClick={() => { if (handleClose && id) handleClose(id); }} />
              )}
              {titleBar.buttons.maximize && (
                <button className="windowButton" onClick={handleMaximize} />
              )}
              {titleBar.buttons.close && (
                <button className="windowButton" onClick={handleMinimize} />
              )}
            </div>
          )}
          <span
            className="windowTitle"
            draggable
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ opacity: Math.floor(visibility) }}
          >
            {titleBar.title}
          </span>



        </div>
      )}
      <div
        className="content"
        draggable={false}
        style={{ overflow: "hidden", height: "100%" }}
      >
        {children}
      </div>
    </div>
  );
};

export default Window;
