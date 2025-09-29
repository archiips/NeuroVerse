const Footer = () => {
  return (
    <footer className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary" href="#">Terms of Service</a>
            <a className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary" href="#">Privacy Policy</a>
            <a className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary" href="#">Contact Us</a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 NeuroVis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;