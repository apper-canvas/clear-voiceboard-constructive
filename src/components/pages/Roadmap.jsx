import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import RoadmapColumn from "@/components/organisms/RoadmapColumn";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { roadmapService } from "@/services/api/roadmapService";

const Roadmap = () => {
  const [roadmapData, setRoadmapData] = useState({
    planned: [],
    "in-progress": [],
    completed: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await roadmapService.getAll();
      setRoadmapData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = Object.values(roadmapData).reduce((sum, items) => sum + items.length, 0);

  const columns = [
    {
      title: "Planned",
      items: roadmapData.planned,
      stage: "planned",
      color: "info",
      icon: "Calendar"
    },
    {
      title: "In Progress", 
      items: roadmapData["in-progress"],
      stage: "in-progress",
      color: "primary",
      icon: "Clock"
    },
    {
      title: "Completed",
      items: roadmapData.completed,
      stage: "completed", 
      color: "success",
      icon: "CheckCircle"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-info/20 to-blue-600/20 rounded-full blur-xl opacity-30"></div>
            <h1 className="relative text-4xl sm:text-5xl font-bold bg-gradient-to-r from-info to-blue-600 bg-clip-text text-transparent mb-4">
              Public Roadmap
            </h1>
          </motion.div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track the progress of community-requested features from idea to implementation
          </p>
        </div>

        {/* Stats */}
        {!loading && !error && totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-info/10 to-blue-600/10 rounded-lg">
                  <ApperIcon name="Calendar" className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{roadmapData.planned.length}</p>
                  <p className="text-sm text-gray-600">Planned</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg">
                  <ApperIcon name="Clock" className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{roadmapData["in-progress"].length}</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-success/10 to-green-600/10 rounded-lg">
                  <ApperIcon name="CheckCircle" className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{roadmapData.completed.length}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content */}
        {loading && <Loading type="roadmap" />}
        
        {error && (
          <Error 
            message={error} 
            onRetry={loadRoadmap} 
          />
        )}
        
        {!loading && !error && totalItems === 0 && (
          <Empty
            title="Roadmap Coming Soon"
            message="We're preparing our development roadmap. Check back soon to see what features we're planning to build!"
            actionText="View Feedback"
            onAction={() => window.location.href = "/"}
            icon="Map"
          />
        )}
        
        {!loading && !error && totalItems > 0 && (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {columns.map((column, index) => (
              <motion.div
                key={column.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RoadmapColumn {...column} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Footer Note */}
        {!loading && !error && totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <ApperIcon name="Info" className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">How It Works</h3>
              </div>
              <p className="text-gray-600">
                Items move through our roadmap based on community votes, technical feasibility, and strategic priorities. 
                Keep voting on features you want to see prioritized!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;