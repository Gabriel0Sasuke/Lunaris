export function calcularXp(xp) {
    if (xp < 10) {
        return 0;
    }else if (xp < 20) {
        return 1;
    }else if (xp < 40) {
        return 2;
    }else if (xp < 80) {
        return 3;
    }else if (xp < 160) {
        return 4;
    }else if (xp < 320) {
        return 5;
    }else if (xp < 640) {
        return 6;
    }else if (xp < 1280) {
        return 7;
    }else if (xp < 2560) {
        return 8;
    }else if (xp < 5120) {
        return 9;
    }else {
        return 10;
    }
}