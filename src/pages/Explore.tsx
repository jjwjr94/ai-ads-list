
import { Features } from "@/components/sections/Features";

const Explore = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-16">
          Explore AI Tools by <span className="text-[#9b87f5]">Category</span>
        </h1>
        <Features />
      </div>
    </div>
  );
};

export default Explore;
