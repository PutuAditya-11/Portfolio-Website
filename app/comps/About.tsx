export default function About() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
    },
    {
      title: "Backend", 
      skills: ["Python", "PHP"]
    },
    {
      title: "Database & Tools",
      skills: ["MongoDB", "PostgreSQL", "Git"]
    }
  ]

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
            About Me
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Personal Info */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Who I Am
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                I&apos;m a passionate full-stack developer with experience in creating 
                web applications using modern technologies. I love solving problems 
                and turning ideas into reality through code.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                When I&apos;m not coding, you can find me exploring new technologies, 
                reading tech blogs, or working on personal projects that challenge 
                my skills and creativity.
              </p>
              
              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Name:</h4>
                  <p className="text-gray-600 dark:text-gray-300">Putu Aditya Dharma Widhidarsana</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Location:</h4>
                  <p className="text-gray-600 dark:text-gray-300">Bali</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Email:</h4>
                  <p className="text-gray-600 dark:text-gray-300">adityadesirre2302@gmail.com</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Phone:</h4>
                  <p className="text-gray-600 dark:text-gray-300">+62 813-9987-4843</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Years Exp</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Skills & Technologies */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                Skills & Technologies
              </h3>
              
              <div className="space-y-6">
                {skillCategories.map((category) => (
                  <div key={category.title} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-3"></span>
                      {category.title}
                    </h4>
                    
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <span 
                          key={skill}
                          className="px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg 
                          border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 
                          hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Currently Learning
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-lg font-medium">
                    Machine Learning
                  </span>
                  <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-lg font-medium">
                    React Native
                  </span>
                  <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-lg font-medium">
                    Postgre SQL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}