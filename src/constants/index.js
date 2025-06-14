import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    meta,
    momo,
    shopify,
    carrent,
    jobit,
    tripguide,
    threejs,
    pnc,
    momotool,
    blackjacktrainer,
    python,
    netcore,
    csharp,
    java,
    azure,
    openshift,
    bitbucket,
    sqlserver,
    angular,
    googlecloud
  } from "../assets";
  
  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "Front-End Developer",
      icon: web,
    },
    {
      title: "Backend Developer",
      icon: backend,
    },
    {
      title: "Database Developer",
      icon: mobile,
    },
    {
      title: "Solution Designer",
      icon: creator,
    },
  ];
  
  const technologies = [
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "TypeScript",
      icon: typescript,
    },
     {
      name: "C#",
      icon: csharp,
    },
    {
      name: "Python",
      icon: python,
    },
    {
      name: "Java",
      icon: java,
    },
    {
      name: "React",
      icon: reactjs,
    },
    {
      name: "Angular",
      icon: angular,
    },
    {
      name: "SQL Server",
      icon: sqlserver,
    },
    {
      name: "Azure",
      icon: azure,
    },
    {
      name: "Docker",
      icon: docker,
    },
    {
      name: ".NET Core",
      icon: netcore,
    },
    {
      name: "OpenShift",
      icon: openshift,
    },
  ];
  
  const experiences = [
    {
      title: "Software Engineer Lead",
      company_name: "PNC Bank",
      icon: pnc,
      iconBg: "#E6DEDD",
      date: "Mar 2024 - Present",
      points: [
        "Currently leading design/development of a web portal for all PNC Employees to trace and process customers who have passed away.",
        "Led design and development on projects to automate the manual processing of loans utilizing SQL Server, C# .Net and Angular TypeScript full-stack technologies; Saved PNC Bank ~$250,000 and Improved loan processing efficiency by 50%.",
        "Design technical work items to various software developers and perform code reviews to ensure quality of code meets business expectations.",
        "Present multiple product demos to business clients demonstrating the team's progress on our project.",
        "Built reusable User Interface components for other software developers to utilize. Increased development efficiency by 25%.",
      ],
    },
     {
      title: "Software Engineer",
      company_name: "PNC Bank",
      icon: pnc,
      iconBg: "#E6DEDD",
      date: "Mar 2023 - Mar 2024",
      points: [
        "Worked on multiple projects to develop new business servicing processes enabling bank employees to process loans within an internal software application; Increased traceability for millions of loans compared to previous manual process.",
        "Built User Interface web pages, Application Programmable Interfaces (APIs) endpoints, and database designs utilizing Angular TypeScript, C# .Net and SQL Server technologies.",
        "Experience with utilizing CI/CD pipelines using Jenkins, Microsoft Azure, and OpenShift for end-to-end automation for all builds.",
        "Created Unit Tests for both front-end and back-end frameworks using Karma/Jest and MSTest technologies respectively.",
        "Upgraded multiple API's .Net Core software frameworks, remediating vulnerabilities from the software application.",
        "Utilized automated governance to increase cybersecurity in applications by practicing defensive programming techniques."
      ],
    },
    {
      title: "Technology Development Program Associate",
      company_name: "PNC Bank",
      icon: pnc,
      iconBg: "#E6DEDD",
      date: "Feb 2022 - Mar 2023",
      points: [
        "Rotated on teams in 4 different lines of businesses at PNC Bank: Intelligent Automation, DevOps, Emerging Software Engineering, and Security.",
        "Was a contributor to the FDIC-370 project processing 670,607K signature cards contributing to saving PNC bank $1.78 Million by developing classification and image extraction Artificial Intelligence (AI) models and Python scripts.",
        "Upgraded the entire user interface of PNC’s software governance tool by performing an application migration of the Vue JavaScript framework from version 2 to version 3, thus increasing performance and maintainability of the tool.",
        "Built 10 new API Services using C# with a .NET Core software framework that communicated with a third-party vendor that automates creation and updates of different entities in the team's application.",
      ],
    },
    {
      title: "Software Engineer Intern",
      company_name: "Momo",
      icon: momo,
      iconBg: "#383E56",
      date: "May 2021 - Aug 2021",
      points: [
        "Built entire database tool for early start-up in the software development sector. Enabled authorized employees to write, read, and edit the company's database.",
        "Database tool enabled all future authorized non-technical employees to manipulate the company’s database. Improved overall efficiency to application deployment.",
        "Innovated and assessed new application ideas for application prototype.",
        "Developed application utilizing React TypeScript, Apollo GraphQL, HTML, CSS, TypeORM, PostgreSQL, Heroku, Material-UI, Firebase, and Git.",
      ],
    },
  ];
  
  const testimonials = [
    {
      testimonial:
        "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
      name: "Sara Lee",
      designation: "CFO",
      company: "Acme Co",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      testimonial:
        "I've never met a web developer who truly cares about their clients' success like Rick does.",
      name: "Chris Brown",
      designation: "COO",
      company: "DEF Corp",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      testimonial:
        "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
      name: "Lisa Wang",
      designation: "CTO",
      company: "456 Enterprises",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
  ];
  
  const projects = [
    {
      name: "Momo Database Editing Tool",
      description:
        "A web based platform enabling authorized non-technical employees to add, search, and manipulate the company’s database. Improved overall efficiency for the company’s production process",
      tags: [
        {
          name: "React TypeScript",
          color: "blue-text-gradient",
        },
        {
          name: "Apollo GraphQL",
          color: "green-text-gradient",
        },
        {
          name: "PostgreSQL",
          color: "pink-text-gradient",
        },
      ],
      image: momotool,
      source_code_link: "https://www.loom.com/share/ccede362cafc430f9824fdbf3091bfb6",
    },
    {
      name: "BlackJack Trainer",
      description:
        "Created a Blackjack game that informs players whether to 'hit' or 'stand' based on the current state of the game. This enables players to practice basic Blackjack strategies to prepare users for a real game",
      tags: [
        {
          name: "React TypeScript",
          color: "blue-text-gradient",
        },
        {
          name: "Google Firebase",
          color: "green-text-gradient",
        },
        {
          name: "HTML",
          color: "pink-text-gradient",
        },
        {
          name: "CSS",
          color: "pink-text-gradient",
        },
      ],
      image: blackjacktrainer,
      source_code_link: "https://github.com/JasonM3687/Black-Jack-Trainer-CS1520",
      live_site_link: "https://trainerblackjack.com",
      display_link: "trainerblackjack.com"
    }
  ];
  
  export { services, technologies, experiences, testimonials, projects };