import { resolutions, resolutionsInterface } from "../constants/Resolutions"

export const getAllWindowOptions = () => {
    return resolutions;
}
export const getDeviceByKey = (key: string): resolutionsInterface | null => {
    const find = Object.entries(resolutions).find(res => res[0] === key)?.[1] as resolutionsInterface;
    if (find)
        return find;
    return null;
}