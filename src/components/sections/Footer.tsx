
export const Footer = () => {
  return (
    <footer className="py-12 bg-[#1A1F2C]">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">AI Ads List</h3>
            <p className="text-gray-400">Find the best AI tools for your marketing needs</p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Guides</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">Follow Us</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Twitter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">LinkedIn</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">&copy; {new Date().getFullYear()} AI Ads List. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
