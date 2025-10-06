import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import BarChart3D from "./charts/BarChart3D";
import DonutChart from "./charts/DonutChart";

const DemoExperience = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeView, setActiveView] = useState('bar'); // 'bar' or 'donut'
  const [activeCategory, setActiveCategory] = useState(null);

  // Featured dataset for demo
  const featuredDataset = {
    id: "midnight-scan-club",
    title: "Midnight Scan Club",
    description: "A high-quality, long-term fMRI dataset tracking individual brain functional connectivity over multiple sessions.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEFbnsvNNyOYP9sf-sw4_6vUIouIPKbsBr-_wFg4RHZJO4cv5BPzVz3OFcCUkGcEtKGdfMTCscaudtI3FMH9Dc23p1mah-8PiEwVMIySCGdbHu1lJeEe3kxRtA5ITwb8vv_sQdHm800Y_fk7i8fTJa51RY_WlJAVoBqtuj3doc2lAoHAFmLnmnJfU_TUOBELvK9an-veojGAD1KESQ-RBdEkQmDIr7e3uK3ELmiyMAr6pqhxkxdA9phH8PCdr3GAfqtF3CpDzbHQ4",
    participants: 10,
    tasks: 8,
    modality: "fMRI",
    sessions: "12+ sessions per participant"
  };

  // Sample diagnosis data for charts
  const diagnosisData = [
    { name: "Autism", count: 85, percentage: 41.5, color: "bg-blue-500" },
    { name: "ADHD", count: 50, percentage: 24.4, color: "bg-red-500" },
    { name: "Healthy", count: 70, percentage: 34.1, color: "bg-green-500" }
  ];

  const totalSubjects = 205;

  // Hide tooltip after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleChartInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowTooltip(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
  };

  return (
    <div className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-primary-blue transition-colors">Home</Link>
          <span>→</span>
          <span className="text-gray-900 dark:text-white font-medium">Demo Experience</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[360px_1fr] gap-8">

          {/* Left Panel - Enhanced Dataset Summary */}
          <div className="space-y-6">
            {/* Dataset Image */}
            <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
              <img
                src={featuredDataset.image}
                alt={featuredDataset.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-primary-blue text-white px-3 py-1 rounded-full text-xs font-bold">
                Featured Demo
              </div>
            </div>

            {/* Dataset Info Card */}
            <div className="rounded-lg border border-gray-200/80 dark:border-dark-border/80 bg-white dark:bg-dark-border/30 p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {featuredDataset.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {featuredDataset.description}
                </p>
              </div>

              {/* Stats Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary-blue/10 dark:bg-primary-blue/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-primary-blue dark:text-light-blue">
                    {featuredDataset.participants}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Participants</div>
                </div>
                <div className="bg-secondary-blue/10 dark:bg-secondary-blue/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-secondary-blue dark:text-primary-blue">
                    {featuredDataset.tasks}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Tasks</div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-dark-border">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Modality</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{featuredDataset.modality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sessions</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{featuredDataset.sessions}</span>
                </div>
              </div>

              {/* Why This Dataset */}
              <div className="bg-light-blue/10 dark:bg-light-blue/5 rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                  💡 Why this dataset?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Perfect example of longitudinal neuroimaging data with diverse metrics and comprehensive metadata coverage.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Visualizations */}
          <div className="space-y-6">
            {/* Header with View Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Diagnosis Distribution
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Explore diagnosis data through interactive charts. <span className="font-semibold text-primary-blue">Try hovering and clicking!</span>
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-3 bg-dark-border/30 dark:bg-dark-border/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('bar')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                    activeView === 'bar'
                      ? 'bg-primary-blue text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-blue'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  3D Bar Chart
                </button>
                <button
                  onClick={() => setActiveView('donut')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                    activeView === 'donut'
                      ? 'bg-primary-blue text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-blue'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  Donut Chart
                </button>
              </div>
            </div>


            {/* Interactive Chart */}
            <div
              className="rounded-lg border-2 border-gray-200/80 dark:border-dark-border/80 bg-white dark:bg-dark-border/30 overflow-hidden"
              onMouseEnter={handleChartInteraction}
              style={{ height: '600px' }}
            >
              {activeView === 'bar' ? (
                <BarChart3D
                  data={diagnosisData}
                  totalSubjects={totalSubjects}
                  activeCategory={activeCategory}
                  onBarClick={handleCategoryClick}
                />
              ) : (
                <DonutChart
                  data={diagnosisData}
                  totalSubjects={totalSubjects}
                  activeCategory={activeCategory}
                  onSegmentClick={handleCategoryClick}
                />
              )}
            </div>

            {/* Educational Callouts */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-primary-blue/5 dark:bg-primary-blue/10 rounded-lg p-4 border-l-4 border-primary-blue">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Diagnosis Insights</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Compare healthy subjects vs. clinical populations
                </p>
              </div>
              <div className="bg-secondary-blue/5 dark:bg-secondary-blue/10 rounded-lg p-4 border-l-4 border-secondary-blue">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Gender Balance</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Understand participant demographics at a glance
                </p>
              </div>
              <div className="bg-light-blue/5 dark:bg-light-blue/10 rounded-lg p-4 border-l-4 border-light-blue">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Age Groups</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Identify age-related patterns in the data
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary-blue/10 to-secondary-blue/10 dark:from-primary-blue/20 dark:to-secondary-blue/20 rounded-lg p-8 text-center mt-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Want to explore more?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                This is just one dataset! Browse our full catalog of neuroscience datasets or dive deeper into this data with the full dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/datasets"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-bold rounded-lg bg-primary-blue text-white hover:bg-secondary-blue transition-all shadow-lg hover:scale-105"
                >
                  Browse All Datasets →
                </Link>
                <Link
                  to="/datasets/midnight-scan-club/visualize"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-bold rounded-lg border-2 border-primary-blue text-primary-blue dark:text-light-blue hover:bg-primary-blue hover:text-white transition-all"
                >
                  View Full Dashboard For This Study
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoExperience;