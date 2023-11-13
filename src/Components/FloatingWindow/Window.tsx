import React, { useState,useRef,useEffect, useImperativeHandle, forwardRef,useMemo } from "react";
import "./Window.css";
import Icon from "react-cmdk/dist/components/Icon";

const nextZIndex = () => {
  let maxZ = 0;
  for (const w of document.querySelectorAll(".window-container")) {
    const z = parseInt((w as HTMLElement).style.zIndex);
    maxZ = Math.max(isNaN(z) ? 0 : z, maxZ);
  }
  return maxZ + 1;
};

const marginLimits: number = 10;

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
  updatePosition?: (left: number,top: number) => void;
  checkVisibility?: () => void;
}

const Window = forwardRef<any,WindowProps>(({
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
},ref) => {

  const divRef = useRef(null);

  const [top, setTop] = useState<number>(initialTop ?? 0);
  const [left, setLeft] = useState<number>(initialLeft ?? 0);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [level, setLevel] = useState(nextZIndex());
  const [visibility, setVisibility] = useState<number>(1.0);
  const [currentWith, setCurrentWith] = useState<number>(width);
  const [currentHeight, setCurrentHeight] = useState<number>(height);
  const [isResolutionInfoShow, setIsResolutionInfoShow] = useState<boolean>(false);

  const [initialWith] = useState(width);
  const [initialHeight] = useState(height);

  const styles: React.CSSProperties = {
    height: currentHeight,
    width: currentWith,
    top: top,
    left: left,
    zIndex: level,
    opacity: visibility,
  }

  const handleDragStart = (e: React.DragEvent<HTMLSpanElement>) => {
    setYOffset(e.clientY - top);
    setXOffset(e.clientX - left);
    setLevel(nextZIndex());
    setVisibility(0.65);
  };

  const handleDrag = (e: React.DragEvent<HTMLSpanElement>) => {
    const leftPosition = (e.clientX || e.screenX || left + xOffset) - xOffset;
    const topPosition = (e.clientY || e.screenY || top + yOffset) - yOffset;
    
    if(leftPosition > marginLimits && leftPosition + currentWith <= window.innerWidth - marginLimits)
      setLeft(leftPosition);
    if(topPosition > marginLimits && topPosition + currentHeight <= window.innerHeight - marginLimits)
      setTop(topPosition);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLSpanElement>) => {
    
    const maxLeftLimit = window.innerWidth - marginLimits;
    const maxTopLimit = window.innerHeight - marginLimits;


    let leftPosition = (e.clientX || e.screenX) - xOffset;
    if(leftPosition < 0)
      leftPosition = marginLimits;
    else if(leftPosition + currentWith > maxLeftLimit)
      leftPosition = maxLeftLimit - currentWith;


    let topPosition = (e.clientY || e.screenY) - yOffset
    if(topPosition < 0)
      topPosition = marginLimits;
    else if(topPosition + currentHeight > maxTopLimit && currentHeight < maxTopLimit)
      topPosition = maxTopLimit - currentHeight;


    setLeft(leftPosition);
    setTop(topPosition);
    
    setVisibility(1.0);


    if(onDragEnd) onDragEnd({id,top,left,width: currentWith,height: currentHeight});
  };

  useImperativeHandle(ref, () => ({

    updatePosition(left: number,top: number) {
      setLeft(left);
      setTop(top);
    },
    checkVisibility() {
      handleVisibility();
    }

  }));

  const handleVisibility = () => {
    const maxLeftLimit = window.innerWidth - marginLimits;
    const maxTopLimit = window.innerHeight - marginLimits;


    if(left < 0)
      setLeft(marginLimits);
    else if(left + currentWith > maxLeftLimit)
      setLeft(maxLeftLimit - currentWith);


    if(top < 0)
      setTop(marginLimits);
    else if(top + currentHeight > maxTopLimit && currentHeight < maxTopLimit)
      setTop(maxTopLimit - currentHeight);
  }
  useEffect(() => {
    if (!divRef.current) return;

    let timeoutId: NodeJS.Timeout; 

    const resizeObserver = new ResizeObserver((container) => {
      if (container.length <= 0) return;

      const { contentRect } = container[0];

      //TODO set limits to resizing.
      setCurrentWith(contentRect.width);
      setCurrentHeight(contentRect.height);

      setIsResolutionInfoShow(true);

      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if(onDragEnd) onDragEnd({id,top,left,width: contentRect.width,height: contentRect.height});
        setIsResolutionInfoShow(false); 
      }, 500); //There is no way to know when its ended so i did this. 
    });
    resizeObserver.observe(divRef.current);

    // Wrap your disconnect logic in a check for component mount status
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    handleVisibility();
  }, [])


  
  const handleMinimize = () => {
    if(!resizable) return;

    setCurrentWith(initialWith);
    setCurrentHeight(initialHeight);


    setLevel(nextZIndex());
  }; 
  const handleMaximize = () => {
    if(!resizable) return;

    setLeft(marginLimits);
    setTop(marginLimits);

    setCurrentWith(window.innerWidth - (marginLimits * 3));
    setCurrentHeight(window.innerHeight - (marginLimits * 3));


    setLevel(nextZIndex());

    
  }; 

  return (
    <div
      id={id}
      ref={divRef}
      className="window-container"
      style={!resizable ? styles : {...styles , resize : "both"}}
      onClick={() => {
        setLevel(nextZIndex());
      }}
    >
      {titleBar && (
        <div
          className="title-bar"
          data-parent={id}
          style={{opacity: visibility}}
        >
          {titleBar.icon && (
            <span className="icon">{titleBar.icon}</span>
          )}
          {titleBar.buttons && (
            <div className="buttonContainer">
              {titleBar.buttons.minimize && (
                <button className="windowButton" onClick={() => { if (handleClose && id) handleClose(id); }}>
                  <Icon name="XMarkIcon" fontSize={100}/>
                </button>
              )}
              {titleBar.buttons.maximize && (
                <button className="windowButton" onClick={handleMinimize}>
                  <Icon name="MinusIcon" fontSize={100}/>
                </button>
              )}
              {titleBar.buttons.close && (
                <button className="windowButton" onClick={handleMaximize}>
                    <Icon name="PlusIcon" fontSize={100}/>
                </button>
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
        style={{ overflow: "hidden", height: "100%",position:"relative" }}
      >
        {isResolutionInfoShow && (
          <div className="informationWindow">
            <Icon style={{position: "absolute", left: "0%",bottom: "0%" , height: "75px",color:  "white"}} name='ArrowDownLeftIcon'/>
            <Icon style={{position: "absolute", right: "0%",bottom: "0%" , height: "75px",color:  "white"}} name='ArrowDownRightIcon'/>
            <Icon style={{position: "absolute", left: "0%",top: "0%" , height: "75px",color:  "white"}} name='ArrowUpLeftIcon'/>
            <Icon style={{position: "absolute", right: "0%",top: "0%" , height: "75px",color:  "white"}} name='ArrowUpRightIcon'/>
            <h1>Resolution: "{currentWith.toFixed(0)}x{currentHeight.toFixed(0)}"</h1>
          </div>
        )}
        {children}
      </div>
    </div>
  );
});

export default Window;
