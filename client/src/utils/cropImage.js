export const cropImage = async (fileURL, pixels) => {
    // Pixel é a área recortada em pixels, que é o que realmente importa para o recorte da imagem. O crop é apenas a posição e zoom atuais do cropper, mas o pixels é a área exata que deve ser recortada da imagem original.
    const image = new Image();
    image.src = fileURL;

    await new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
    });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixels.width;
    canvas.height = pixels.height;

    ctx.drawImage(
        image,
        pixels.x,
        pixels.y,
        pixels.width,
        pixels.height,
        0,
        0,
        pixels.width,
        pixels.height
    );
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Falha ao criar blob da imagem recortada.'));
                return;
            }
            const previewURL = URL.createObjectURL(blob);
            resolve({blob, previewURL});
        }, 'image/webp', 0.9);
    });
}
