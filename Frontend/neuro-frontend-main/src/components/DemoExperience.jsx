import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const DemoExperience = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

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
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Interactive Data Visualization
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore the metadata through interactive charts. <span className="font-semibold text-primary-blue">Try hovering over the charts!</span>
              </p>
            </div>

            {/* Tooltip */}
            {showTooltip && (
              <div className="bg-primary-blue text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
                <span className="text-2xl">👆</span>
                <p className="text-sm font-medium">
                  Hover over the charts below to see detailed information!
                </p>
              </div>
            )}


            {/* Charts Grid - All Visible at Once */}
            <div className="grid md:grid-cols-3 gap-6">

              {/* Diagnosis Distribution */}
              <div
                onMouseEnter={handleChartInteraction}
                className="rounded-lg border border-gray-200/80 dark:border-dark-border/80 bg-white dark:bg-dark-border/30 p-6 hover:shadow-lg transition-all cursor-pointer"
              >
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  Diagnosis Distribution
                </h3>
                <p className="text-3xl font-bold text-primary-blue dark:text-light-blue mb-1">100</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Total Subjects</p>

                <div className="grid grid-flow-col gap-3 grid-rows-[1fr_auto] items-end justify-items-center min-h-[140px]">
                  <div className="bg-primary-blue/70 dark:bg-primary-blue/50 w-full rounded-t" style={{ height: "70%" }}></div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Healthy</p>

                  <div className="bg-secondary-blue/70 dark:bg-secondary-blue/50 w-full rounded-t" style={{ height: "50%" }}></div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">ADHD</p>

                  <div className="bg-light-blue/70 dark:bg-light-blue/30 w-full rounded-t" style={{ height: "85%" }}></div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Autism</p>
                </div>
              </div>

              {/* Sex Distribution */}
              <div
                onMouseEnter={handleChartInteraction}
                className="rounded-lg border border-gray-200/80 dark:border-dark-border/80 bg-white dark:bg-dark-border/30 p-6 hover:shadow-lg transition-all cursor-pointer"
              >
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  Sex Distribution
                </h3>
                <p className="text-3xl font-bold text-secondary-blue dark:text-primary-blue mb-1">100</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Total Subjects</p>

                <div className="grid grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center min-h-[140px]">
                  <div className="bg-primary-blue/70 dark:bg-primary-blue/50 w-full rounded-t" style={{ height: "92%" }}></div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Male (46%)</p>

                  <div className="bg-secondary-blue/70 dark:bg-secondary-blue/50 w-full rounded-t" style={{ height: "100%" }}></div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Female (54%)</p>
                </div>
              </div>

              {/* Age Distribution */}
              <div
                onMouseEnter={handleChartInteraction}
                className="rounded-lg border border-gray-200/80 dark:border-dark-border/80 bg-white dark:bg-dark-border/30 p-6 hover:shadow-lg transition-all cursor-pointer"
              >
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  Age Distribution
                </h3>
                <p className="text-3xl font-bold text-light-blue dark:text-light-blue mb-1">100</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Total Subjects</p>

                <div className="grid grid-flow-col gap-2 grid-rows-[1fr_auto] items-end justify-items-center min-h-[140px]">
                  <div className="bg-primary-blue/70 dark:bg-primary-blue/50 w-full rounded-t" style={{ height: "40%" }}></div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">18-25</p>

                  <div className="bg-secondary-blue/70 dark:bg-secondary-blue/50 w-full rounded-t" style={{ height: "100%" }}></div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">26-35</p>

                  <div className="bg-light-blue/70 dark:bg-light-blue/30 w-full rounded-t" style={{ height: "65%" }}></div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">36-45</p>

                  <div className="bg-primary-blue/50 dark:bg-primary-blue/30 w-full rounded-t" style={{ height: "30%" }}></div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">46+</p>
                </div>
              </div>
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