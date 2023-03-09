export const compressImage = (
  file,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.7
) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = Math.round(maxWidth / aspectRatio);
        }

        if (height > maxHeight) {
          height = maxHeight;
          width = Math.round(maxHeight * aspectRatio);
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "#fff"; // Replace with the original image's background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = (err) => {
      reject(err);
    };

    img.src = URL.createObjectURL(file);
  });
};
