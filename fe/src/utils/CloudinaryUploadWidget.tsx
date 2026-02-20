import { useEffect, useRef } from "react";
import { Button } from "@mui/material";
import { Cloud } from "lucide-react";

const CLOUDNAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOADPRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

// Cloudinary 전역 타입 선언
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: {
          cloudName: string | undefined;
          uploadPreset: string | undefined;
        },
        callback: (error: Error | null, result: CloudinaryResult) => void,
      ) => { open: () => void };
    };
  }
}

interface CloudinaryResult {
  event: string;
  info: {
    secure_url: string;
  };
}

interface CloudinaryUploadWidgetProps {
  uploadImage: (url: string) => void;
}

const CloudinaryUploadWidget = ({
  uploadImage,
}: CloudinaryUploadWidgetProps) => {
  const widgetRef = useRef<{ open: () => void } | null>(null);

  useEffect(() => {
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDNAME,
        uploadPreset: UPLOADPRESET,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);

          const uploadedImage = document.getElementById("uploadedimage");
          if (uploadedImage) {
            uploadedImage.setAttribute("src", result.info.secure_url);
          }

          uploadImage(result.info.secure_url);
        }
      },
    );
  }, [uploadImage]);

  const handleClick = () => {
    widgetRef.current?.open();
  };

  return (
    <Button
      variant="contained"
      size="small"
      startIcon={<Cloud />}
      onClick={handleClick}
      sx={{ ml: 1 }}
    >
      Upload Image +
    </Button>
  );
};

export default CloudinaryUploadWidget;
