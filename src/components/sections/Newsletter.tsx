
import { GradientButton } from "@/components/ui/gradient-button";
import { Mail } from "lucide-react";

export const Newsletter = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl px-6 mx-auto text-center">
        <Mail className="w-12 h-12 mx-auto mb-6 text-purple-600" />
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#1A1F2C] sm:text-4xl">
          Stay Updated with the Latest AI Tools
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Get weekly insights on new AI marketing tools and best practices
        </p>
        <form className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 text-gray-900 border rounded-lg sm:w-96 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
          <GradientButton type="submit" className="w-full sm:w-auto">
            Subscribe
          </GradientButton>
        </form>
      </div>
    </section>
  );
};
