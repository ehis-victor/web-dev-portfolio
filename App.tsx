import React, { useState, useMemo, useEffect } from "react";
import {
  PROJECTS as INITIAL_PROJECTS,
  MY_NAME,
  MY_ROLE,
  MY_BIO,
  SKILLS,
  CERTIFICATIONS,
  TESTIMONIALS,
  CONTACT_EMAIL,
  LINKEDIN_URL,
  GITHUB_URL,
  PROFILE_IMAGE_URL,
  WHATSAPP_URL,
} from "./constants";
import { Project, ProjectStatus } from "./types";
import { useTheme } from "./context/ThemeContext";
import { analytics } from "./services/analytics";
import ProjectCard from "./components/ProjectCard";
import ChatWidget from "./components/ChatWidget";
import AddProjectModal from "./components/AddProjectModal";
import SkillsModal from "./components/SkillsModal";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import { motion, AnimatePresence } from "framer-motion";
import BackToTop from "./components/BackToTop";

const STORAGE_KEY = "devfolio_projects";

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState<"ALL" | ProjectStatus>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed);
      } catch (error) {
        console.error("Failed to load projects from localStorage:", error);
      }
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  // Close mobile menu when navigating
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Track page view on mount
  useEffect(() => {
    analytics.trackPageView(window.location.pathname);
  }, []);

  const filteredProjects = useMemo(() => {
    if (filter === "ALL") return projects;
    return projects.filter((p) => p.status === filter);
  }, [filter, projects]);

  // Track filter changes
  useEffect(() => {
    analytics.trackProjectFilter(filter);
  }, [filter]);

  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter(
      (p) => p.status === ProjectStatus.COMPLETED
    ).length;
    const inProgress = projects.filter(
      (p) => p.status === ProjectStatus.IN_PROGRESS
    ).length;
    return { total, completed, inProgress };
  }, [projects]);

  const handleAddProject = (newProjectData: Omit<Project, "id">) => {
    const newProject: Project = {
      ...newProjectData,
      id: Date.now().toString(),
    };
    setProjects((prev) => [newProject, ...prev]);
    // Track project addition
    analytics.trackProjectAdded(newProject.title);
  };

  // Track theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    toggleTheme();
    analytics.trackThemeToggle(newTheme);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    viewport: { once: true },
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark"
        ? "bg-slate-900 text-slate-100"
        : "bg-stone-50 text-slate-900"
        } selection:bg-indigo-500 selection:text-white`}
    >
      {/* Navbar */}
      <nav
        className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-300 ${theme === "dark"
          ? "bg-slate-900/80 border-b border-slate-800"
          : "bg-stone-50/80 border-b border-stone-200"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src="/images/Veek logo.png"
                  alt={`${MY_NAME} logo`}
                  className="h-11 w-auto"
                />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                  {MY_NAME.split(" ")[0]} Analytics
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a
                href="#about"
                className={`transition-colors text-sm font-medium ${theme === "dark"
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                About
              </a>
              <a
                href="#projects"
                className={`transition-colors text-sm font-medium ${theme === "dark"
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Projects
              </a>
              <a
                href="#testimonials"
                className={`transition-colors text-sm font-medium ${theme === "dark"
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Testimonials
              </a>
              <a
                href="#certifications"
                className={`transition-colors text-sm font-medium ${theme === "dark"
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Certifications
              </a>
              <a
                href="#contact"
                className={`transition-colors text-sm font-medium ${theme === "dark"
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Contact
              </a>
            </div>

            {/* Theme Toggle + Mobile Menu Button */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className={`p-2 rounded-lg transition-colors ${theme === "dark"
                  ? "hover:bg-slate-800 text-slate-300 hover:text-white"
                  : "hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
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
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
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
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${theme === "dark"
                  ? "hover:bg-slate-800 text-slate-300 hover:text-white"
                  : "hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                aria-label="Toggle menu"
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
                  {isMobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </>
                  ) : (
                    <>
                      <line x1="4" y1="6" x2="20" y2="6"></line>
                      <line x1="4" y1="12" x2="20" y2="12"></line>
                      <line x1="4" y1="18" x2="20" y2="18"></line>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div
              className={`md:hidden pb-4 space-y-2 animate-slide-down ${theme === "dark" ? "bg-slate-800/50" : "bg-slate-100/50"
                } rounded-lg p-2`}
            >
              <a
                href="#about"
                onClick={handleNavClick}
                className={`block px-4 py-2 rounded-lg transition-colors text-sm font-medium ${theme === "dark"
                  ? "text-slate-300 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
              >
                About
              </a>
              <a
                href="#projects"
                onClick={handleNavClick}
                className={`block px-4 py-2 rounded-lg transition-colors text-sm font-medium ${theme === "dark"
                  ? "text-slate-300 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
              >
                Projects
              </a>
              <a
                href="#testimonials"
                onClick={handleNavClick}
                className={`block px-4 py-2 rounded-lg transition-colors text-sm font-medium ${theme === "dark"
                  ? "text-slate-300 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
              >
                Testimonials
              </a>
              <a
                href="#certifications"
                onClick={handleNavClick}
                className={`block px-4 py-2 rounded-lg transition-colors text-sm font-medium ${theme === "dark"
                  ? "text-slate-300 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
              >
                Certifications
              </a>
              <a
                href="#contact"
                onClick={handleNavClick}
                className={`block px-4 py-2 rounded-lg transition-colors text-sm font-medium ${theme === "dark"
                  ? "text-slate-300 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
              >
                Contact
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="about"
        className="relative pt-16 pb-16 md:pt-20 md:pb-24 lg:pt-32 lg:pb-36 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/30 bg-emerald-400/10 mb-6"
            >
              Open for Website Development Roles
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6"
            >
              Hi, I'm{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                {MY_NAME}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`text-xl sm:text-2xl mb-8 font-light ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
            >
              {MY_ROLE}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`text-lg leading-8 mb-10 ${theme === "dark" ? "text-slate-400" : "text-slate-700"
                }`}
            >
              {MY_BIO}
            </motion.p>

            {/* Profile Picture */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 100 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative w-52 h-52 rounded-full overflow-hidden border-4 border-indigo-400/50 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 group">
                <img
                  src={PROFILE_IMAGE_URL}
                  alt={MY_NAME}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 via-transparent to-cyan-400/20 pointer-events-none"></div>
              </div>
            </motion.div>

            {/* Skills Pills */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="whileInView"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              {SKILLS.slice(0, 6).map((skill) => (
                <motion.span
                  key={skill}
                  variants={{
                    initial: { opacity: 0, scale: 0.8 },
                    whileInView: { opacity: 1, scale: 1 },
                  }}
                  className={`px-4 py-2 border rounded-full text-sm cursor-default ${theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-300"
                    : "bg-stone-100 border-stone-200 text-slate-600"
                    }`}
                >
                  {skill}
                </motion.span>
              ))}
              <motion.button
                variants={{
                  initial: { opacity: 0, scale: 0.8 },
                  whileInView: { opacity: 1, scale: 1 },
                }}
                onClick={() => setIsSkillsModalOpen(true)}
                className={`px-4 py-2 border text-indigo-400 rounded-full text-sm transition-colors ${theme === "dark"
                  ? "bg-slate-800 border-indigo-500/50 hover:bg-indigo-900/20"
                  : "bg-stone-100 border-indigo-200 hover:bg-indigo-50"
                  }`}
              >
                + View All Skills
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex justify-center gap-4"
            >
              <a
                href="#projects"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
              >
                View Portfolio
              </a>
              <button
                onClick={() => setIsSkillsModalOpen(true)}
                className={`px-8 py-3 border rounded-full font-semibold transition-all hover:scale-105 ${theme === "dark"
                  ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
                  : "bg-stone-100 hover:bg-stone-200 border-stone-200 text-slate-900"
                  }`}
              >
                Skills & Certs
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-[800px] aspect-square bg-indigo-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className={`py-16 md:py-24 relative transition-colors duration-300 ${theme === "dark" ? "bg-slate-900" : "bg-stone-50"
          }`}
      >
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h2
                  className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"
                    }`}
                >
                  Data Projects
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`p-2 rounded-full border transition-all group ${theme === "dark"
                    ? "bg-slate-800 hover:bg-indigo-600 border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white"
                    : "bg-stone-100 hover:bg-indigo-50 border-stone-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600"
                    }`}
                  title="Add New Project"
                >
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
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
              <p
                className={`${theme === "dark" ? "text-slate-400" : "text-slate-700"
                  }`}
              >
                Analysis, predictions, and dashboards designed to solve business
                problems.
              </p>
            </div>

            {/* Filter Tabs */}
            <div
              className={`flex p-1 space-x-1 rounded-xl border self-start md:self-auto ${theme === "dark"
                ? "bg-slate-800 border-slate-700/50"
                : "bg-stone-100 border-stone-200 shadow-sm"
                }`}
            >
              {[
                { label: "All", value: "ALL", count: stats.total },
                {
                  label: "Completed",
                  value: ProjectStatus.COMPLETED,
                  count: stats.completed,
                },
                {
                  label: "In Progress",
                  value: ProjectStatus.IN_PROGRESS,
                  count: stats.inProgress,
                },
              ].map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setFilter(tab.value as any)}
                  className={`
                    px-4 py-2.5 text-sm font-medium rounded-lg transition-all
                    ${filter === tab.value
                      ? "bg-indigo-600 text-white shadow-md"
                      : theme === "dark"
                        ? "text-slate-400 hover:text-white hover:bg-slate-700/50"
                        : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                    }
                  `}
                >
                  {tab.label}
                  <span
                    className={`ml-2 py-0.5 px-2 rounded-full text-xs ${filter === tab.value
                      ? "bg-indigo-500 text-white"
                      : theme === "dark"
                        ? "bg-slate-700 text-slate-300"
                        : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {/* Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-20 border border-dashed rounded-2xl ${theme === "dark" ? "border-slate-800" : "border-slate-200"
                }`}
            >
              <p
                className={`${theme === "dark" ? "text-slate-500" : "text-slate-400"
                  }`}
              >
                No projects found in this category.
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`py-16 md:py-24 transition-colors duration-300 ${theme === "dark" ? "bg-slate-900" : "bg-stone-100"
          }`}
      >
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Clients Say</h2>
            <p
              className={`text-lg ${theme === "dark" ? "text-slate-400" : "text-slate-700"
                }`}
            >
              Hear from businesses I’ve helped bring their vision to life on the web.
            </p>
          </div>
          <TestimonialsCarousel testimonials={TESTIMONIALS} />
        </motion.div>
      </section>

      {/* Certifications Section (Preview) */}
      <section
        id="certifications"
        className={`py-20 border-y transition-colors duration-300 ${theme === "dark"
          ? "bg-slate-800/30 border-slate-800"
          : "bg-stone-50 border-stone-200"
          }`}
      >
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex justify-between items-center mb-10">
            <h2
              className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              Certifications
            </h2>
            <button
              onClick={() => setIsSkillsModalOpen(true)}
              className={`text-sm font-medium transition-colors ${theme === "dark"
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-700"
                }`}
            >
              View All &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className={`flex items-start gap-4 p-5 rounded-xl border transition-colors ${theme === "dark"
                  ? "bg-slate-800 border-slate-700/50"
                  : "bg-stone-100 border-stone-200"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${theme === "dark"
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "bg-indigo-100 text-indigo-700"
                    }`}
                >
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
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <h3
                    className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                  >
                    {cert.name}
                  </h3>
                  <p
                    className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-700"
                      }`}
                  >
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className={`py-16 md:py-24 relative transition-colors duration-300 ${theme === "dark" ? "bg-slate-900" : "bg-stone-100"
          }`}
      >
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2
            className={`text-3xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Let’s Build Something Smart
          </h2>
          <p
            className={`mb-10 text-lg ${theme === "dark" ? "text-slate-400" : "text-slate-700"
              }`}
          >
            Looking for more than just a website? I can help you engineer a full-stack solution that combines beautiful design with automated, AI-driven backend logic.
          </p>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <motion.a
              variants={{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
              }}
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={() =>
                analytics.trackExternalLink(CONTACT_EMAIL, "email_contact")
              }
              className="inline-flex items-center gap-2 text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {CONTACT_EMAIL}
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
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </motion.a>

            {/* Social Links */}
            <motion.div
              variants={staggerContainer}
              className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center"
            >
              {[
                {
                  href: LINKEDIN_URL,
                  icon: (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.006 1.422-.103.249-.129.597-.129.946v5.437h-3.554s.05-8.807 0-9.718h3.554v1.375c.427-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.385 3.704 4.362v5.576zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.955.77-1.71 1.957-1.71 1.188 0 1.915.755 1.94 1.71 0 .951-.752 1.71-1.982 1.71zm1.581 11.597H3.635V9.034h3.283v11.418zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  ),
                  label: "LinkedIn",
                  hover: "hover:bg-blue-600 hover:border-blue-500",
                },
                {
                  href: GITHUB_URL,
                  icon: (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  ),
                  label: "GitHub",
                  hover: "hover:bg-gray-700 hover:border-gray-500",
                },
                {
                  href: WHATSAPP_URL,
                  icon: (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.782 1.146l-.313.156-.325-.067C6.728 6.139 5.216 5.289 5.216 3.888c0-1.188.956-2.144 2.121-2.144.291 0 .575.055.847.16 1.456.558 2.921 1.881 2.282 3.24-.174.421.005.441.315.441h.003c.314 0 .635-.035.935-.1 1.9-.378 3.344 1.082 3.344 2.981 0 1.193-.667 2.24-1.8 2.843-1.019.52-2.147.52-2.348.52h-.002z" />
                    </svg>
                  ),
                  label: "WhatsApp",
                  hover: "hover:bg-green-600 hover:border-green-500",
                },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  variants={{
                    initial: { opacity: 0, scale: 0.8 },
                    whileInView: { opacity: 1, scale: 1 },
                  }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 border rounded-lg font-medium transition-all hover:scale-105 ${theme === "dark"
                    ? `bg-slate-800 border-slate-700 text-white ${social.hover}`
                    : `bg-stone-100 border-stone-200 text-slate-700 ${social.hover.replace(
                      "bg-",
                      "bg-blue-50"
                    )}`
                    }`}
                >
                  {social.icon}
                  {social.label}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className={`py-8 text-center border-t transition-colors duration-300 ${theme === "dark"
          ? "bg-slate-900 border-slate-800"
          : "bg-stone-50 border-stone-200"
          }`}
      >
        <p className={`text-sm ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`}>
          © {new Date().getFullYear()} {MY_NAME}. All rights reserved —{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            onClick={() =>
              analytics.trackExternalLink(CONTACT_EMAIL, "email_footer")
            }
            className="text-indigo-400 hover:text-indigo-300"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </footer>

      {/* Modals and Widgets */}
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProject}
      />
      <SkillsModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
      />
      <ChatWidget projects={projects} />
      <BackToTop />
    </div>
  );
};

export default App;
