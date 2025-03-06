import * as pako from "pako";

export const decompressObjBrowser = (compressedData) => {
  try {
    // Decompress the gzip data using pako
    const decompressedData = pako.inflate(compressedData);

    // Convert to string
    const decoder = new TextDecoder("utf-8");
    const objString = decoder.decode(decompressedData);

    console.log(
      "OBJ file successfully decompressed, length:",
      objString.length
    );

    return {
      success: true,
      objString,
      length: objString.length,
    };
  } catch (error) {
    console.error("Error decompressing OBJ file:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
