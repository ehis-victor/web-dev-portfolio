import { Project, ProjectStatus, Certification, Testimonial } from "./types";

export const MY_NAME = "Victor Ehinome";
export const MY_ROLE = "Full-Stack Web Developer";
export const MY_BIO =
  "I’m a Full-Stack Developer dedicated to crafting end-to-end solutions that marry intuitive design with robust architecture. By integrating Machine Learning and LLMs, I don't just build interfaces, I build intelligent systems that automate workflows and solve complex user problems.";

export const CONTACT_EMAIL = "ehinomevictor@gmail.com";
export const PROFILE_IMAGE_URL = "/images/profile-picture.png";
export const LINKEDIN_URL = "";
export const GITHUB_URL = "https://github.com/ehis-victor";
export const WHATSAPP_URL = "https://wa.me/2347016428552";
export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Victor Analytics",
    description: "Interactive portfolio website.",
    fullDescription:
      "Developed an interactive portfolio website with AI integration using modern web technologies. Implemented dynamic UI interactions, real-time content updates, and AI-driven features to enhance usability, personalization, and engagement. Focused on performance optimization, responsiveness, and maintainable code.",
    status: ProjectStatus.COMPLETED,
    technologies: ["HTML", "Javascript", "TypeScript", "React", "git & GitHub", "Vite", "Tailwind CSS"],
    imageUrl: "/images/portfolio.png",
    demoLink: "https://ehis-data-portfolio.netlify.app/",
    repoLink: "https://github.com/ehis-victor/Devfolio",
    completionDate: "2024-01-20",
  },
  {
    id: "2",
    title: "Brides of Destiny",
    description: "Non-profit organization website.",
    fullDescription:
      "Built a modern, responsive website for a non-profit organization using HTML, CSS, and JavaScript to strengthen its online presence. The website was designed to clearly communicate the organization’s mission, improve user engagement, and ensure accessibility across devices. Emphasis was placed on performance, usability, and clean front-end architecture.",
    status: ProjectStatus.COMPLETED,
    technologies: ["HTML", "Javascript", "TypeScript", "React", "git & GitHub", "Vite", "Tailwind CSS"],
    imageUrl: "/images/BOD.png",
    demoLink: "https://bridesofdestiny.netlify.app/",
    repoLink: "https://github.com/ehis-victor/Brides-Of-Destiny",
    completionDate: "2023-11-15",
  },
  {
    id: "3",
    title: "Rafaels family restaurant",
    description:
      "Responsive restaurant website showcasing menu, reviews, and contact info, built with clean design",
    fullDescription:
      "Developed a responsive restaurant website for Rafael’s Family Restaurant, highlighting its menu, atmosphere, and local charm. Built with modern web technologies and deployed on Netlify to ensure fast performance and mobile-friendly viewing.",
    status: ProjectStatus.COMPLETED,
    technologies: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "GSAP", "git & GitHub", "Nextjs", "Tailwind CSS"],
    imageUrl: "/images/rafael.png",
    demoLink:
      "https://rafaelsfamilyrestaurant.netlify.app/",
    completionDate: "2022-08-10",
  },
  {
    id: "4",
    title: "AI Assistant Bot",
    description: "Interactive AI personal assistant.",
    fullDescription:
      "Developed an AI-driven assistant web platform combining LLM capabilities with external APIs to automate workflows, generate intelligent responses, and enhance user productivity through contextual understanding and adaptive prompts.",
    status: ProjectStatus.IN_PROGRESS,
    technologies: ["Python", "LLMs", "SQLAlchemy", "FastAPI", "React"],
    imageUrl: "/images/Veek Ass_Vid.mp4",
    demoLink: "https://veeks-assistant-1.onrender.com/",
    // repoLink: "https://github.com/ehis-victor/Veeks-Assistant/tree/main",
    completionDate: "2024-01-20",
  },
];

export const SKILLS = [
  "HTML5",
  "CSS3",
  "JavaScript (ES6+)",
  "TypeScript",
  "React",
  "Nextjs",
  "Tailwind CSS",
  "GSAP",
  "git & GitHub",
  "Python",
  "LLMs",
  "SQLAlchemy",
  "FastAPI",
];

export const CERTIFICATIONS: Certification[] = [
  // {
  //   id: "1",
  //   name: "Power BI Data Analyst Associate",
  //   issuer: "Lagos School of Programming",
  //   date: "2024",
  //   credentialUrl:
  //     "https://drive.google.com/file/d/1NZqNNw2wKoTRVrt0loK-T7sEhPeOTmH1/view?usp=sharing",
  // },
{
    id: "1",
    name: "Full-Stack Web Development",
    issuer: "Udemy",
    date: "Ongoing",
    credentialUrl: "",
  },
  {
    id: "2",
    name: "Data Science and AI Certificate",
    issuer: "Lagos School of Programming",
    date: "2024",
    credentialUrl:
      "https://drive.google.com/file/d/1NZqNNw2wKoTRVrt0loK-T7sEhPeOTmH1/view?usp=sharing",
  },

  {
    id: "3",
    name: "Google Data Analytics Professional Certificate",
    issuer: "Google",
    date: "Ongoing",
    credentialUrl: "",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Chinedu Okoro",
    role: "CEO",
    company: "Brides of Destiny",
    text: "Working with Victor was a great experience. He delivered a clean, responsive website that perfectly matched our vision. Communication was clear throughout the project, and the final result exceeded our expectations.",
  },
  {
    id: "2",
    name: "Amara Adeyemi",
    role: "CEO",
    company: "Premium Haven 360",
    text: "A skilled full-stack web developer who delivers quality work. Victor combines technical expertise with a strong focus on user experience.",
  },
  {
    id: "3",
    name: "James Okonkwo",
    role: "Manager",
    company: "Rafaels's Family Restaurant",
    text: "From concept to deployment, Victor handled everything professionally. He’s reliable, easy to work with, and delivers scalable web solutions that meet real business needs.",
  },
  {
    id: "4",
    name: "Sarah Johnson",
    role: "Data Manager",
    company: "Healthcare Analytics",
    text: "Exceptional data scientist. Victor's ETL processes are robust and his visualizations make complex medical data easy to understand for stakeholders.",
  },
];
