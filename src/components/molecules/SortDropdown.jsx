import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SortDropdown = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: "trending", label: "Trending" },
    { value: "votes", label: "Most Voted" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" }
  ];

  const selectedOption = sortOptions.find(option => option.value === value) || sortOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
      >
        <span>Sort by: {selectedOption.label}</span>
        <ApperIcon 
          name="ChevronDown" 
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 py-2 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-lg shadow-xl z-50"
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors duration-150",
                  value === option.value
                    ? "bg-primary/5 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;