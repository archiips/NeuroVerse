import { useState } from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const subject = encodeURIComponent(`NeuroVerse Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      
      window.location.href = `mailto:architjaiswal18@gmail.com?subject=${subject}&body=${body}`;
      
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="border-b border-gray-200/50 dark:border-dark-border px-4 sm:px-10 py-4 bg-background-light dark:bg-[#0D0D0D]">
        <div className="max-w-[960px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">NeuroVerse</h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-8">
            <button
              onClick={() => navigate('/datasets')}
              className="hidden sm:block text-gray-900 dark:text-white text-sm font-medium hover:text-primary-blue transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 bg-primary-blue text-white text-sm font-bold rounded-lg hover:bg-secondary-blue transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[960px] mx-auto px-4 sm:px-10 py-8">
        
        {/* Our Mission */}
        <section className="mb-8">
          <h2 className="text-gray-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-[#92adc9] text-base md:text-lg font-normal leading-normal max-w-2xl">
            NeuroVerse makes neuroscience data exploration accessible through interactive visualizations of real participant demographics 
            from OpenNeuro datasets. We help researchers quickly understand and compare study populations.
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="text-gray-900 dark:text-white text-[32px] font-bold leading-tight mb-2">Key Features</h2>
            <p className="text-gray-600 dark:text-[#92adc9] text-base font-normal leading-normal max-w-[720px]">
              Explore real demographic data from verified OpenNeuro datasets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-[#233648] bg-white dark:bg-[#192633]/50 p-6 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#233648] hover:scale-105">
              <svg className="w-8 h-8 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight mb-2">Real Data Visualizations</h3>
                <p className="text-gray-600 dark:text-[#92adc9] text-sm font-normal leading-normal">
                  Interactive 3D charts displaying actual participant demographics parsed from OpenNeuro participants.tsv files.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-[#233648] bg-white dark:bg-[#192633]/50 p-6 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#233648] hover:scale-105">
              <svg className="w-8 h-8 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight mb-2">Verified Datasets</h3>
                <p className="text-gray-600 dark:text-[#92adc9] text-sm font-normal leading-normal">
                  23 curated OpenNeuro datasets with complete age, sex, and diagnosis data for all participants.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-[#233648] bg-white dark:bg-[#192633]/50 p-6 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#233648] hover:scale-105">
              <svg className="w-8 h-8 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div>
                <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight mb-2">Smart Filtering</h3>
                <p className="text-gray-600 dark:text-[#92adc9] text-sm font-normal leading-normal">
                  Filter by clinical populations, cognitive tasks, and imaging modalities to find relevant studies quickly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="text-gray-900 dark:text-white text-[32px] font-bold leading-tight mb-2">Technology Stack</h2>
            <p className="text-gray-600 dark:text-[#92adc9] text-base font-normal leading-normal max-w-[720px]">
              Built with modern technologies for fast, reliable data exploration.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                name: "React", 
                desc: "Dynamic and responsive user interface with React 18 and React Router.", 
                color: "from-cyan-500 to-blue-500",
              },
              { 
                name: "Plotly.js", 
                desc: "Interactive 3D bar charts and donut charts for data visualization.", 
                color: "from-purple-500 to-pink-500",
              },
              { 
                name: "FastAPI", 
                desc: "High-performance Python backend for OpenNeuro data fetching.", 
                color: "from-green-500 to-emerald-500",
              },
              { 
                name: "SQLite", 
                desc: "Lightweight database auto-populated with 23 verified datasets on deploy.", 
                color: "from-blue-600 to-indigo-600",
              }
            ].map((tech, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className={`w-full aspect-video bg-gradient-to-br ${tech.color} rounded-xl flex items-center justify-center`}>
                  <span className="text-white text-3xl font-bold">{tech.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal mb-1">{tech.name}</p>
                  <p className="text-gray-600 dark:text-[#92adc9] text-sm font-normal leading-normal">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Me */}
        <section className="mb-8">
          <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">About Me</h2>
          <div className="bg-white dark:bg-[#192633]/50 rounded-xl p-6 border border-gray-200 dark:border-[#233648] transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#233648]">
            <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-2">Archit Jaiswal</h3>
            <p className="text-primary-blue font-medium mb-3">Creator & Developer</p>
            <p className="text-gray-600 dark:text-[#92adc9] leading-relaxed mb-4">
              Built NeuroVerse to make exploring neuroscience datasets easier and more visual. 
              All demographic data is real, sourced directly from OpenNeuro's participants.tsv files.
            </p>
            <a 
              href="mailto:architjaiswal18@gmail.com" 
              className="inline-flex items-center gap-2 text-primary-blue hover:text-secondary-blue transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">architjaiswal18@gmail.com</span>
            </a>
          </div>
        </section>

        {/* Acknowledgments */}
        <section className="mb-8">
          <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Acknowledgments</h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#192633]/50 rounded-xl p-6 border border-gray-200 dark:border-[#233648] transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#233648] hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <svg className="w-8 h-8 text-primary-blue flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-2">OpenNeuro</h3>
                  <p className="text-gray-600 dark:text-[#92adc9] text-sm leading-relaxed mb-3">
                    All data displayed in NeuroVerse comes from OpenNeuro, a free and open platform for sharing 
                    BIDS-compliant neuroimaging data. Every demographic visualization is parsed from real participants.tsv files.
                  </p>
                  <a 
                    href="https://openneuro.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-blue hover:text-secondary-blue transition-colors text-sm font-medium"
                  >
                    Visit OpenNeuro
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#192633]/50 rounded-xl p-6 border border-gray-200 dark:border-[#233648] transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#233648] hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <svg className="w-8 h-8 text-primary-blue flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div>
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-2">Plotly.js</h3>
                  <p className="text-gray-600 dark:text-[#92adc9] text-sm leading-relaxed">
                    Powerful visualization library enabling interactive 3D charts and data exploration in the browser.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#192633]/50 rounded-xl p-6 border border-gray-200 dark:border-[#233648] transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#233648] hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <svg className="w-8 h-8 text-primary-blue flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div>
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-2">Neuroscience Community</h3>
                  <p className="text-gray-600 dark:text-[#92adc9] text-sm leading-relaxed">
                    Thanks to all researchers who share their data openly, making projects like NeuroVerse possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Contact Me</h2>
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-2">Get in Touch</h3>
              <p className="text-gray-600 dark:text-[#92adc9] text-sm">
                Questions or feedback? Fill out the form below and I'll respond as soon as possible.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-[#233648] bg-white dark:bg-[#192633]/50 p-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#92adc9] focus:border-primary-blue focus:ring-1 focus:ring-primary-blue focus:outline-none transition-colors"
                  placeholder="Your Name"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-[#233648] bg-white dark:bg-[#192633]/50 p-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#92adc9] focus:border-primary-blue focus:ring-1 focus:ring-primary-blue focus:outline-none transition-colors"
                  placeholder="Your Email"
                />
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full rounded-lg border border-gray-300 dark:border-[#233648] bg-white dark:bg-[#192633]/50 p-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#92adc9] focus:border-primary-blue focus:ring-1 focus:ring-primary-blue focus:outline-none resize-none transition-colors"
                placeholder="Your Message"
              />

              {submitStatus === "success" && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-300">
                  Your email client should open with the message. If not, please email me directly at architjaiswal18@gmail.com
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-300">
                  Something went wrong. Please email me directly at architjaiswal18@gmail.com
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-blue text-white font-bold py-3 rounded-lg hover:bg-secondary-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-[#233648] py-6 mt-8">
        <div className="max-w-[960px] mx-auto px-4 sm:px-10">
          <p className="text-center text-gray-600 dark:text-[#92adc9] text-sm">
            © {new Date().getFullYear()} NeuroVerse by Archit Jaiswal. Built with data from OpenNeuro.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
