import QRCode from "qrcode";

export const generateQRDataUrl = async (text) => {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "M",
      type: "image/png",
      width: 256,
      color: {
        dark: "#101828",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Error generating QR code", err);
    return null;
  }
};
