import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ImageUpload = ({ images = [], onChange, maxImages = 5, maxSizeMB = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed";
    }

    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      return `Image size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files) => {
    setError("");

    // Check max images limit
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles = [];
    const errors = [];

    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    try {
      const base64Images = await Promise.all(
        validFiles.map(file => convertToBase64(file))
      );

      onChange([...images, ...base64Images]);
    } catch (err) {
      setError("Failed to process images. Please try again.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer",
          "hover:border-primary/60 hover:bg-primary/5",
          isDragging && "border-primary bg-primary/10 scale-[0.98]",
          images.length >= maxImages && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={images.length >= maxImages}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <motion.div
            animate={{
              scale: isDragging ? 1.1 : 1,
              rotate: isDragging ? 5 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon
              name="Image"
              className={cn(
                "h-10 w-10 transition-colors",
                isDragging ? "text-primary" : "text-gray-400"
              )}
            />
          </motion.div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragging ? "Drop images here" : "Drag & drop images or click to browse"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {images.length >= maxImages
                ? `Maximum ${maxImages} images reached`
                : `PNG, JPG, GIF up to ${maxSizeMB}MB (${images.length}/${maxImages})`}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center space-x-2 text-sm text-error bg-error/10 rounded-lg p-3"
          >
            <ApperIcon name="AlertCircle" className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  className={cn(
                    "absolute top-2 right-2 p-1.5 rounded-full",
                    "bg-error text-white shadow-lg",
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    "hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error/50"
                  )}
                >
                  <ApperIcon name="X" className="h-4 w-4" />
                </button>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;