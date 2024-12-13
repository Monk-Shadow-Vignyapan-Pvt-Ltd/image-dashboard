import React, { useRef, useCallback } from "react";
import { FaPlus } from "react-icons/fa6";

const DragImages = ({ images, onImagesChange }) => {
  const fileInputRef = useRef(null);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDrop = useCallback(async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    const base64Images = await Promise.all(files.map((file) => convertToBase64(file)));
    onImagesChange([...images, ...base64Images]);
  }, [images, onImagesChange]);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleFileInputChange = async (event) => {
    const files = Array.from(event.target.files);
    const base64Images = await Promise.all(files.map((file) => convertToBase64(file)));
    onImagesChange([...images, ...base64Images]);

    // Reset file input after processing files
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleClear = () => {
    onImagesChange([]); // Clear images in the parent component
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset file input
    }
  };

  const handleRemoveImage = (imageToRemove) => {
    const updatedImages = images.filter((image) => image !== imageToRemove);
    onImagesChange(updatedImages);
  };

  return (
    <div
      className="relative border-dashed border-2 border-border p-6 rounded-lg flex flex-col gap-4 items-center justify-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="text-center">
        <p className="text-secondaryText text-md">
          Drag and drop your Before After images here or click the button to add.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          id="fileInput"
          onChange={handleFileInputChange}
        />
        <div className="flex items-center justify-center mt-4 gap-3 h-fit">
          <label
            htmlFor="fileInput"
            className="cursor-pointer text-sm font-semibold px-4 py-2 text-white rounded-md border-2 border-accent bg-accent hover:bg-accent/75 duration-300"
          >
            Add Images
          </label>
          <button
            onClick={handleClear}
            className="text-sm font-semibold px-4 py-2 text-dangerRed rounded-md border-2 border-dangerRed hover:bg-dangerRed hover:text-mainBg duration-300"
          >
            Clear Images
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img src={image} alt={`uploaded-image-${index}`} className="w-full h-auto rounded-md" />
            <button
              onClick={() => handleRemoveImage(image)}
              className="absolute top-2 right-2 bg-dangerRed text-white rounded-full flex items-center justify-center icon-lg hover:bg-dangerRed/80 duration-300"
              aria-label="Remove Image"
            >
              <FaPlus className="rotate-45 text-cardBg" size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DragImages;
