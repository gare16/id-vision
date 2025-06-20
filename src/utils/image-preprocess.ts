export async function preprocessImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
  
        ctx.drawImage(img, 0, 0);
  
        // Grayscale + contrast
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        for (let i = 0; i < data.length; i += 4) {
          const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const contrasted = avg > 128 ? 255 : 0; // Binarize
          data[i] = data[i + 1] = data[i + 2] = contrasted;
        }
  
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
  
      img.src = url;
    });
  }
  