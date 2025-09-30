const DatasetsPage = () => {
  const datasets = [
    {
      title: "Midnight Scan Club",
      description: "A high-quality, long-term fMRI dataset tracking individual brain functional connectivity.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEFbnsvNNyOYP9sf-sw4_6vUIouIPKbsBr-_wFg4RHZJO4cv5BPzVz3OFcCUkGcEtKGdfMTCscaudtI3FMH9Dc23p1mah-8PiEwVMIySCGdbHu1lJeEe3kxRtA5ITwb8vv_sQdHm800Y_fk7i8fTJa51RY_WlJAVoBqtuj3doc2lAoHAFmLnmnJfU_TUOBELvK9an-veojGAD1KESQ-RBdEkQmDIr7e3uK3ELmiyMAr6pqhxkxdA9phH8PCdr3GAfqtF3CpDzbHQ4",
      link: "#"
    },
    {
      title: "Human Connectome Project",
      description: "Maps neural pathways to understand the structural and functional connectivity of the human brain.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLYAw2JGh2gTbbcKQmi9BrVFYM7W2ed5szCOePE7dughf4K6BVOLHfHrDwzn48nWhl42xbA4XJ3gjOSQxG9B80eNeKshIoZo7O4YM2YzifyOvITydSL-lC480a2YBq0mlLVb8fc8pCcoST5u-wQsntr-5phaPiCaHtGdIzoGugm-W-ERDUGXVZTxTVhYzPgi-0uWyP1JutORRLOIutTkEPtzRfKAmVD14za4v0sCWz2dB-YsmG7rZKIQXk7DDMkHlzsZarZxz1Q8U",
      link: "#"
    },
    {
      title: "Alzheimer's Disease Neuroimaging Initiative",
      description: "Investigates biomarkers for the early detection and tracking of Alzheimer's disease.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4eIgjcKncznIf-S0_JdVMlLxrl8mmpUnmTQSje1SmRpQEZJt0YxZUTDuFcbEsACABUWXAk_7FalGVjOBqRj_Nb00XdDZLiPi2XRjC4YwfHrGZxxmVOecyq0GtN6ZdaVP59b4Rzz9wL7EAb9I0osKFOsVnWSMmWIurKoAxJjdotarK7e1rZqL4svS1laFFAY6zgbmoxcNuYHBa3k7Ta69GFbozu_G8uwftOafhOGCgoVemXL5aAr3CxigjwdyW7CTpRtPqHk1VVlg",
      link: "#"
    },
    {
      title: "Autism Brain Imaging Data Exchange",
      description: "A large-scale data sharing initiative for accelerating the understanding of autism spectrum disorder.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyUssXR0M4HUGmffyS_rDWAHf41CuQrE9A0W9pYxoTIQEExqpvu2B1fQ7ta_wGsYNlWoGia-9rLhuA_mqb8T-uWisZijNc2zpvC79DGB_NdpzFyxiHupKzaoWXSjjTV8O9CfsAL4rXhdaaH4t8RtszbECyx2e0luJQyVWhZQjndH23BBKUnej3RAepQAYbqtTglpOy30__uSXRlllCrZFi4kWBsn5pKE0Yc7z-V-AFO7N2Q_Ssw02Vuirui5evHl6QLSZdlA9Sb3M",
      link: "#"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 mt-6">
      <h2 className="mb-10 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Available Datasets
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {datasets.map((dataset, index) => (
          <div
            key={index}
            className="group flex flex-col overflow-hidden rounded-lg border border-gray-200/80 bg-white shadow-sm transition-all hover:shadow-lg dark:border-dark-border/80 dark:bg-dark-border/30 dark:hover:border-secondary-blue/50"
          >
            <div className="relative aspect-video">
              <img
                alt={`${dataset.title} thumbnail`}
                className="h-full w-full object-cover"
                src={dataset.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="font-bold">{dataset.title}</h3>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {dataset.description}
              </p>
              <a
                className="inline-flex items-center gap-1 text-sm font-medium text-secondary-blue hover:underline dark:text-light-blue"
                href={dataset.link}
              >
                View Original Source
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </a>
            </div>
          </div>
        ))}

        {/* Skeleton loaders for upcoming datasets */}
        <div className="group hidden animate-pulse flex-col overflow-hidden rounded-lg border border-gray-200/80 bg-white dark:border-dark-border/80 dark:bg-dark-border/30 sm:flex">
          <div className="aspect-video bg-gray-300 dark:bg-dark-border/50"></div>
          <div className="p-4">
            <div className="mb-3 h-4 w-3/4 rounded bg-gray-300 dark:bg-dark-border/50"></div>
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-dark-border/40"></div>
            <div className="mt-1 h-3 w-5/6 rounded bg-gray-200 dark:bg-dark-border/40"></div>
            <div className="mt-4 h-4 w-1/2 rounded bg-gray-300 dark:bg-dark-border/50"></div>
          </div>
        </div>
        <div className="group hidden animate-pulse flex-col overflow-hidden rounded-lg border border-gray-200/80 bg-white dark:border-dark-border/80 dark:bg-dark-border/30 sm:flex">
          <div className="aspect-video bg-gray-300 dark:bg-dark-border/50"></div>
          <div className="p-4">
            <div className="mb-3 h-4 w-3/4 rounded bg-gray-300 dark:bg-dark-border/50"></div>
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-dark-border/40"></div>
            <div className="mt-1 h-3 w-5/6 rounded bg-gray-200 dark:bg-dark-border/40"></div>
            <div className="mt-4 h-4 w-1/2 rounded bg-gray-300 dark:bg-dark-border/50"></div>
          </div>
        </div>
        <div className="group hidden animate-pulse flex-col overflow-hidden rounded-lg border border-gray-200/80 bg-white dark:border-dark-border/80 dark:bg-dark-border/30 lg:flex">
          <div className="aspect-video bg-gray-300 dark:bg-dark-border/50"></div>
          <div className="p-4">
            <div className="mb-3 h-4 w-3/4 rounded bg-gray-300 dark:bg-dark-border/50"></div>
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-dark-border/40"></div>
            <div className="mt-1 h-3 w-5/6 rounded bg-gray-200 dark:bg-dark-border/40"></div>
            <div className="mt-4 h-4 w-1/2 rounded bg-gray-300 dark:bg-dark-border/50"></div>
          </div>
        </div>
        <div className="group hidden animate-pulse flex-col overflow-hidden rounded-lg border border-gray-200/80 bg-white dark:border-dark-border/80 dark:bg-dark-border/30 xl:flex">
          <div className="aspect-video bg-gray-300 dark:bg-dark-border/50"></div>
          <div className="p-4">
            <div className="mb-3 h-4 w-3/4 rounded bg-gray-300 dark:bg-dark-border/50"></div>
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-dark-border/40"></div>
            <div className="mt-1 h-3 w-5/6 rounded bg-gray-200 dark:bg-dark-border/40"></div>
            <div className="mt-4 h-4 w-1/2 rounded bg-gray-300 dark:bg-dark-border/50"></div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <nav className="mt-12 flex items-center justify-center gap-2">
        <a
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-secondary-blue/30 dark:hover:text-light-blue"
          href="#"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </a>
        <a
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary-blue text-sm font-bold text-white"
          href="#"
        >
          1
        </a>
        <a
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-gray-600 hover:bg-primary-blue/10 hover:text-secondary-blue dark:text-gray-300 dark:hover:bg-secondary-blue/20 dark:hover:text-light-blue"
          href="#"
        >
          2
        </a>
        <a
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-gray-600 hover:bg-primary-blue/10 hover:text-secondary-blue dark:text-gray-300 dark:hover:bg-secondary-blue/20 dark:hover:text-light-blue"
          href="#"
        >
          3
        </a>
        <span className="text-gray-500 dark:text-gray-400">...</span>
        <a
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-gray-600 hover:bg-primary-blue/10 hover:text-secondary-blue dark:text-gray-300 dark:hover:bg-secondary-blue/20 dark:hover:text-light-blue"
          href="#"
        >
          10
        </a>
        <a
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-secondary-blue/30 dark:hover:text-light-blue"
          href="#"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </a>
      </nav>
    </div>
  );
};

export default DatasetsPage;