import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ImageUpload from "@/components/atoms/ImageUpload";
import { feedbackService } from "@/services/api/feedbackService";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import RichTextEditor from "@/components/atoms/RichTextEditor";
const SubmitModal = ({ isOpen, onClose }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    isAnonymous: false,
    authorName: "",
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    "UI/UX",
    "Features", 
    "Platform",
    "Data",
    "Notifications",
    "Moderation",
    "Accessibility",
    "Integrations",
    "User Management"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
// Check if description has actual text content (strip HTML tags)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formData.description;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    if (!textContent.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.isAnonymous && !formData.authorName.trim()) {
      newErrors.authorName = "Name is required for non-anonymous submissions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await feedbackService.create({
        ...formData,
        authorName: formData.isAnonymous ? "Anonymous" : formData.authorName.trim()
      });
      
      toast.success("Your feedback has been submitted successfully!");
      
      // Reset form
      setFormData({
title: "",
        description: "",
        category: "",
        isAnonymous: false,
        authorName: "",
        images: []
      });
      setErrors({});
      onClose();
      
      // Refresh the page to show new feedback
      window.location.reload();
      
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-purple-600/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Submit New Request</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Help us improve by sharing your ideas and feedback
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Title *
                  </label>
                  <Input
                    placeholder="Brief summary of your request..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    error={errors.title}
                  />
                  {errors.title && (
                    <p className="text-sm text-error">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
<div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Description *
                  </label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => handleInputChange("description", value)}
                    placeholder="Describe your request in detail. What problem does it solve? How would it work? Use the toolbar to format your text."
                    error={errors.description}
                  />
                  {errors.description && (
                    <p className="text-sm text-error">{errors.description}</p>
)}
                </div>

{/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Optional)
                  </label>
                  <ImageUpload
                    images={formData.images}
                    onChange={handleImagesChange}
                    maxImages={5}
                    maxSizeMB={5}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Category *
                  </label>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    error={errors.category}
                  >
                    <option value="">Select a category...</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-error">{errors.category}</p>
                  )}
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.isAnonymous}
                    onChange={(e) => handleInputChange("isAnonymous", e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary/50 focus:ring-2"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700 cursor-pointer">
                    Submit anonymously
                  </label>
                </div>

                {/* Author Name (if not anonymous) */}
                {!formData.isAnonymous && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Your Name *
                    </label>
                    <Input
                      placeholder="Enter your name..."
                      value={formData.authorName}
                      onChange={(e) => handleInputChange("authorName", e.target.value)}
                      error={errors.authorName}
                    />
                    {errors.authorName && (
                      <p className="text-sm text-error">{errors.authorName}</p>
                    )}
                  </div>
                )}

{/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    {isSubmitting ? (
                      <>
                        <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubmitModal;