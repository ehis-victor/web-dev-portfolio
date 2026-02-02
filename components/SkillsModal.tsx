import React, { useEffect } from "react";
import { SKILLS, CERTIFICATIONS } from "../constants";
import { analytics } from "../services/analytics";
import { useTheme } from "../context/ThemeContext";

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SkillsModal: React.FC<SkillsModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      analytics.trackModalOpen("skills");
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Categorize skills for better display
  const skillCategories = {
    "Web Technologies": SKILLS.filter((s) =>
      ["Python", "CSS3", "HTML5", "Typescript", "PHP", "JavaScript (ES6+)", "Nextjs", "React"].some(
        (k) => s.includes(k)
      )
    ),
    "Programming & ML": SKILLS.filter((s) =>
      ["Python", "SQL", "Machine Learning", "R", "Statistics"].some((k) =>
        s.includes(k)
      )
    ),
    Other: SKILLS.filter(
      (s) =>
        ![
          "Excel",
          "PowerBI",
          "Data Visualization",
          "Pandas",
          "Python",
          "SQL",
          "Machine Learning",
          "R",
          "Statistics",
        ].some((k) => s.includes(k))
    ),
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-md transition-colors duration-300 ${theme === "dark" ? "bg-slate-900/90" : "bg-stone-100/70"
        }`}
      onClick={onClose}
    >
      <div
        className={`border w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-zoom-in relative transition-colors duration-300 ${theme === "dark"
          ? "bg-slate-900 border-slate-700"
          : "bg-stone-50 border-stone-200"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${theme === "dark"
            ? "text-slate-400 hover:text-white hover:bg-slate-800"
            : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            }`}
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="overflow-y-auto p-8 sm:p-12">
          <h2
            className={`text-3xl font-bold mb-8 text-center ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Technical Expertise
          </h2>

          {/* Detailed Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div
              className={`p-6 rounded-xl border transition-colors ${theme === "dark"
                ? "bg-slate-800/50 border-slate-700"
                : "bg-slate-50 border-slate-100"
                }`}
            >
              <h3 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Web Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillCategories["Web Technologies"].map((s) => (
                  <span
                    key={s}
                    className={`px-3 py-1 rounded-lg text-sm border transition-colors ${theme === "dark"
                      ? "bg-slate-700 text-slate-200 border-slate-600"
                      : "bg-white text-slate-700 border-slate-300"
                      }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={`p-6 rounded-xl border transition-colors ${theme === "dark"
                ? "bg-slate-800/50 border-slate-700"
                : "bg-slate-50 border-slate-100"
                }`}
            >
              <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m18 16 4-4-4-4"></path>
                  <path d="m6 8-4 4 4 4"></path>
                  <path d="m14.5 4-5 16"></path>
                </svg>
                Programming & ML
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillCategories["Programming & ML"].map((s) => (
                  <span
                    key={s}
                    className={`px-3 py-1 rounded-lg text-sm border transition-colors ${theme === "dark"
                      ? "bg-slate-700 text-slate-200 border-slate-600"
                      : "bg-white text-slate-700 border-slate-300"
                      }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <h2
            className={`text-3xl font-bold mb-8 text-center border-t pt-8 transition-colors ${theme === "dark"
              ? "text-white border-slate-800"
              : "text-slate-900 border-stone-200"
              }`}
          >
            Certifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className={`p-6 rounded-xl border transition-all flex flex-col h-full ${theme === "dark"
                  ? "bg-slate-800 border-slate-700 hover:border-indigo-500"
                  : "bg-stone-100 border-stone-200 hover:border-indigo-300 shadow-sm"
                  }`}
              >
                <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
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
                    <path d="M12 15l-2 5l9-9l-9 9l2-5"></path>
                  </svg>
                </div>
                <h3
                  className={`text-lg font-semibold mb-1 ${theme === "dark" ? "text-white" : "text-slate-900"
                    }`}
                >
                  {cert.name}
                </h3>
                <p className="text-indigo-400 text-sm mb-4">{cert.issuer}</p>
                <div
                  className={`mt-auto flex justify-between items-center text-xs transition-colors ${theme === "dark" ? "text-slate-500" : "text-slate-500"
                    }`}
                >
                  <span>Issued: {cert.date}</span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      className="text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      Verify{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsModal;
