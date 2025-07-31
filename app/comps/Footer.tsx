export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="mb-4">
            © {new Date().getFullYear()} Aditya Dharma. All rights reserved.
          </p>
          <p className="text-gray-400">
            Built with Next.js and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}