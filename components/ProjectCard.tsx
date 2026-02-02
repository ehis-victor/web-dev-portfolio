import React from "react";
import { Project, ProjectStatus } from "../types";
import { analytics } from "../services/analytics";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { theme } = useTheme();
  const isCompleted = project.status === ProjectStatus.COMPLETED;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className={`group relative flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 ${theme === "dark"
          ? "bg-slate-800 border-slate-700 hover:border-slate-500"
          : "bg-stone-50 border-stone-200 hover:border-indigo-200 shadow-sm"
        }`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
        {project.imageUrl.endsWith(".gif") ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : project.imageUrl.match(/\.(mp4|webm|mov)$/i) ? (
          <video
            src={project.imageUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${isCompleted
                ? "bg-emerald-500/90 text-white backdrop-blur-sm"
                : "bg-amber-500/90 text-white backdrop-blur-sm"
              }`}
          >
            {project.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-4">
          <h3
            className={`text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            {project.title}
          </h3>
          <p
            className={`text-sm leading-relaxed line-clamp-3 ${theme === "dark" ? "text-slate-400" : "text-slate-700"
              }`}
          >
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className={`px-2 py-1 rounded text-xs border ${theme === "dark"
                  ? "bg-slate-700/50 text-slate-300 border-slate-600/50"
                  : "bg-slate-100 text-slate-700 border-slate-300"
                }`}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span
              className={`px-2 py-1 rounded text-xs border ${theme === "dark"
                  ? "bg-slate-700/50 text-slate-300 border-slate-600/50"
                  : "bg-slate-100 text-slate-700 border-slate-300"
                }`}
            >
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div
          className={`mt-auto flex gap-3 pt-4 border-t ${theme === "dark" ? "border-slate-700/50" : "border-slate-100"
            }`}
        >
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                analytics.trackExternalLink(
                  project.demoLink,
                  `project_demo_${project.id}`
                )
              }
              className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Live Demo
            </a>
          )}
          {project.repoLink && (
            <a
              href={project.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                analytics.trackExternalLink(
                  project.repoLink,
                  `project_repo_${project.id}`
                )
              }
              className={`flex-1 text-center border py-2 rounded-lg text-sm font-medium transition-colors ${theme === "dark"
                  ? "border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white"
                  : "border-slate-200 hover:border-slate-400 text-slate-600 hover:text-slate-900"
                } ${!project.demoLink ? "w-full" : ""}`}
            >
              Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
