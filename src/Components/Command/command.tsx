import React, { useState, useEffect } from 'react';
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import { getAllWindowOptions } from '../../utils/WindowsOptions';
import { WindowProps } from '../FloatingWindow/Window';
import { toast } from 'sonner'

import { TYPES } from '../../utils/Interfaces';

import "react-cmdk/dist/cmdk.css";
import "./command.css";
import { setLocalStorageItem } from '../../utils/handleLocalStorage';
import Icon from 'react-cmdk/dist/components/Icon';

const COMMAND_KEY = 'p';

const resolutions = Object.entries(getAllWindowOptions());

interface CommandMenuProps {
    layout?: WindowProps[];
    onAdWindow?: (id: string) => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ layout, onAdWindow }) => {

    const [page, setPage] = useState<string>("root");
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState("");

    const filteredItems = filterItems(
        [
            {
                heading: "WorkSpace",
                id: "workspace",
                items: [
                    {
                        id: "saveWorkSpace",
                        children: "Save WorkSpace",
                        icon: "ChevronRightIcon",
                        onClick: () => {
                            if (!layout) return;
                            console.log(layout);
                            const toSave: TYPES.WorkSpace = {
                                name: "Default Layout",
                                layout: layout.map(window => {return {...window}})
                            }
                            setLocalStorageItem("workspace", JSON.stringify(toSave));
                            toast.success("WorkSpace Save");
                        }
                    }
                ],
            },
            {
                heading: "Windows",
                id: "window",
                items: [
                    {
                        id: "addWindow",
                        children: "Add Preset window",
                        icon: "ChevronRightIcon",
                        closeOnSelect: false,
                        onClick: () => {
                            setPage("addWindow");
                            setSearch("");
                        }
                    },
                    {
                        id: "addCustomWindow",
                        children: "Add Custom window",
                        icon: "ChevronRightIcon",
                    },
                    {
                        id: "settings",
                        children: "Remove Window",
                        icon: "ChevronRightIcon",
                    }
                ],
            }
        ],
        search
    );

    const windowsFilter = filterItems(
        [
            {
                heading: "Devices",
                id: "Devices",
                items: resolutions.map((value) => {
                    return {
                        id: value[0],
                        children: value[1].name,
                        onClick: () => {
                            if (onAdWindow)
                                onAdWindow(value[0]);
                        }
                    }
                })
            }
        ],
        search
    );


    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === COMMAND_KEY) {
                e.preventDefault();
                setOpen(!open);
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            setPage("root");
            setSearch("");
        }
    }, [open]);


    return (
        <>
            <CommandPalette
                onChangeSearch={setSearch}
                onChangeOpen={setOpen}
                search={search}
                isOpen={open}
                page={page}
                
            >
                <CommandPalette.Page id="root">
                    {filteredItems.length ? (
                        filteredItems.map((list) => (
                            <CommandPalette.List key={list.id} heading={list.heading}>
                                {list.items.map(({ id, ...rest }) => (
                                    <CommandPalette.ListItem
                                        key={id}
                                        index={getItemIndex(filteredItems, id)}
                                        {...rest}
                                    />
                                ))}
                            </CommandPalette.List>
                        ))
                    ) : (
                        <CommandPalette.FreeSearchAction />
                    )}
                </CommandPalette.Page>

                <CommandPalette.Page id="addWindow">
                    {windowsFilter.length ? (
                        windowsFilter.map((list) => (
                            <CommandPalette.List key={list.id}>
                                {list.items.map(({ id, ...rest }) => (
                                    <CommandPalette.ListItem
                                        key={id}
                                        index={getItemIndex(windowsFilter, id)}
                                        {...rest}
                                    />
                                ))}
                            </CommandPalette.List>
                        ))
                    ) : (<CommandPalette.FreeSearchAction />)}
                </CommandPalette.Page>
            </CommandPalette>
            <div className='settings-Button' onClick={() => setOpen(true)}><Icon name='Cog6ToothIcon' scale={10}/></div>
            <div className='hint-text'>
            Press 'Ctrl + p' to open settings
            </div>
        </>
        

    );
}

export default CommandMenu;