export function expiresInToMilliseconds(expiresIn: string): number | null {
    const match = expiresIn.match(/^(\d+)([smhdw])$/);
    
    if (!match) {
        return null;
    }

    const num = parseInt(match[1], 10);
    const type = match[2];

    switch (type) {
        case 's': return num * 1000;          // seconds
        case 'm': return num * 60 * 1000;     // minutes
        case 'h': return num * 60 * 60 * 1000; // hours
        case 'd': return num * 24 * 60 * 60 * 1000; // days
        case 'w': return num * 7 * 24 * 60 * 60 * 1000; // weeks
        default: return null;
    }
}
