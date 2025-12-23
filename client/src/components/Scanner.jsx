import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const Scanner = ({ onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const startScanning = async () => {
    try {
      setError(null);
      
      // Initialize scanner if not already initialized
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("reader");
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [
          // Support common barcode formats
          0, // CODE_128
          1, // CODE_39
          2, // EAN_13
          3, // EAN_8
          4, // UPC_A
          5, // UPC_E
        ]
      };

      await html5QrCodeRef.current.start(
        { facingMode: "environment" }, // Use back camera on mobile
        config,
        (decodedText, decodedResult) => {
          console.log("Scan result:", decodedText);
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Scan error, can be ignored for continuous scanning
          console.debug("Scan error:", errorMessage);
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      let errorMessage = "Failed to start camera. ";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage += "Camera access was denied. Please grant camera permissions.";
      } else if (err.name === "NotFoundError") {
        errorMessage += "No camera found on this device.";
      } else {
        errorMessage += err.message || "Unknown error occurred.";
      }
      
      setError(errorMessage);
      if (onScanError) {
        onScanError(errorMessage);
      }
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current && isScanning) {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      }
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []); // Empty dependency array - cleanup should run on unmount only

  return (
    <div className="w-full">
      <div className="mb-4">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg"
          >
            Start Scan
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg"
          >
            Stop Scan
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isScanning && (
        <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
          <div id="reader" ref={scannerRef} className="w-full"></div>
          <div className="absolute top-2 left-2 right-2 text-center">
            <p className="bg-black bg-opacity-70 text-white text-sm py-2 px-4 rounded">
              Position barcode within the frame
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
