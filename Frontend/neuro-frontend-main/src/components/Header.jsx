const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-pakistan-green/50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl text-hunter-green dark:text-aquamarine"> grain </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              NeuroVerse
            </h1>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary" href="#">Home</a>
            <a className="text-sm font-bold text-hunter-green dark:text-aquamarine" href="#">Datasets</a>
            <a className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary" href="#">Visualizations</a>
            <a className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary" href="#">Community</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input className="w-48 rounded-lg border-gray-300 bg-gray-100 py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary dark:border-pakistan-green dark:bg-pakistan-green/50 dark:text-white lg:w-64" placeholder="Search datasets..." type="text"/>
          </div>
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-primary dark:text-gray-400 dark:hover:bg-hunter-green/30 dark:hover:text-aquamarine">
            <span className="material-symbols-outlined"> help </span>
          </button>
          <button className="h-9 w-9 overflow-hidden rounded-full border-2 border-aquamarine/50">
            <img alt="User avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-uzuTM8goJfBrrdNDybirI2EVN86zf3KmZwCJou_WArwq2uH-NUgyaqGdD1KnnixtX55nu24syk3ojbYUhoUWeEfos6oJ1n0qNGkp7MnWBMc-HxjRodfGeZNGcNP8O1tPxVNkvgx2NNMe2vtmKYUYCXTYJl21SvqPmUAJJu27XVURVJ50J40uzgUOm4hMpdh7-PP4I1gnhp4oVety7eu5F5R-pqGVZ9UkSpwW56TR4lfN3KOZV6hUaMndM444HJXuowBpCW_HvsU"/>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
