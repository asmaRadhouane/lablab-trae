"use client";

export default function AnalyticsDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="mt-2 text-gray-600">
          Track your saved business ideas and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Saved</p>
              <p className="text-2xl font-bold text-blue-900">2</p>
            </div>
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-900">89%</p>
            </div>
            <div className="p-2 bg-green-500 rounded-lg text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg. Upvotes</p>
              <p className="text-2xl font-bold text-purple-900">10</p>
            </div>
            <div className="p-2 bg-purple-500 rounded-lg text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Engagement</p>
              <p className="text-2xl font-bold text-yellow-900">92%</p>
            </div>
            <div className="p-2 bg-yellow-500 rounded-lg text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">Category Distribution</h3>
          <div className="space-y-4">
            {[
              { name: "Technology", value: 35, color: "bg-blue-500" },
              { name: "E-commerce", value: 28, color: "bg-green-500" },
              { name: "Health & Wellness", value: 20, color: "bg-purple-500" },
              { name: "Education", value: 12, color: "bg-yellow-500" },
              { name: "Finance", value: 5, color: "bg-red-500" },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 ${item.color} rounded-full mr-2`}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Subreddits */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">Top Subreddits</h3>
          <div className="space-y-6">
            {[
              { name: "startups", count: 245, trend: "+12%", status: "up" },
              { name: "smallbusiness", count: 189, trend: "+8%", status: "up" },
              { name: "entrepreneur", count: 156, trend: "-3%", status: "down" },
              { name: "SideProject", count: 132, trend: "+5%", status: "up" },
            ].map((item, index) => (
              <div key={item.name} className="flex items-center space-x-4">
                <div
                  className={`flex-none w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0
                      ? "bg-blue-100 text-blue-600"
                      : index === 1
                      ? "bg-gray-100 text-gray-600"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium">r/{item.name}</span>
                    <span
                      className={`ml-2 text-sm ${
                        item.status === "up"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {item.trend}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.count} ideas
                  </div>
                </div>
                <div className="w-24 h-8">
                  {/* Activity Graph Placeholder */}
                  <div className="w-full h-full bg-gray-50 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}