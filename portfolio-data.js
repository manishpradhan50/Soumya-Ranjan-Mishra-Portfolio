/**
 * Verified Academic Portfolio Data for Soumya Ranjan Mishra
 * Extracted directly from Profile.pdf as defined in need.txt
 * All IDs are deterministic to guarantee idempotent imports into Firestore.
 */

export const PORTFOLIO_DATA = {
  profile: {
    id: "main",
    full_name: "Soumya Ranjan Mishra",
    short_name: "Soumya Mishra",
    prefix: "Mr.",
    role: "Assistant Professor",
    role_line: "GIET University, Gunupur · Computer Applications",
    department: "Computer Applications",
    institution: "GIET University, Gunupur",
    location: "Berhampur, Odisha, India",
    phone: "+91 89175 56682",
    linkedin_url: "https://www.linkedin.com/in/mr-soumya",
    hero_label: "ASSISTANT PROFESSOR · RESEARCHER · MENTOR",
    description: "Assistant Professor working across Machine Learning, Artificial Intelligence, Software Engineering and research-oriented computing.",
    about_title: "An educator, researcher and academic professional.",
    about_text: "Dedicated to teaching, research and academic development in Artificial Intelligence, Machine Learning, and Computer Applications at GIET University, Gunupur.\n\nPassionate about mentoring students and conducting research in deep learning, remote sensing, and healthcare applications.",
    stat_1_value: "3+",
    stat_1_label: "Years at GIET",
    stat_2_value: "5",
    stat_2_label: "Publications",
    stat_3_value: "M.Tech",
    stat_3_label: "AI / ML",
    hero_image_url: "photo.jpg"
  },

  experiences: [
    {
      id: "exp-1",
      sort_order: 1,
      title: "Assistant Professor",
      organization: "GIET University, Gunupur",
      start_date: "July 2025",
      end_date: "Present",
      location: "Gunupur, Odisha, India",
      description: "Faculty member in the Department of Computer Applications, actively engaged in teaching core computer science courses, research guidance, and academic mentorship.",
      tags: "Teaching, Research, Machine Learning, Artificial Intelligence"
    },
    {
      id: "exp-2",
      sort_order: 2,
      title: "Lecturer",
      organization: "GIET University, Gunupur",
      start_date: "September 2024",
      end_date: "June 2025",
      location: "Gunupur, Odisha, India",
      description: "Delivered lectures, conducted laboratory sessions, and guided undergraduate students in computing and engineering fundamentals.",
      tags: "Lectures, Academics, Mentorship"
    },
    {
      id: "exp-3",
      sort_order: 3,
      title: "Teaching Assistant",
      organization: "GIET University, Gunupur",
      start_date: "January 2024",
      end_date: "August 2024",
      location: "Gunupur, Odisha, India",
      description: "Assisted faculty with laboratory instructions, coursework evaluations, student queries, and academic tutorials.",
      tags: "Teaching Assistant, Academic Support"
    },
    {
      id: "exp-4",
      sort_order: 4,
      title: "Research Assistant",
      organization: "GIET University, Gunupur",
      start_date: "July 2023",
      end_date: "December 2023",
      location: "Gunupur, Odisha, India",
      description: "Assisted with computational research projects in machine learning, data processing, and predictive modeling.",
      tags: "Research, Data Processing, ML Models"
    },
    {
      id: "exp-5",
      sort_order: 5,
      title: "Intern",
      organization: "GIET University, Gunupur",
      start_date: "March 2023",
      end_date: "June 2023",
      location: "Gunupur, Odisha, India",
      description: "Academic internship focusing on software development and institutional computing projects.",
      tags: "Internship, Software Development"
    },
    {
      id: "exp-6",
      sort_order: 6,
      title: "Intern",
      organization: "InternPe",
      start_date: "October 2023",
      end_date: "November 2023",
      location: "Remote",
      description: "Internship program focused on hands-on practical software development and coding implementations.",
      tags: "Internship, Practical Coding"
    },
    {
      id: "exp-7",
      sort_order: 7,
      title: "Intern",
      organization: "SYNC Intern's",
      start_date: "October 2023",
      end_date: "November 2023",
      location: "Remote",
      description: "Hands-on project work in web technologies and software development.",
      tags: "Internship, Web Technologies"
    },
    {
      id: "exp-8",
      sort_order: 8,
      title: "Intern",
      organization: "Oasis Infobyte",
      start_date: "October 2023",
      end_date: "November 2023",
      location: "Remote",
      description: "Virtual internship focusing on web development and technical problem solving.",
      tags: "Internship, Web Development"
    }
  ],

  education: [
    {
      id: "edu-1",
      sort_order: 1,
      degree: "Master of Technology (MTech)",
      field: "Computer Science Engineering (AI/ML)",
      institution: "GIET University, Gunupur",
      period: "September 2023 to May 2025",
      location: "Gunupur, Odisha, India",
      description: "Specialized postgraduate program focusing on advanced machine learning algorithms, deep learning architectures, data intelligence, and computer engineering."
    },
    {
      id: "edu-2",
      sort_order: 2,
      degree: "Master of Computer Applications (MCA)",
      field: "Computer and Information Sciences and Support Services",
      institution: "Gandhi Institute of Engineering and Technology (GIET), Gunupur",
      period: "July 2021 to May 2023",
      location: "Gunupur, Odisha, India",
      description: "Comprehensive masters program covering computational science, database architecture, systems design, and software engineering."
    },
    {
      id: "edu-3",
      sort_order: 3,
      degree: "Bachelor's degree",
      field: "Computer Software Engineering",
      institution: "Berhampur University",
      period: "August 2018 to July 2021",
      location: "Berhampur, Odisha, India",
      description: "Undergraduate degree providing foundations in algorithms, data structures, programming paradigms, and software systems."
    }
  ],

  skills: [
    {
      id: "skill-1",
      sort_order: 1,
      name: "Research",
      category: "Academic & Methodological"
    },
    {
      id: "skill-2",
      sort_order: 2,
      name: "Image Processing",
      category: "Technical Expertise"
    },
    {
      id: "skill-3",
      sort_order: 3,
      name: "Healthcare",
      category: "Domain Application"
    }
  ],

  certifications: [
    {
      id: "cert-1",
      sort_order: 1,
      title: "Machine Learning",
      issuer: "",
      issue_date: "",
      credential_id: "",
      credential_url: "",
      description: ""
    },
    {
      id: "cert-2",
      sort_order: 2,
      title: "Artificial Intelligence/Machine Learning",
      issuer: "",
      issue_date: "",
      credential_id: "",
      credential_url: "",
      description: ""
    },
    {
      id: "cert-3",
      sort_order: 3,
      title: "Web Development",
      issuer: "",
      issue_date: "",
      credential_id: "",
      credential_url: "",
      description: ""
    },
    {
      id: "cert-4",
      sort_order: 4,
      title: "Web Development and Designing",
      issuer: "",
      issue_date: "",
      credential_id: "",
      credential_url: "",
      description: ""
    }
  ],

  publications: [
    {
      id: "pub-1",
      sort_order: 1,
      year: null,
      publication_type: "Research Paper",
      title: "Predicting diabetic patients coronary artery calcium score, deep learning using retinal images.",
      authors: "",
      journal_or_book: "",
      volume_issue: "",
      pages: "",
      doi: "",
      url: "",
      abstract: "",
      tags: "Deep Learning, Retinal Images, Healthcare, Diabetes"
    },
    {
      id: "pub-2",
      sort_order: 2,
      year: null,
      publication_type: "Research Paper",
      title: "Combating food insecurity through remote sensing and machine learning for enhanced crop yield prediction.",
      authors: "",
      journal_or_book: "",
      volume_issue: "",
      pages: "",
      doi: "",
      url: "",
      abstract: "",
      tags: "Remote Sensing, Machine Learning, Agriculture, Crop Yield"
    },
    {
      id: "pub-3",
      sort_order: 3,
      year: null,
      publication_type: "Research Paper",
      title: "Effective Diabetes Mellitus Prediction Using a Hybrid Ensemble Machine Learning Model with IoT.",
      authors: "",
      journal_or_book: "",
      volume_issue: "",
      pages: "",
      doi: "",
      url: "",
      abstract: "",
      tags: "Hybrid Ensemble, Machine Learning, IoT, Healthcare"
    },
    {
      id: "pub-4",
      sort_order: 4,
      year: null,
      publication_type: "Research Paper",
      title: "Integrating Multi-Omics Data for Advanced Diabetes Prediction and Understanding.",
      authors: "",
      journal_or_book: "",
      volume_issue: "",
      pages: "",
      doi: "",
      url: "",
      abstract: "",
      tags: "Multi-Omics, Diabetes, Bioinformatics, Predictive Analytics"
    },
    {
      id: "pub-5",
      sort_order: 5,
      year: null,
      publication_type: "Research Paper",
      title: "Enhancing Diabetes Prediction using Hybrid Ensemble Approach.",
      authors: "",
      journal_or_book: "",
      volume_issue: "",
      pages: "",
      doi: "",
      url: "",
      abstract: "",
      tags: "Ensemble Learning, Diabetes Prediction, Machine Learning"
    }
  ],

  research: [
    {
      id: "res-1",
      sort_order: 1,
      title: "Machine Learning & Deep Learning",
      icon: "fa-brain",
      description: "Design and evaluation of deep neural network architectures and ensemble models for medical imaging, diagnostic predictive modeling, and remote sensing."
    },
    {
      id: "res-2",
      sort_order: 2,
      title: "Artificial Intelligence in Healthcare",
      icon: "fa-heart-pulse",
      description: "Application of intelligent diagnostic systems, retinal image analysis for coronary artery calcification scoring, and multi-omics data integration for chronic disease prediction."
    }
  ],

  achievements: []
};
