import React, { useState, useEffect } from "react";
import { Project, ProjectStatus } from "../types";
import { analytics } from "../services/analytics";
import { useTheme } from "../context/ThemeContext";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, "id">) => void;
}

interface FormErrors {
  [key: string]: string;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    status: ProjectStatus.IN_PROGRESS,
    technologies: "",
    imageUrl: "",
    demoLink: "",
    repoLink: "",
    completionDate: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
      analytics.trackModalOpen("add_project");
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Short description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Full Description validation
    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = "Full description is required";
    } else if (formData.fullDescription.length < 20) {
      newErrors.fullDescription =
        "Full description must be at least 20 characters";
    }

    // Technologies validation
    if (!formData.technologies.trim()) {
      newErrors.technologies = "At least one technology is required";
    }

    // Image URL validation
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = "Please enter a valid URL";
      }
    }

    // Demo Link validation (optional but if provided, must be valid URL)
    if (formData.demoLink.trim()) {
      try {
        new URL(formData.demoLink);
      } catch {
        newErrors.demoLink = "Please enter a valid URL";
      }
    }

    // Repo Link validation (optional but if provided, must be valid URL)
    if (formData.repoLink.trim()) {
      try {
        new URL(formData.repoLink);
      } catch {
        newErrors.repoLink = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Process technologies string into array
      const techArray = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const newProject: Omit<Project, "id"> = {
        ...formData,
        technologies: techArray,
        completionDate: formData.completionDate || undefined,
        demoLink: formData.demoLink || undefined,
        repoLink: formData.repoLink || undefined,
      };

      onSubmit(newProject);
      onClose();

      // Reset form
      setFormData({
        title: "",
        description: "",
        fullDescription: "",
        status: ProjectStatus.IN_PROGRESS,
        technologies: "",
        imageUrl: "",
        demoLink: "",
        repoLink: "",
        completionDate: "",
      });
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose} // Close on backdrop click
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-zoom-in transition-colors duration-300 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-slate-200"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex justify-between items-center sticky top-0 z-10 rounded-t-2xl transition-colors duration-300 ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-slate-100"
          }`}
        >
          <h2
            className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            Add New Project
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              theme === "dark"
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            }`}
            aria-label="Close modal"
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6">
          <form
            id="add-project-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-4">
              {/* Title & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Project Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
                      theme === "dark"
                        ? "bg-slate-800 text-white border-slate-700 placeholder:text-slate-500"
                        : "bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400"
                    } ${errors.title ? "border-red-500" : ""}`}
                    placeholder="e.g. Nebula Dashboard"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Status <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
                      theme === "dark"
                        ? "bg-slate-800 text-white border-slate-700"
                        : "bg-slate-50 text-slate-900 border-slate-200"
                    }`}
                  >
                    <option value={ProjectStatus.IN_PROGRESS}>
                      In Progress
                    </option>
                    <option value={ProjectStatus.COMPLETED}>Completed</option>
                    <option value={ProjectStatus.ARCHIVED}>Archived</option>
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Short Description <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={120}
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 text-white border-slate-700 placeholder:text-slate-500"
                      : "bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400"
                  } ${errors.description ? "border-red-500" : ""}`}
                  placeholder="Brief summary for the card (max 120 chars)"
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
                <div className="text-right text-xs text-slate-500 mt-1">
                  {formData.description.length}/120
                </div>
              </div>

              {/* Full Description (AI Context) */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Full Description (for AI Context){" "}
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="fullDescription"
                  required
                  rows={4}
                  value={formData.fullDescription}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 text-white border-slate-700 placeholder:text-slate-500"
                      : "bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400"
                  } ${errors.fullDescription ? "border-red-500" : ""}`}
                  placeholder="Detailed explanation of the project features, architecture, and your role. The AI will use this to answer questions."
                />
                {errors.fullDescription && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.fullDescription}
                  </p>
                )}
              </div>

              {/* Technologies */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Technologies <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="technologies"
                  required
                  value={formData.technologies}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 text-white border-slate-700 placeholder:text-slate-500"
                      : "bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400"
                  } ${errors.technologies ? "border-red-500" : ""}`}
                  placeholder="e.g. React, Node.js, TypeScript (comma separated)"
                />
                {errors.technologies && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.technologies}
                  </p>
                )}
              </div>

              {/* Links Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Demo URL
                  </label>
                  <input
                    type="url"
                    name="demoLink"
                    value={formData.demoLink}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
                      theme === "dark"
                        ? "bg-slate-800 text-white border-slate-700 placeholder:text-slate-500"
                        : "bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400"
                    } ${errors.demoLink ? "border-red-500" : ""}`}
                    placeholder="https://..."
                  />
                  {errors.demoLink && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.demoLink}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Repository URL
                  </label>
                  <input
                    type="url"
                    name="repoLink"
                    value={formData.repoLink}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
                      theme === "dark"
                        ? "bg-slate-800 text-white border-slate-700 placeholder:text-slate-500"
                        : "bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400"
                    } ${errors.repoLink ? "border-red-500" : ""}`}
                    placeholder="https://github.com/..."
                  />
                  {errors.repoLink && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.repoLink}
                    </p>
                  )}
                </div>
              </div>

              {/* Image & Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Image URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    required
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
                      theme === "dark"
                        ? "bg-slate-800 text-white border-slate-700 placeholder:text-slate-500"
                        : "bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400"
                    } ${errors.imageUrl ? "border-red-500" : ""}`}
                    placeholder="https://..."
                  />
                  {errors.imageUrl && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.imageUrl}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Completion Date
                  </label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
                      theme === "dark"
                        ? "bg-slate-800 text-white border-slate-700 [color-scheme:dark]"
                        : "bg-slate-50 text-slate-900 border-slate-200 [color-scheme:light]"
                    }`}
                  />
                </div>
              </div>

              {/* Image Preview */}
              {formData.imageUrl && (
                <div className="mt-2">
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Preview
                  </label>
                  <div
                    className={`relative h-48 w-full rounded-lg overflow-hidden border transition-colors ${
                      theme === "dark"
                        ? "border-slate-700 bg-slate-800"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <img
                      src={formData.imageUrl}
                      alt="Project Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/600x400?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div
          className={`p-6 border-t flex justify-end gap-3 rounded-b-2xl transition-colors duration-300 ${
            theme === "dark" ? "border-slate-700 bg-slate-900/50" : "border-slate-100 bg-slate-50/50"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-slate-300 hover:text-white font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-project-form"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              isSubmitting ? "scale-100" : ""
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
