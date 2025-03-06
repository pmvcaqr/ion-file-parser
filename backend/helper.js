const getBase64Image = (pythonByteString = "") => {
  if (!pythonByteString) {
    return "";
  }

  // Parse the Python byte string
  let bytes = [];
  const hexPattern = /\\x([0-9a-fA-F]{2})/g;
  let match;
  let lastIndex = 0;

  // Remove b prefix and quotes
  let processedString = pythonByteString.replace(/^b['"]|['"]$/g, "");

  while ((match = hexPattern.exec(processedString)) !== null) {
    for (let i = lastIndex; i < match.index; i++) {
      if (processedString[i] !== "\\") {
        bytes.push(processedString.charCodeAt(i));
      }
    }
    bytes.push(parseInt(match[1], 16));
    lastIndex = hexPattern.lastIndex;
  }

  for (let i = lastIndex; i < processedString.length; i++) {
    if (
      processedString[i] !== "\\" ||
      i === processedString.length - 1 ||
      processedString[i + 1] !== "x"
    ) {
      bytes.push(processedString.charCodeAt(i));
    }
  }

  // Create buffer from the byte array
  const buffer = Buffer.from(bytes);

  // For display in web browsers, we can convert to base64
  const base64 = buffer.toString("base64");
  const dataUrl = `data:image/jpeg;base64,${base64}`;

  console.log(
    "JPEG data processed, first bytes:",
    buffer.slice(0, 16).toString("hex")
  );

  return dataUrl;
};

/**
 * Converter for ROS compressed images (sensor_msgs/CompressedImage)
 * Handles BGR8 JPEG data from Python bytes
 */
const fs = require("fs");

/**
 * Converts a Python byte string containing ROS compressed image data to a usable image
 * @param {string} pythonByteString - The Python byte string representation of the image
 * @returns {Object} Object containing the processed image data
 */
function convertROSCompressedImage(pythonByteString) {
  // First, handle the Python byte string format
  // We'll extract the actual hexadecimal values
  const bytes = [];

  // Remove the b prefix and quotes
  let cleaned = pythonByteString.replace(/^b['"]|['"]$/g, "");

  // Process the string character by character for more precise control
  let i = 0;
  while (i < cleaned.length) {
    if (cleaned.substring(i, i + 2) === "\\x") {
      // Extract the hex byte value
      const hexByte = cleaned.substring(i + 2, i + 4);
      bytes.push(parseInt(hexByte, 16));
      i += 4;
    } else if (cleaned.substring(i, i + 1) === "\\") {
      // Handle escaped characters
      const nextChar = cleaned.charAt(i + 1);
      if (nextChar === "n") bytes.push(10); // \n
      else if (nextChar === "r") bytes.push(13); // \r
      else if (nextChar === "t") bytes.push(9); // \t
      else if (nextChar === "\\") bytes.push(92); // backslash
      else if (nextChar === "'") bytes.push(39); // single quote
      else if (nextChar === '"') bytes.push(34); // double quote
      else bytes.push(cleaned.charCodeAt(i + 1));
      i += 2;
    } else {
      // Regular character
      bytes.push(cleaned.charCodeAt(i));
      i += 1;
    }
  }

  // Create a Buffer from the byte values
  const buffer = Buffer.from(bytes);

  // Log information about the data
  console.log(`Processed ${bytes.length} bytes`);
  console.log("First bytes:", buffer.slice(0, 20).toString("hex"));
  console.log("Last bytes:", buffer.slice(-20).toString("hex"));

  // Check for valid JPEG signature (FF D8 at start, FF D9 at end)
  const isValidJpeg =
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[buffer.length - 2] === 0xff &&
    buffer[buffer.length - 1] === 0xd9;

  if (!isValidJpeg) {
    console.warn("Warning: Data does not appear to be a valid JPEG.");
    // Look for JPEG signature to see if there's a header before the actual JPEG data
    for (let j = 0; j < buffer.length - 1; j++) {
      if (buffer[j] === 0xff && buffer[j + 1] === 0xd8) {
        console.log(`Found JPEG signature at byte offset ${j}`);
        // Extract just the JPEG part
        buffer = buffer.slice(j);
        break;
      }
    }
  }

  // Write the processed image to file
  //   try {
  //     fs.writeFileSync(outputPath, buffer);
  //     console.log(`Image saved to ${outputPath}`);
  //   } catch (err) {
  //     console.error("Error saving image:", err);
  //   }

  // Convert to base64 for web display
  const base64 = buffer.toString("base64");
  const dataUrl = `data:image/jpeg;base64,${base64}`;

  return {
    buffer,
    base64,
    dataUrl,
    isValidJpeg,
    byteCount: bytes.length,
  };
}

/**
 * An enhanced version that handles potential ROS message format
 * @param {string} pythonByteString - The Python byte string
 * @returns {Object} Object containing the processed image data
 */
function processROSCompressedImage(pythonByteString) {
  const result = convertROSCompressedImage(pythonByteString);

  // Additional checks and processing specific to ROS images

  // In ROS CompressedImage format, there might be header information
  // The actual image data follows the header
  // Let's check if we can detect a more specific format

  const buffer = result.buffer;

  // Check for potential ROS format issues
  if (!result.isValidJpeg) {
    console.log("Attempting to extract valid JPEG data from ROS message...");

    // ROS CompressedImage might have format information before the actual JPEG data
    // Let's search for JPEG signature (FF D8)
    let jpegStartIndex = -1;
    for (let i = 0; i < buffer.length - 1; i++) {
      if (buffer[i] === 0xff && buffer[i + 1] === 0xd8) {
        jpegStartIndex = i;
        break;
      }
    }

    if (jpegStartIndex > 0) {
      console.log(`Found JPEG marker at index ${jpegStartIndex}`);

      // Extract just the JPEG portion
      const jpegBuffer = buffer.slice(jpegStartIndex);

      // Update result
      result.extractedBuffer = jpegBuffer;
      result.extractedBase64 = jpegBuffer.toString("base64");
      result.extractedDataUrl = `data:image/jpeg;base64,${result.extractedBase64}`;
      result.extractedPath = extractedPath;
    }
  }

  // For debugging: dump a hex view of the beginning of the file
  console.log("Hex dump of first 100 bytes:");
  let hexDump = "";
  let asciiDump = "";

  for (let i = 0; i < Math.min(100, buffer.length); i++) {
    if (i > 0 && i % 16 === 0) {
      console.log(`${hexDump}  |  ${asciiDump}`);
      hexDump = "";
      asciiDump = "";
    }

    const byte = buffer[i];
    hexDump += byte.toString(16).padStart(2, "0") + " ";

    // Add to ASCII representation if printable
    if (byte >= 32 && byte <= 126) {
      asciiDump += String.fromCharCode(byte);
    } else {
      asciiDump += ".";
    }
  }

  // Print any remaining bytes
  if (hexDump) {
    hexDump = hexDump.padEnd(16 * 3, " ");
    console.log(`${hexDump}  |  ${asciiDump}`);
  }

  return result;
}

module.exports = {
  getBase64Image,
  convertROSCompressedImage,
  processROSCompressedImage,
};
