
import React from 'react';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-12 bg-[#1A1F2C]">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Marketing AI Tools</h3>
            <p className="text-gray-400">Discover AI-powered marketing solutions</p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Insights</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">AI Guides</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Our Mission</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Get in Touch</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">Connect</h4>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-gray-300 hover:text-white"><Twitter size={24} /></a></li>
              <li><a href="#" className="text-gray-300 hover:text-white"><Linkedin size={24} /></a></li>
              <li><a href="#" className="text-gray-300 hover:text-white"><Instagram size={24} /></a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">&copy; {new Date().getFullYear()} Marketing AI Tools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
