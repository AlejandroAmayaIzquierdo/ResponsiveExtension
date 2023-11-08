export const nextZIndex = (): number => {
    let maxZ = 0;
    for (const w of document.querySelectorAll(".window-container")) {
        const z = parseInt((w as HTMLElement).style.zIndex);
        maxZ = Math.max(isNaN(z) ? 0 : z, maxZ);
    }
    return maxZ + 1;
};
