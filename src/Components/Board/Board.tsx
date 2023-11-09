import React, { useState, useEffect } from 'react';
import Window, { WindowProps } from "../FloatingWindow/Window";
import { getDeviceByKey } from '../../utils/WindowsOptions';
import CommandMenu from '../Command/command';
import "./Board.css";
import { getLocalStorageItem } from '../../utils/handleLocalStorage';
import { TYPES } from '../../utils/Interfaces';
import { toast } from 'sonner'
import Icon from 'react-cmdk/dist/components/Icon';



interface BoardProps {
    url: string
}
const Board: React.FC<BoardProps> = ({url}) => {

    const [layout, setLayout] = useState<WindowProps[]>([]);

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

        setLayout([...layout, newItem]);
    }
    const handleRemoveItem = (id: string) => {
        const newLayout = layout.filter(e => e.id !== id);

        setLayout(newLayout);
    }

    const handleLoadLayout = () => {
        try {
            const workspace = JSON.parse(getLocalStorageItem("workspace") || "") as TYPES.WorkSpace;

            if (!workspace) toast.error("Error loading workspace");

            setLayout(workspace.layout.map(window => {return {...window,initialLeft: window.left,initialTop: window.top}}) || []);

            toast.success("WorkSpace  \"" + workspace.name + "\"  Loading correctly");
        } catch (error) {
            toast.error("Error loading workspace");
        }

    }

    const handleWindowDragEnd = (item: WindowProps) => {
        const index = layout.findIndex((window) => window.id === item.id);

        if (index !== -1) {
            const updatedLayout = [...layout];
        
            updatedLayout[index] = {...updatedLayout[index],...item};
        
            setLayout(updatedLayout);
          }
    }
    
    const handleClearBoard = () => {
        setLayout([]);
    }

    useEffect(() => {
        handleLoadLayout();
    }, []);

    return (
        <div className='react-grid-layout'>
            {layout.map((window) => {

                return (
                    <Window {...window} handleClose={(id) => { handleRemoveItem(id) }} onDragEnd={(item) => handleWindowDragEnd(item)} key={window.id} >
                        <iframe className='innerContent' src={url}></iframe>
                    </Window>
                );
            })}
            <CommandMenu layout={layout} onAdWindow={handleAddItem} onClearBoard={handleClearBoard} />
        </div>
    );
}

export default Board;