export default function LoadingState() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <div className="text-gray-500 text-sm">Loading ideas...</div>
      
      {/* Loading card skeletons */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            
            {/* Description skeleton */}
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
            </div>
            
            {/* Meta info skeleton */}
            <div className="mt-4 flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
            
            {/* Buttons skeleton */}
            <div className="mt-4 flex space-x-3">
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}