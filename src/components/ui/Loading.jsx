const Loading = ({ type = "cards" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-8 bg-gray-200 rounded-full ml-4"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                <div className="h-5 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "roadmap") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            {[...Array(3)].map((_, j) => (
              <div key={j} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;