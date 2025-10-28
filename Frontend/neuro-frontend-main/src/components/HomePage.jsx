import { Link, useNavigate } from "react-router-dom";
import BrainCanvas from './BrainCanvas';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="relative py-20 sm:py-28 lg:py-32">
        <div className="absolute inset-0 opacity-10 dark:opacity-20 brain-animation" style={{backgroundImage: 'linear-gradient(-45deg, #00f0ff, #0a0a0f, #0f171f, #4d5b70)'}}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight text-foreground-light dark:text-foreground-dark">
                Simplifying Complex Neuroscience Data
              </h1>
              <p className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl mx-auto lg:mx-0">
                Explore, visualize, and interact with cutting-edge neuroscience data. NeuroVerse provides tools for researchers, educators, and enthusiasts to unlock insights from complex datasets.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  to="/demo"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                  className="inline-block px-8 py-3 text-base font-bold rounded-lg bg-primary text-background-light hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg shadow-primary/50"
                >
                  Explore Sample Data
                </Link>
                {/* Remove or comment out the upload button section */}
                {/* 
                <a className="inline-block px-8 py-3 text-base font-bold rounded-lg bg-subtle-light/20 hover:bg-subtle-light/30 text-foreground-light dark:text-foreground-dark transition-transform transform hover:scale-105" href="#">Upload Your Data</a>
                */}
              </div>
            </div>
            <BrainCanvas />
          </div>
        </div>
      </section>
      <section className="bg-background-light dark:bg-background-dark py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Key Features</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Our platform offers a suite of features designed to transform how you interact with neuroscience data.</p>
          </div>
          {/* Key Features */}
          <div className="grid gap-8 px-4 py-10 sm:px-10 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <div className="bg-primary dark:bg-dark-border flex aspect-video w-full flex-col items-center justify-center rounded-xl">
                <svg
                  className="h-16 w-16 text-background-light dark:text-gray-800"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 13h2v7H3v-7zm4-4h2v11H7V9zm4-4h2v15h-2V5zm4 3h2v12h-2V8zm4-3h2v15h-2V5z"/>
                </svg>
              </div>
              <div>
                <p className="text-base font-medium leading-normal text-gray-900 dark:text-white">
                  Real Demographic Data
                </p>
                <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-400">
                  Visualize actual participant demographics from 23 verified OpenNeuro datasets - age, sex, and diagnosis distributions parsed directly from participants.tsv files.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-primary dark:bg-dark-border flex aspect-video w-full flex-col items-center justify-center rounded-xl">
                <svg
                  className="h-16 w-16 text-background-light dark:text-gray-800"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-3.86-.97-7-5.12-7-9.5V8.3l7-3.89 7 3.89V11c0 4.38-3.14 8.53-7 9.5zm-1-6.5h2v2h-2v-2zm0-8h2v6h-2V6z"/>
                </svg>
              </div>
              <div>
                <p className="text-base font-medium leading-normal text-gray-900 dark:text-white">
                  Interactive 3D Charts
                </p>
                <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-400">
                  Explore data through interactive 3D bar charts and donut charts powered by Plotly.js - rotate, zoom, and hover to see detailed statistics.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-primary dark:bg-dark-border flex aspect-video w-full flex-col items-center justify-center rounded-xl">
                <svg
                  className="h-16 w-16 text-background-light dark:text-gray-800"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                </svg>
              </div>
              <div>
                <p className="text-base font-medium leading-normal text-gray-900 dark:text-white">
                  Clinical Study Insights
                </p>
                <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-400">
                  Filter datasets by clinical populations (ADHD, Depression, Schizophrenia, Autism) and quickly compare participant demographics across studies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <div className="flex justify-center mb-16">
        <button
          onClick={() => navigate('/datasets')}
          className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#93c5fd] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#60a5fa] transition-colors"
        >
          <span className="truncate">Explore Datasets</span>
        </button>
      </div>
    </>
  );
};

export default HomePage;