/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { imageData, width, height, quality } = data;

  try {
    if (!imageData || !width || !height) {
      postMessage({ error: 'Invalid data received' });
      return;
    }

    // Create OffscreenCanvas
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      postMessage({ error: 'Canvas context not available' });
      return;
    }

    // Create ImageData and put it on canvas
    const imgData = new ImageData(
      new Uint8ClampedArray(imageData),
      width,
      height
    );
    ctx.putImageData(imgData, 0, 0);

    // Convert to blob
    canvas.convertToBlob({
      type: 'image/jpeg',
      quality: quality || 0.8
    }).then(blob => {
      postMessage({ blob });
    }).catch(error => {
      postMessage({ error: error.message });
    });
  } catch (error: any) {
    postMessage({ error: error.message || 'Compression failed' });
  }
});
