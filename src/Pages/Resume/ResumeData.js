/*
 * Single source of truth for the /resume page. Update content here — both
 * the on-screen view and the printed/exported PDF read from this file, so
 * they can never drift out of sync with each other.
 */

const ResumeData = {
  name: 'Nate Sheridan',
  title: 'Software Engineer',
  tagline: "I promise I will break stuff before I make stuff",
  summary:
    "I enjoy working with all FE/BE technologies, SPA frameworks, and libraries to build interactive web applications that are focused on the user and their overall experience. I always aim to provide a viable and dynamic interface for {{any}} person to use. I am understanding that the world of software is a field that in order to progress, I must always be learning and adapting my skillset, and aim to learn all I can wherever I am, doing everything I can to broaden my knowledge of how people interact with applications I work on. Let's get making!",

  contact: {
    phone: '(720) - 254 - 1048',
    email: 'nbs@dr.com',
    site: 'www.n8s.pw',
    siteUrl: 'https://www.n8s.pw',
    github: 'https://github.com/natesheridan',
    linkedin: 'https://linkedin.com/in/n8s',
  },

  experience: [
    {
      company: "Jay's Valet, Denver",
      role: 'Director of Employee Communications',
      dates: 'May 2026 - Current Full-Time Employee',
      bullets: [
        'Manage list of 500+ staff members to organize and coordinate up to 80+ employees for events',
        'Build and maintain custom tooling',
        'On board and hire new staff members',
        'Train field leadership and organize all reporting of events',
      ],
    },
    {
      company: 'ServiceLogix, Remote (Denver)',
      role: 'Full Stack Software Engineer (www.servicelogix.com)',
      dates: 'January 2022 - August 2025',
      bullets: [
        'Promoted from intern to full-time engineer after initial success with internal tooling.',
        'Spearheaded development of a new internal framework to support future product initiatives.',
        'Collaborate in daily Agile stand-ups, contributing to sprint planning, architectural decisions, and early-stage discussions around future AI integrations.',
        'Delivered enhancements to a custom Single Page Application (SPA) built with vanilla JavaScript, improving performance and user experience with a heavy focus on styling and UX design.',
        'Maintained and extended backend services using C#/.NET with OracleSQL database integrations.',
      ],
      techStack: 'C#/.NET 9&5, ASP.NET, Vanilla JavaScript, Vite, Cypress, Oracle SQL, MySQL, Perforce, Azure',
    },
    {
      company: 'Autofoc.us LLC, Remote (Denver)',
      role: 'Founder/Full Stack Engineer (www.autofoc.us)',
      dates: 'February 2025 - Present',
      bullets: [
        'Independently designed and built a publicly accessible productivity web app, link shortener, and content management system in one universal web application',
        'Contribute consistently to design decisions, UX improvements, and development strategy.',
      ],
      techStack: 'Figma, NextJS, Postgres w/ Supabase wrapper, AWS, Github, Adobe CC Suite, Auth0',
    },
    {
      company: "Jay's Valet, Denver",
      role: 'Account Manager, Shift Manager, Priority Shuttle Driver',
      dates: 'August 2017 - Current Random Part-Time Employee',
      bullets: [
        'Account Manager for Cherry Hills Country Club’s private VIP club "Club22."',
        'Lead valet teams (3–20+ staff) at high-profile events and luxury locations including Matsuhisa Denver.',
        'Managed high-value vehicles daily with precision and accountability.',
        'Designed and implemented onboarding documentation and surveys to improve team operations.',
        'Trained new staff and coordinated team logistics during peak operations.',
      ],
    },
    {
      company: 'Freelance Computer Repair & Refurbishment Denver',
      role: 'Freelance',
      dates: 'April 2020 - January 2021',
      bullets: [
        'Operated an independent e-waste recycling and electronics repair side business.',
        'Refurbished discarded PCs and laptops by repairing hardware and replacing key components.',
        'Specialized in SSD, RAM, and motherboard upgrades; moderate soldering and fabrication experience.',
        'Sold refurbished systems at profit through local and online marketplaces.',
      ],
    },
  ],

  educationalProjects: [
    {
      name: 'Stonki',
      type: 'Solo Project',
      date: 'January 2022',
      description: [
        "a fintech-inspired portfolio tracker using FinancialModelingPrep's API",
        'Charted live stock data using Recharts, deployed via AWS Amplify',
      ],
      techUsed: 'React, REST API, Recharts, AWS',
      github: 'https://github.com/natesheridan',
    },
    {
      name: 'Routes',
      type: 'Group Project',
      date: 'December 2021',
      description: [
        'Developed a medical waste routing system with MapQuest API',
        'Built interactive maps with Leaflet and a GraphQL backend.',
      ],
      techUsed: 'React, GraphQL, Ruby, Leaflet, AWS, Heroku',
      github: 'https://github.com/natesheridan',
    },
    {
      name: 'Driplist',
      type: 'Group Project',
      date: 'November 2021',
      description: [
        'Created a cocktail recipe app with user auth and recipe saving features',
        'Used Auth0 for login and React to simplify drink preparation UX',
      ],
      techUsed: 'React, REST API, Auth0, AWS Amplify',
      github: 'https://github.com/natesheridan',
    },
  ],

  skillset: [
    'JavaScript (ES6)',
    'C# / .Net',
    'CSS',
    'HTML',
    'Git',
    'API Consumption (WEB/REST)',
    'CI/CD',
    'Hardware Knowledge',
    'Adobe PS, LR, AE CS6',
    'DNS / Domains',
    'Postgres, OracleSQL',
    'AI Agents',
  ],

  technologies: [
    'React',
    'Webpack',
    'SASS, Tailwind',
    'Express/Node',
    'GraphQL',
    'Mocha, Chai, Cypress',
    'AWS (FE deploy stack)',
    'Azure',
    'CPanel',
    'WordPress',
    'Vite',
  ],

  tools: [
    'Figma',
    'Github',
    'VSCode/VS2022',
    'Cursor',
    'Ollama',
    'Perforce',
    'Auth0',
    'Jira',
    'Supabase',
    'Firebase',
    'Veo, Gemini, AI etc',
  ],

  education: {
    school: 'Turing School of Software and Design',
    program: 'Front-End Engineering ACCET Accredited Program',
    startDate: { month: 'July', year: '2021' },
    endDate: { month: 'January', year: '2022' },
  },
};

export default ResumeData;
