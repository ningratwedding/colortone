
export function hexToRgba(hex: string, opacity: number = 1): string {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        return hex; // Return original if not a valid hex
    }

    let c = hex.substring(1).split('');
    if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    const num = parseInt(c.join(''), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
