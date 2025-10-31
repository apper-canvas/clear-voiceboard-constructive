import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}) => {
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

  const statuses = [
    { value: "under-review", label: "Under Review" },
    { value: "planned", label: "Planned" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" }
  ];

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleStatusChange = (status) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      statuses: [],
      search: ""
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.statuses.length > 0;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
<motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ 
          x: isOpen ? 0 : -300, 
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-20 bottom-0 w-80 bg-white/95 backdrop-blur-lg shadow-xl border-r border-gray-100 z-40 lg:relative lg:top-0 lg:translate-x-0 lg:opacity-100 lg:shadow-none lg:w-64"
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="rounded border-gray-300 text-primary focus:ring-primary/50 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Status</h4>
            <div className="space-y-2">
              {statuses.map((status) => (
                <label
                  key={status.value}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.statuses.includes(status.value)}
                    onChange={() => handleStatusChange(status.value)}
                    className="rounded border-gray-300 text-primary focus:ring-primary/50 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    {status.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FilterSidebar;