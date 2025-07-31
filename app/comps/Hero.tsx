import Image from 'next/image'

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container ml-20 mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Hi, I'm <span className="text-blue-600 dark:text-blue-400">Putu Aditya Dharma Widhidarsana</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
              Full Stack Enthusiast
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg">
              I create beautiful and functional web applications using modern technologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a 
                href="#projects"
                className="bg-blue-600 dark:bg-blue-800 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-center"
              >
                View My Work
              </a>
              <a 
                href="/My-CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-8 py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-colors text-center"
              >
                Download CV
              </a>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-blue-200 dark:border-blue-800 shadow-xl">
                <Image
                  src="/images/profile.png"
                  alt="Photo"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-indigo-500 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}