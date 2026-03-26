"use client";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

// Types
interface HistoryItem {
  id: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  thumbnailUrl?: string;
  aiDescription: string;
  aiFeedback: string;
  instructorFeedback?: string;
  createdAt: string;
  status: "pending" | "completed" | "reviewed";
  sport?: string;
  drill?: string;
}

type SortOption = "newest" | "oldest" | "status";

export default function HistoryPage() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [filteredData, setFilteredData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed" | "reviewed"
  >("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let result = [...data];

    if (filter !== "all") {
      result = result.filter((item) => item.status === filter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredData(result);
  }, [data, filter, sortBy]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/ai-coach-history");
      if (!response.ok) throw new Error("Failed to fetch history");
      const result = await response.json();
      setData(result.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: HistoryItem["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "reviewed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusText = (status: HistoryItem["status"]) => {
    switch (status) {
      case "pending":
        return "Processing";
      case "completed":
        return "AI Analyzed";
      case "reviewed":
        return "Instructor Reviewed";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Your History</h1>
              <p className="text-gray-400 mt-1">
                {data.length} {data.length === 1 ? "session" : "sessions"}{" "}
                recorded
              </p>
            </div>

            {/* Filters and Sort */}
            <div className="flex gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Sessions</option>
                <option value="pending">Processing</option>
                <option value="completed">AI Analyzed</option>
                <option value="reviewed">Instructor Reviewed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-700 text-6xl mb-4 font-light">∅</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No sessions found
            </h3>
            <p className="text-gray-400">
              {filter !== "all"
                ? `No ${filter} sessions available. Try changing the filter.`
                : "Start your first training session to see it here."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg cursor-pointer overflow-hidden"
                onClick={() => setSelectedItem(item)}
              >
                {/* Media Preview */}
                <div className="relative aspect-video bg-gray-800">
                  {item.mediaType === "image" ? (
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={`Session ${item.id}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.thumbnailUrl || item.mediaUrl}
                      className="w-full h-full object-cover"
                      poster={item.thumbnailUrl}
                    />
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  {item.mediaType === "video" && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      Video
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {item.sport && (
                      <span className="text-sm text-blue-400 font-medium">
                        {item.sport}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {item.drill && (
                    <p className="text-sm text-gray-400 mb-2">{item.drill}</p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-300">
                        AI Analysis:
                      </span>
                      <p className="text-gray-400 line-clamp-2">
                        {item.aiFeedback}
                      </p>
                    </div>

                    {item.instructorFeedback && (
                      <div>
                        <span className="font-medium text-emerald-400">
                          Instructor:
                        </span>
                        <p className="text-gray-400 line-clamp-1">
                          {item.instructorFeedback}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for detailed view */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-gray-900 rounded-xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Session Details</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Media */}
              {selectedItem.mediaType === "image" ? (
                <img
                  src={selectedItem.mediaUrl}
                  className="w-full rounded-lg"
                  alt="Session"
                />
              ) : (
                <video
                  src={selectedItem.mediaUrl}
                  controls
                  className="w-full rounded-lg"
                />
              )}

              {/* Metadata */}
              <div className="mt-4 flex gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    selectedItem.status
                  )}`}
                >
                  {getStatusText(selectedItem.status)}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(selectedItem.createdAt).toLocaleString()}
                </span>
              </div>

              {/* AI Feedback */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg text-white mb-2">
                  AI Feedback
                </h3>
                <p className="text-gray-300">{selectedItem.aiFeedback}</p>
              </div>

              {/* Instructor Feedback */}
              <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-lg text-white mb-2">
                  Instructor Feedback
                </h3>
                <p className="text-gray-300">
                  {selectedItem.instructorFeedback ||
                    "Waiting for instructor feedback..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
