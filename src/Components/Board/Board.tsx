import React, { useState, useEffect } from 'react';
import Window, { WindowProps } from "../FloatingWindow/Window";

import CommandMenu from '../Command/command';
import useWindowDimensions from '../../hooks/useWindowDimensions';


import { getDeviceByKey } from '../../utils/WindowsOptions';
import { getLocalStorageItem } from '../../utils/handleLocalStorage';
import { TYPES } from '../../utils/Interfaces';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';


import "./Board.css";


interface BoardProps {
    url: string
}
const Board: React.FC<BoardProps> = ({url}) => {

    const intl = useIntl();

    const { height, width } = useWindowDimensions();

    const [layout, setLayout] = useState<WindowProps[]>([]);
    const [windowRefs, setWindowRefs] = useState<React.RefObject<WindowProps>[]>(layout.map(() => React.createRef()));

    const uid = (): string => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    const handleAddItem = (key: string,resizable: boolean = false) => {
        const id = uid();
        const device = getDeviceByKey(key);
        const newItem: WindowProps = {
            id: id,
            height: device?.landscapeWidth,
            width: device?.portraitWidth,
            resizable: resizable,
            titleBar: {
                title: device?.name,
                buttons: { minimize: true, maximize: true, close: true },
            }
        }

        setLayout((prevLayout) => [...prevLayout, newItem]);
    }
    const handleRemoveItem = (id: string) => {console.log(layout.length,windowRefs.length); setLayout([...layout.filter(e => e.id !== id)]);}

    const handleLoadLayout = () => {
        try {
            const workspace = JSON.parse(getLocalStorageItem("workspace") || "") as TYPES.WorkSpace;

            if (!workspace) toast.error("Error loading workspace");

            setLayout(workspace.layout.map(window => {return {...window,initialLeft: window.left,initialTop: window.top}}) || []);

            toast.success(intl.formatMessage({id:"toast.load.success"}));
        } catch (error) {
            toast.error(intl.formatMessage({id:"toast.error.loading"}));
        }

    }

    const handleWindowDragEnd = (item: WindowProps) => {
        setLayout((prevLayout) => {
            const index = prevLayout.findIndex((window) => window.id === item.id);
    
            if (index !== -1) {
                const updatedLayout = [...prevLayout];
                updatedLayout[index] = { ...updatedLayout[index], ...item };
                return updatedLayout;
            }
    
            return prevLayout;
        });
    }
    
    const handleClearBoard = () => {
        setLayout([]);
    }
    const handleCheckVisibility = () => {
        windowRefs.forEach((windowRef) => {
            if (windowRef.current?.checkVisibility) 
                windowRef.current?.checkVisibility();
          });
    }

    useEffect(() => {
        handleLoadLayout();
        setWindowRefs(layout.map(() => React.createRef()));
    }, []);

    useEffect(() => {
        setWindowRefs(layout.map(() => React.createRef()));
      }, [layout.length]);
    

    useEffect(() => {
        handleCheckVisibility();
    }, [width,height])
    

    return (
        <div className='react-grid-layout'>
            {layout.map((window, index) => {

                return (
                    <Window 
                    {...window}
                    key={window.id}
                    ref={windowRefs[index]}
                    handleClose={(id) => { handleRemoveItem(id) }} 
                    onDragEnd={(item) => handleWindowDragEnd(item)}  >
                        <iframe className='innerContent' frameBorder={0} src={url}></iframe>
                    </Window>
                );
            })}
            <CommandMenu key={"commandMenu"} layout={layout} onAdWindow={handleAddItem} onClearBoard={handleClearBoard} />
        </div>
    );
}

export default Board;