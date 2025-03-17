self.downloadNetworkImage = async function (url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to download image: ${url}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error(`Error downloading image: ${error.message}`);
    return console.error.toString();
  }
};

self.addWaterMark = async function (data) {
  try {
    // Convert Base64 string to Uint8Array
    const binaryString = atob(data.imageBase64);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    // Create an image from the Uint8Array
    const blob = new Blob([uint8Array], { type: "image/png" });
    const imageBitmap = await createImageBitmap(blob);

    // Create an OffscreenCanvas
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext("2d");

    // Draw the original image on the canvas
    ctx.drawImage(imageBitmap, 0, 0);

    // Set watermark text style
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // White, 50% opacity
    ctx.font = "32px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    // Repeat watermark text across the image
    const stepX = data.stepX; // Horizontal spacing
    const stepY = data.stepY; // Vertical spacing
    for (let y = 0; y < imageBitmap.height; y += stepY) {
      for (let x = 0; x < imageBitmap.width; x += stepX) {
        ctx.fillText(data.text, x, y);
      }
    }

    // Convert canvas to Blob and then to Base64
    const blobImage = await canvas.convertToBlob({ type: "image/png" });
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onloadend = () => {
        const base64Output = reader.result.split(",")[1]; // Remove "data:image/png;base64,"
        resolve(base64Output);
      };
      reader.readAsDataURL(blobImage);
    });
  } catch (error) {
    console.error("Error adding watermark:", error);
    return null;
  }
};

// self.addWaterMark = async function (imageBase64) {
//   try {
//     console.log("imageBase64 from dart : ", imageBase64);

//     const binaryString = atob(imageBase64);
//     const length = binaryString.length;
//     const uint8Array = new Uint8Array(length);
//     for (let i = 0; i < length; i++) {
//       uint8Array[i] = binaryString.charCodeAt(i);
//     }

//     const image = await Jimp.read(uint8Array.buffer);
//     const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

//     const stepX = 200;
//     const stepY = 150;

//     for (let y = 0; y < image.bitmap.height; y += stepY) {
//       for (let x = 0; x < image.bitmap.width; x += stepX) {
//         image.print(font, x, y, "Skeddio");
//       }
//     }

//     const buffer = await image.getBase64Async(Jimp.MIME_WEBP);
//     return buffer;
//   } catch (error) {
//     console.error("Error adding watermark:", error);
//     return console.error.toString();
//   }
// };
