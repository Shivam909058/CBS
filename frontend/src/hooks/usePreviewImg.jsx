import { useState } from "react";

const usePreviewImg = () => {
  const [imgUrls, setImgUrls] = useState([]); // array to store multiple image URLs
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // handle multiple files
    const validImages = files.filter(file => file.type.startsWith("image/"));

    if (validImages.length) {
      const newImgUrls = [];

      validImages.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImgUrls.push(reader.result);
          if (newImgUrls.length === validImages.length) {
            setImgUrls(newImgUrls); // set once all images are loaded
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      showToast("Invalid file type", "Please select valid image files", "error");
      setImgUrls([]);
    }
  };

  return { handleImageChange, imgUrls, setImgUrls };
};

export default usePreviewImg;
