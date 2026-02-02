import React, { useState, useEffect } from "react";
import { Testimonial } from "../types";
import { useTheme } from "../context/ThemeContext";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
}) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play carousel continuously every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative w-full">
      {/* Main Testimonial Card */}
      <div
        className={`relative border rounded-2xl p-8 md:p-12 min-h-[300px] flex flex-col justify-between animate-fade-in transition-colors duration-300 ${theme === "dark"
            ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-xl shadow-slate-950/20"
            : "bg-stone-50 border-stone-200 shadow-md shadow-stone-200/50"
          }`}
      >
        {/* Quote Icon */}
        <div className="text-5xl text-indigo-400/30 mb-4">"</div>

        {/* Testimonial Text */}
        <p
          className={`text-lg mb-8 leading-relaxed ${theme === "dark" ? "text-slate-100" : "text-slate-700"
            }`}
        >
          {currentTestimonial.text}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
            {currentTestimonial.name.charAt(0)}
          </div>
          <div>
            <h4
              className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              {currentTestimonial.name}
            </h4>
            <p
              className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-700"
                }`}
            >
              {currentTestimonial.role} at {currentTestimonial.company}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-16 p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors hover:scale-110"
        aria-label="Previous testimonial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-16 p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors hover:scale-110"
        aria-label="Next testimonial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                ? "bg-indigo-600 w-8"
                : theme === "dark"
                  ? "bg-slate-600 hover:bg-slate-500"
                  : "bg-stone-300 hover:bg-stone-400"
              }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
