'use client'

const projects = [
  {
    id: 1,
    title: "E-Commerce Website",
    description: "A full-stack e-commerce platform built with PHP, featuring product catalog, shopping cart, and payment integration.",
    image: "/images/projects/e-commerce-website.jpg",
    technologies: ["PHP", "Blade", "Javascript", "HTML","CSS"],
    liveUrl: "http://miratara.site/",
    githubUrl: "https://github.com/Andika12505/Miratara"
  },
  {
    id: 2,
    title: "Stock Management App", 
    description: "A simple collaborative stock management application.",
    image: "/images/projects/task-manager-preview.png",
    technologies: ["Python", "MongoDB"],
    liveUrl: "https://taskmanager-demo.netlify.app",
    githubUrl: "https://github.com/PutuAditya-11/CollegeRep"
  },
  
]

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
            My Projects
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group hover:-translate-y-2"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <a 
                      href={project.liveUrl}
                      className="flex-1 bg-blue-600 dark:bg-blue-500 text-white text-center py-2.5 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo
                    </a>
                    <a 
                      href={project.githubUrl}
                      className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-center py-2.5 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}