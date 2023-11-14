import React, { useState, useEffect } from 'react';
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";

import { getAllWindowOptions } from '../../utils/WindowsOptions';
import { WindowProps } from '../FloatingWindow/Window';
import { toast } from 'sonner'
import { TYPES } from '../../utils/Interfaces';
import { setLocalStorageItem } from '../../utils/handleLocalStorage';
import { COMMAND_PAGES } from '../../constants/CommandPages';

import { useIntl } from 'react-intl';

import Icon from 'react-cmdk/dist/components/Icon';

import "react-cmdk/dist/cmdk.css";
import "./command.css";
import { GithubOutlined,DatabaseOutlined } from '@ant-design/icons';


const COMMAND_KEY = 'p';

const resolutions = Object.entries(getAllWindowOptions());

interface CommandMenuProps {
    layout?: WindowProps[];
    onAdWindow?: (id: string,resizable: boolean) => void;
    onRemoveWindow?: (id: string) => void;
    onClearBoard?: () => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ layout, onAdWindow,onClearBoard }) => {

    const intl = useIntl();

    const [page, setPage] = useState<string>(COMMAND_PAGES.ROOT);
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState("");

    const filteredItems = filterItems(
        [
            {
                heading: intl.formatMessage({id:"page.WorkSpace"}),
                id: "workspace",
                items: [
                    {
                        id: "saveWorkSpace",
                        children: intl.formatMessage({id:"settings.WorkSpace.save"}),
                        key: "saveWorkSpacePage",
                        icon: "ChevronRightIcon",
                        onClick: () => {
                            if (!layout) return;
                            console.log(layout);
                            const toSave: TYPES.WorkSpace = {
                                name: "Default Layout",
                                layout: layout.map(window => {return {...window}})
                            }
                            setLocalStorageItem("workspace", JSON.stringify(toSave));
                            toast.success(intl.formatMessage({id:"toast.workspace.success"}));
                        }
                    }
                ],
            },
            {
                heading: intl.formatMessage({id:"settings.windows"}),
                id: "window",
                items: [
                    {
                        id: "addWindow",
                        children: intl.formatMessage({id:"settings.windows.addWindow"}),
                        key: "addWindowPage",
                        icon: "ChevronRightIcon",
                        closeOnSelect: false,
                        onClick: () => {
                            setPage(COMMAND_PAGES.ADD_WINDOW);
                            setSearch("");
                        }
                    },
                    {
                        id: "addResizableWindow",
                        children: intl.formatMessage({id:"settings.windows.addCustomWindow"}),
                        key: "addResizableWindowPage",
                        icon: "ChevronRightIcon",
                        onClick: () => {
                            if (onAdWindow)
                                onAdWindow("custom",true);
                            setPage(COMMAND_PAGES.ROOT);
                            setSearch("");
                        }
                    },
                    {
                        id: "clearBoard",
                        children: intl.formatMessage({id:"settings.windows.clearBoard"}),
                        key: "clearBoardPage",
                        icon: "ChevronRightIcon",
                        onClick: () => {
                            if(onClearBoard)
                                onClearBoard();
                            setPage(COMMAND_PAGES.ROOT);
                            setSearch("");

                        }
                    }
                ],
            },
            {
                heading: "About",
                id: "about",
                items: [
                    {
                        id: "Developer",
                        children: "Developer",
                        key: "DeveloperPage",
                        icon: ( () => <GithubOutlined style={{color: "white"}} rev={"test"} />),
                        onClick: () => {
                            window.open('https://github.com/AlejandroAmayaIzquierdo', '_blank');
                        }
                    },
                    {
                        id: "Repository",
                        children: "Repository",
                        key: "RepositoryPage",
                        icon: ( () => <DatabaseOutlined style={{color: "white"}} rev={"test"} />),
                        onClick: () => {
                            window.open('https://github.com/AlejandroAmayaIzquierdo/ResponsiveExtension', '_blank');
                        }
                    },
                ],
            },
        ],
        search
    );

    const windowsFilter = filterItems(
        [
            {
                heading: intl.formatMessage({id:"settings.devices.tittle"}),
                id: "Devices",
                items: resolutions.map((value) => {
                    return {
                        id: value[0],
                        key: value[0] + Math.floor(Math.random() * 100),
                        children: value[1].name,
                        onClick: () => {
                            if (onAdWindow)
                                onAdWindow(value[0],false);
                            setPage(COMMAND_PAGES.ROOT);
                            setSearch("");
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
            setPage(COMMAND_PAGES.ROOT);
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
                <CommandPalette.Page id={COMMAND_PAGES.ROOT} key={COMMAND_PAGES.ROOT}>
                    {filteredItems.length ? (
                        filteredItems.map((list) => (
                            <CommandPalette.List key={list.id} heading={list.heading}>
                                {list.items.map(({ id, ...rest },index) => (
                                    <CommandPalette.ListItem
                                        key={`${id}-${index}`}
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

                <CommandPalette.Page id={COMMAND_PAGES.ADD_WINDOW} key={COMMAND_PAGES.ADD_WINDOW}>
                    {windowsFilter.length ? (
                        windowsFilter.map((list,index) => (
                            <CommandPalette.List key={`${list.id}-${index}`}>
                                {list.items.map(({ id,key, ...rest },index) => {
                                    if(id === "custom") return (<></>);
                                    return(
                                    <CommandPalette.ListItem
                                        key={`${id}-${index}`}
                                        index={getItemIndex(windowsFilter, id)}
                                        {...rest}
                                    />);
                                })}
                            </CommandPalette.List>
                        ))
                    ) : (<CommandPalette.FreeSearchAction key={"freeSearch"}/>)}
                </CommandPalette.Page>
            </CommandPalette>
            <div className='settings-Button' onClick={() => setOpen(true)}><Icon name='Cog6ToothIcon' scale={10}/></div>
            <div className='hint-text'>
                {intl.formatMessage({id:"page.hint"})}
            </div>
        </>
        

    );
}

export default CommandMenu;