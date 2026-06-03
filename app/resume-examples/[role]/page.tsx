import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define supported roles for static generation / examples
const roleData: Record<string, {
  title: string;
  summary: string;
  skills: string[];
  experience: { company: string; title: string; dates: string; bullets: string[] }[];
  seoContent: string;
}> = {
  "software-engineer": {
    title: "Software Engineer",
    summary: "Detail-oriented and collaborative Software Engineer with 4+ years of experience building scalable web applications. Expert in React, Next.js, Node.js, and TypeScript.",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "Docker", "AWS"],
    experience: [
      {
        company: "TechSolutions Inc.",
        title: "Senior Software Engineer",
        dates: "2023 - Present",
        bullets: [
          "Led development of a high-performance Next.js application, reducing page load times by 40% and increasing engagement by 18%.",
          "Architected REST and GraphQL API services in Node.js, handling over 10M daily requests with 99.9% uptime.",
          "Mentored 4 junior developers and established code quality guidelines, improving sprint velocity by 15%."
        ]
      },
      {
        company: "Innovate Web Corp",
        title: "Software Engineer",
        dates: "2021 - 2023",
        bullets: [
          "Developed reusable UI component library using React and Tailwind CSS, reducing front-end development time by 30%.",
          "Integrated third-party payment gateways and authentication services securely using OAuth and Stripe APIs.",
          "Optimized PostgreSQL queries, decreasing database response latencies by 25%."
        ]
      }
    ],
    seoContent: `If you are searching for a software engineer resume sample that truly works in the Indian job market, you have come to the right place. The technology sector in India is booming, with companies like Infosys, TCS, Wipro, and a growing number of product startups in Bengaluru, Hyderabad, Pune, and the Delhi NCR region competing fiercely for skilled engineers. A well-crafted resume is your first and most important tool to break through applicant tracking systems and land interviews at top firms. This page provides a complete software engineer resume example tailored for Indian recruiters, along with actionable advice on how to structure your experience, highlight your technical stack, and quantify your impact.

Software engineering roles in India span a wide spectrum, from frontend specialists working with React and Angular to full-stack developers who handle everything from database design to deployment on AWS. Recruiters look for proficiency in modern languages like JavaScript, TypeScript, Python, and Java, as well as experience with cloud platforms, CI/CD pipelines, and agile methodologies. Your resume must reflect both depth in a specific area and breadth across the software development lifecycle. The sample above demonstrates how to present your work history in a way that showcases your contributions through measurable outcomes such as reduced load times, improved uptime, and faster delivery cycles.

One of the biggest mistakes Indian software engineers make is using a generic, one-size-fits-all resume. Instead, you should tailor your resume for each application by mirroring the keywords found in the job description. For example, if the role emphasizes microservices architecture, make sure your resume mentions your experience with Docker, Kubernetes, or service decomposition. If the company uses a particular stack like the MERN stack or Python with Django, lead with those technologies. The ATS-friendly format shown in this example uses clear section headings, bullet points, and a skills list that is easy for both machines and human recruiters to scan. Use this template as your starting point, customize the summary and experience bullets to match your own background, and you will dramatically increase your chances of getting shortlisted.`
  },
  "product-manager": {
    title: "Product Manager",
    summary: "Strategic Product Manager with 5+ years of experience leading cross-functional teams to launch SaaS products. Proven success in product lifecycle management, user research, and data-driven decisions.",
    skills: ["Product Roadmap", "User Research", "Agile/Scrum", "Data Analytics", "SQL", "Amplitude", "Jira", "A/B Testing"],
    experience: [
      {
        company: "CloudScale Systems",
        title: "Senior Product Manager",
        dates: "2022 - Present",
        bullets: [
          "Defined and executed product roadmap for enterprise security platform, increasing monthly active users (MAU) by 45% in 12 months.",
          "Spearheaded user research and feedback loops, resulting in a revamped onboarding flow that cut user churn by 22%.",
          "Coordinated product launches with engineering, design, and marketing teams in an agile environment."
        ]
      },
      {
        company: "AppSphere Ventures",
        title: "Associate Product Manager",
        dates: "2020 - 2022",
        bullets: [
          "Owned product lifecycle for mobile application analytics feature, generating $150K in incremental annual recurring revenue (ARR).",
          "Wrote detailed PRDs, managed product backlogs, and prioritized user stories based on business impact and technical effort."
        ]
      }
    ],
    seoContent: `The product manager role has emerged as one of the most sought-after careers in India's technology ecosystem. From flipkart and Ola to unicorn startups in Bengaluru and B2B SaaS companies in Pune, every organization needs product managers who can bridge the gap between customer needs, business strategy, and engineering execution. This page offers a complete product manager resume example designed to help you stand out in the competitive Indian job market. Whether you are an aspiring associate PM or an experienced senior product leader, the sample above demonstrates how to structure your experience, highlight your strategic impact, and present your skills in a format that passes ATS filters and impresses hiring managers.

Product management is not a role that can be defined by a single set of responsibilities. Depending on the company and the product maturity stage, a PM may be involved in user research, competitive analysis, feature prioritization, sprint planning, stakeholder communication, and go-to-market strategy. The common thread across all these activities is the ability to make data-informed decisions and rally cross-functional teams around a shared vision. In India, where the product management community is still maturing, demonstrating a strong track record of shipped features, improved metrics, and cross-team collaboration can set you apart from hundreds of other applicants. The resume example above shows how to communicate these achievements through concrete numbers like percentage improvements in user engagement, reductions in churn, and revenue generated.

When applying for product management roles in India, it is crucial to understand the specific expectations of different types of companies. Product-based startups look for PMs who can operate with high autonomy and comfort with ambiguity. Large enterprises like Amazon, Google, and Microsoft in India prefer PMs who excel at stakeholder management, data analysis, and structured thinking. Consulting firms and product studios value PMs who can quickly ramp up on new domains and communicate effectively with clients. Whichever path you choose, your resume should reflect the specific skills and mindset that the role demands. Use the sample format provided here, customize your summary to reflect your unique value proposition, and always lead with your most impactful results. With the right resume, you can land interviews at India's best product companies and take your career to the next level.`
  },
  "data-analyst": {
    title: "Data Analyst",
    summary: "Analytical Data Analyst with 3+ years of experience translating complex datasets into actionable business insights. Highly skilled in Python, SQL, Tableau, and statistical modeling.",
    skills: ["SQL", "Python (Pandas/NumPy)", "Tableau", "PowerBI", "R", "Statistical Modeling", "A/B Testing", "Excel"],
    experience: [
      {
        company: "DataMetrics Partners",
        title: "Lead Data Analyst",
        dates: "2023 - Present",
        bullets: [
          "Designed and deployed Tableau dashboards for executive leadership, streamlining monthly KPI reporting processes and saving 10+ hours per week.",
          "Conducted comprehensive customer churn analysis, uncovering insights that informed retention strategies and saved $80K in revenue.",
          "Wrote complex SQL queries to clean, transform, and join data from multiple database structures."
        ]
      },
      {
        company: "Apex Retail Group",
        title: "Junior Data Analyst",
        dates: "2021 - 2023",
        bullets: [
          "Monitored and reported daily sales performance metrics, detecting anomalies and notifying stakeholders within hours.",
          "Assisted in configuring statistical tests for marketing A/B tests, ensuring mathematical validity."
        ]
      }
    ],
    seoContent: `Data analytics is one of the fastest-growing career fields in India, driven by the explosion of digital data across e-commerce, fintech, healthcare, and logistics sectors. Companies like Zomato, Swiggy, Razorpay, and Policybazaar rely heavily on data analysts to extract actionable insights that drive strategic decisions. If you are looking for a data analyst resume example that works in the Indian context, this page provides exactly what you need. The sample above follows a clean, ATS-optimized format that showcases your technical skills, analytical contributions, and business impact in a way that appeals to both automated screening systems and human recruiters.

A strong data analyst resume must demonstrate three things: technical proficiency with data tools, the ability to translate raw data into business narratives, and a track record of driving measurable outcomes. In the Indian job market, proficiency in SQL is non-negotiable, and experience with Python libraries like Pandas and NumPy is highly valued. Visualization tools such as Tableau and Power BI are also critical because Indian managers increasingly expect self-service analytics capabilities. The sample resume shows how to highlight these skills while also communicating the real-world value of your work, such as saving hours of manual reporting effort or identifying revenue-saving customer retention strategies.

One common challenge for data analysts in India is the wide range of role titles and expectations. Some companies advertise for data analysts but expect data engineering skills, while others want a blend of analytics and business strategy. Before applying, carefully read the job description to understand the specific technical and business requirements. Then tailor your resume accordingly, emphasizing the most relevant skills and experiences. The format used in this example is deliberately adaptable: you can reorder the skills, adjust the experience bullets, and customize the summary to align with the specific role you are targeting. Use this data analyst resume template as your foundation, invest time in personalizing it for each application, and you will significantly improve your chances of progressing through the interview pipeline at India's top analytics employers.`
  },
  "frontend-developer": {
    title: "Frontend Developer",
    summary: "Creative Frontend Developer with 4+ years of experience building responsive, user-centric web interfaces. Passionate about crafting pixel-perfect UIs with modern JavaScript frameworks and delivering seamless cross-browser experiences.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript (ES6+)", "REST APIs", "Git", "Figma"],
    experience: [
      {
        company: "WebFront Studios, Bangalore",
        title: "Senior Frontend Developer",
        dates: "2023 - Present",
        bullets: [
          "Architected responsive dashboards used by 50,000+ daily active users using React and TypeScript, improving load speed by 35%.",
          "Led migration from legacy jQuery codebase to React 18, reducing maintenance overhead by 60% and enabling faster feature delivery.",
          "Collaborated with UI/UX designers to create a reusable component library, cutting design-to-development handoff time by 40%."
        ]
      },
      {
        company: "Digitize India Pvt. Ltd., Mumbai",
        title: "Frontend Developer",
        dates: "2021 - 2023",
        bullets: [
          "Developed landing pages and interactive web portals for fintech products using Next.js and Tailwind CSS, achieving 98+ Lighthouse scores.",
          "Integrated Google Maps and payment gateway APIs into the company's flagship e-commerce platform serving 2M+ monthly visitors."
        ]
      }
    ],
    seoContent: `Frontend development is at the heart of the modern web experience, and in India, the demand for skilled frontend engineers has never been higher. Companies ranging from early-stage startups in Bengaluru to established product firms like Zerodha, Nykaa, and Myntra are constantly seeking developers who can build fast, accessible, and visually stunning user interfaces. If you are searching for a frontend developer resume example that captures what Indian recruiters look for, this page is your ideal starting point. The sample above demonstrates how to present your technical expertise in JavaScript frameworks, your experience with responsive design and performance optimization, and your ability to collaborate with designers and backend teams.

The frontend technology landscape evolves rapidly, and your resume must reflect that you stay current. In 2024 and beyond, Indian companies are prioritizing React and Next.js for web applications, along with TypeScript for type safety, and Tailwind CSS for rapid styling. Familiarity with state management libraries like Redux or Zustand, testing frameworks like Jest and Cypress, and build tools like Webpack or Vite can give you a significant edge. The sample resume highlights these competencies in a clear, scannable format that helps recruiters quickly assess whether your skill set matches their requirements. It also demonstrates how to frame your contributions in terms of business outcomes, such as improved performance scores, faster handoff cycles, and reduced technical debt.

A common mistake among frontend developers in India is focusing exclusively on technology while neglecting the design collaboration and user experience aspects of the role. The best frontend engineers are those who understand design principles, can work effectively with Figma prototypes, and contribute to accessibility and usability decisions. Your resume should reflect this broader skill set. Use the structure provided in this example, adapt the experience section to showcase your own projects and accomplishments, and make sure every bullet point communicates a specific, quantifiable contribution. With a focused and well-structured frontend developer resume, you can capture the attention of hiring teams at India's most innovative technology companies and secure the role you deserve.`
  },
  "backend-developer": {
    title: "Backend Developer",
    summary: "Results-driven Backend Developer with 5+ years of experience designing scalable APIs and microservices. Proficient in Node.js, Python, database optimization, and cloud-native architectures on AWS.",
    skills: ["Node.js", "Python (FastAPI)", "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS (EC2/S3/Lambda)", "gRPC"],
    experience: [
      {
        company: "CloudNest Technologies, Hyderabad",
        title: "Senior Backend Developer",
        dates: "2022 - Present",
        bullets: [
          "Designed and deployed a microservices architecture handling 15M+ daily API calls with sub-100ms p99 latency on AWS ECS.",
          "Built real-time data processing pipelines using Python FastAPI and Redis streams, reducing batch processing time from 4 hours to 12 minutes.",
          "Optimized PostgreSQL schemas and query patterns, cutting database costs by 30% and improving read throughput by 50%."
        ]
      },
      {
        company: "CodeForge Solutions, Pune",
        title: "Backend Developer",
        dates: "2020 - 2022",
        bullets: [
          "Developed RESTful APIs for a SaaS CRM platform serving 500+ enterprise clients using Node.js and Express.",
          "Implemented JWT-based authentication, role-based access control, and audit logging compliant with Indian data privacy regulations."
        ]
      }
    ],
    seoContent: `Backend developers form the backbone of India's technology industry, building the server-side systems that power everything from UPI payments to food delivery logistics. If you are a Node.js, Python, or Java developer looking for a backend developer resume example tailored to the Indian job market, this page offers exactly what you need. The sample above demonstrates how to showcase your ability to design scalable APIs, optimize database performance, and deploy cloud-native solutions using AWS, Docker, and microservices architecture. Indian companies like Razorpay, Cred, and Ola are particularly interested in backend engineers who can handle high-throughput systems with low latency and high reliability.

The most effective backend developer resumes go beyond listing programming languages and frameworks. They tell a story about how you solved real engineering challenges. Did you reduce API response times? Did you design a database schema that scaled from thousands to millions of users? Did you implement caching strategies that cut costs? The sample resume uses specific metrics to answer these questions, demonstrating the kind of impact-driven communication that hiring managers in India value. Whether you are applying to a product startup in Bengaluru, a fintech company in Mumbai, or a SaaS firm in Hyderabad, your resume should lead with measurable achievements that prove your technical depth and your ability to deliver results.

India's backend development market is highly competitive, with skilled engineers available across every major city. To stand out, you need to demonstrate proficiency in the specific technologies that your target company uses. If the job description mentions Kubernetes and Kafka, make sure your resume includes relevant experience, even if it was part of a side project or a smaller-scale implementation. The format used in this example is designed to be easily customizable: you can reorder skills, add or remove experience entries, and adjust the summary to align with each unique opportunity. Use this backend developer resume template as your base, invest time in research and personalization, and watch your interview call rate improve dramatically.`
  },
  "devops-engineer": {
    title: "DevOps Engineer",
    summary: "Experienced DevOps Engineer with 5+ years of expertise in CI/CD automation, cloud infrastructure, and container orchestration. Specializes in reducing deployment friction and improving system reliability at scale.",
    skills: ["Docker", "Kubernetes", "Terraform", "AWS (EKS/EC2)", "GitHub Actions", "Prometheus/Grafana", "Linux", "Ansible"],
    experience: [
      {
        company: "InfraMax Labs, Bengaluru",
        title: "Senior DevOps Engineer",
        dates: "2022 - Present",
        bullets: [
          "Designed and managed multi-cluster Kubernetes infrastructure on AWS EKS supporting 200+ microservices with 99.99% uptime.",
          "Automated CI/CD pipelines using GitHub Actions and ArgoCD, reducing deployment time from 45 minutes to under 8 minutes.",
          "Implemented Prometheus/Grafana monitoring stack with custom alerting, reducing mean time to detection (MTTD) by 70%."
        ]
      },
      {
        company: "StartupScale, Delhi NCR",
        title: "DevOps Engineer",
        dates: "2020 - 2022",
        bullets: [
          "Migrated legacy monolith infrastructure to Docker containers and orchestrated with Kubernetes, reducing server costs by 40%.",
          "Wrote Terraform modules to provision AWS resources as immutable infrastructure, enabling reproducible staging and production environments."
        ]
      }
    ],
    seoContent: `The DevOps engineer role has become indispensable in India's technology landscape as more companies adopt cloud-native architectures and continuous delivery practices. From unicorn startups in Bengaluru to large enterprises in Mumbai and Gurugram, organizations are investing heavily in infrastructure automation, monitoring, and reliability engineering. If you are looking for a DevOps engineer resume example that reflects the expectations of Indian employers, you have found the right resource. The sample above demonstrates how to effectively communicate your expertise in containerization, orchestration, CI/CD pipelines, infrastructure as code, and observability using industry-standard tools.

DevOps in India is not just about knowing a set of tools; it is about embodying a culture of automation, collaboration, and continuous improvement. The best DevOps engineers understand software development workflows, can communicate effectively with development teams, and design systems that balance speed with stability. Your resume should highlight specific achievements like reduced deployment times, improved system uptime, cost savings through infrastructure optimization, and faster incident response. The sample uses quantifiable metrics across all experience entries to demonstrate this kind of impact, giving you a proven template to follow when crafting your own resume.

As the DevOps field matures in India, employers are looking for engineers who have hands-on experience with Kubernetes in production, not just in lab environments. They also value expertise in HashiCorp tools like Terraform and Vault, monitoring stacks like Prometheus and Grafana, and cloud platforms such as AWS, Azure, or GCP. The skills section of your resume should reflect these priorities, and your experience bullets should provide concrete examples of your work. Use the structure shown in this example, customize the content to reflect your unique career journey, and ensure every section communicates your ability to build and maintain reliable infrastructure at scale. A strong DevOps resume will open doors at India's most technologically advanced companies.`
  },
  "data-scientist": {
    title: "Data Scientist",
    summary: "Data Scientist with 4+ years of experience applying machine learning to solve complex business problems. Expertise in predictive modeling, NLP, deep learning, and deploying models into production on cloud platforms.",
    skills: ["Python", "TensorFlow/PyTorch", "Scikit-learn", "SQL", "Apache Spark", "MLflow", "AWS SageMaker", "Statistics"],
    experience: [
      {
        company: "InsightAI Corp, Bengaluru",
        title: "Senior Data Scientist",
        dates: "2023 - Present",
        bullets: [
          "Developed a demand forecasting model using gradient boosting and time-series techniques, reducing inventory costs by $2M annually.",
          "Built NLP pipelines for sentiment analysis on customer feedback data, processing 500K+ records weekly with 92% accuracy.",
          "Deployed ML models into production using MLflow and AWS SageMaker, ensuring automated retraining and drift monitoring."
        ]
      },
      {
        company: "DataWorks Analytics, Mumbai",
        title: "Data Scientist",
        dates: "2021 - 2023",
        bullets: [
          "Created churn prediction models for a telecom client using ensemble methods, increasing retention by 15% and saving $1.2M in annual revenue.",
          "Designed A/B test frameworks and statistical hypothesis tests to evaluate the impact of product feature changes."
        ]
      }
    ],
    seoContent: `Data science is one of the most exciting and highest-paying career paths in India's technology sector, with demand spanning e-commerce, fintech, healthcare, and edtech industries. Companies like Flipkart, Swiggy, Byju's, and Paytm are building sophisticated machine learning systems to power recommendations, fraud detection, personalized content, and operational optimization. If you are searching for a data scientist resume example that meets the expectations of Indian recruiters, this page provides a complete, ATS-optimized template. The sample above demonstrates how to present your technical expertise in machine learning frameworks, your experience with production model deployment, and your ability to drive measurable business outcomes through data-driven solutions.

A compelling data scientist resume must balance technical depth with business storytelling. Recruiters want to see that you can build accurate models, but they are equally interested in how those models created real value. Did your recommendation engine increase conversion rates? Did your predictive maintenance model reduce downtime? Did your NLP system improve customer satisfaction scores? The sample resume answers these questions with specific, quantified achievements that make your contributions tangible and impressive. It also highlights familiarity with the MLOps lifecycle, including experiment tracking with MLflow and cloud deployment with AWS SageMaker, which is increasingly expected by Indian employers.

The data science job market in India is becoming more specialized, with roles ranging from computer vision engineers to NLP specialists to ML infrastructure engineers. Before you apply, carefully study the job description to understand which specific skills and domain knowledge are required. Then customize your resume to emphasize those areas while maintaining the clean, scannable format shown in this example. Whether you are a fresh graduate from an IIT or an experienced data scientist looking to move into a senior role, this resume template gives you a strong foundation. Invest the time to tailor it for each application, and you will significantly increase your chances of securing interviews at India's top data science employers.`
  },
  "ui-ux-designer": {
    title: "UI/UX Designer",
    summary: "User-centric UI/UX Designer with 4+ years of experience designing intuitive digital products. Skilled in user research, wireframing, prototyping, and visual design for web and mobile applications.",
    skills: ["Figma", "Adobe XD", "Sketch", "User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
    experience: [
      {
        company: "DesignCraft Agency, Delhi NCR",
        title: "Senior UI/UX Designer",
        dates: "2023 - Present",
        bullets: [
          "Redesigned the mobile banking app for a leading Indian fintech, improving user task completion rate by 28% and reducing drop-offs by 35%.",
          "Established a comprehensive design system with 200+ components in Figma, ensuring consistency across 4 product teams.",
          "Conducted usability testing sessions with 60+ users, translating qualitative insights into actionable design improvements."
        ]
      },
      {
        company: "PixelPerfect Labs, Bengaluru",
        title: "UI/UX Designer",
        dates: "2021 - 2023",
        bullets: [
          "Designed wireframes, high-fidelity mockups, and interactive prototypes for a SaaS HR platform used by 300+ companies.",
          "Collaborated with product managers and developers in agile sprints, ensuring design feasibility and pixel-perfect implementation."
        ]
      }
    ],
    seoContent: `UI and UX design has evolved from a nice-to-have to a critical competitive differentiator for digital products in India. As more Indian consumers access services through mobile apps and websites, companies across every sector are investing heavily in design talent. From fintech apps like PhonePe and Groww to e-commerce platforms like Meesho and Ajio, great design drives user adoption, retention, and brand loyalty. If you are searching for a UI UX designer resume example that resonates with Indian employers, this page offers a comprehensive template. The sample above demonstrates how to showcase your design process, your proficiency with industry tools, and your ability to deliver measurable improvements in user experience.

A standout design portfolio alone is not enough; your resume must tell the story behind your design work. Recruiters want to understand your approach to user research, how you translate insights into wireframes and prototypes, and how your designs performed in the real world. The sample resume uses concrete metrics like improved task completion rates, reduced drop-offs, and faster handoff cycles to demonstrate the business impact of design. It also highlights experience with design systems, which is particularly valued by Indian product companies that manage multiple products or platforms simultaneously.

The design tools landscape in India is dominated by Figma, with Sketch and Adobe XD also in use at some organizations. Beyond tool proficiency, employers look for designers who understand accessibility principles, can collaborate effectively with engineers, and have experience with usability testing methodologies. The skills section in this example reflects these priorities, and the experience bullets provide a model for communicating your unique contributions. Use this template as your starting point, customize the content to reflect your personal design philosophy and past projects, and ensure every section reinforces your value as a user-centered designer. With the right resume, you can land design roles at India's most exciting product companies.`
  },
  "marketing-manager": {
    title: "Marketing Manager",
    summary: "Strategic Marketing Manager with 6+ years of experience driving brand growth and demand generation in B2B SaaS markets. Expert in digital marketing, content strategy, campaign analytics, and team leadership.",
    skills: ["Digital Marketing", "Content Strategy", "SEO/SEM", "Google Analytics", "CRM (HubSpot)", "Email Marketing", "Social Media Marketing", "Campaign Analytics"],
    experience: [
      {
        company: "GrowthMax Marketing, Mumbai",
        title: "Senior Marketing Manager",
        dates: "2022 - Present",
        bullets: [
          "Developed and executed multi-channel marketing strategy that grew organic traffic by 180% and increased MQLs by 120% year-over-year.",
          "Led a team of 8 marketers across content, SEO, and paid channels, managing a quarterly budget of $500K with 4.5x average ROAS.",
          "Launched account-based marketing (ABM) campaigns targeting enterprise accounts, generating $3M in pipeline revenue."
        ]
      },
      {
        company: "BrandElevate Pvt. Ltd., Delhi NCR",
        title: "Marketing Manager",
        dates: "2020 - 2022",
        bullets: [
          "Managed end-to-end product launches for 3 SaaS products, coordinating press releases, webinars, and paid ad campaigns.",
          "Optimized Google Ads and LinkedIn campaigns, reducing cost-per-lead by 35% while maintaining lead quality scores above 90%."
        ]
      }
    ],
    seoContent: `Marketing management in India has undergone a massive transformation, driven by digital adoption, the rise of D2C brands, and the growing sophistication of B2B SaaS companies. Marketing managers in India today are expected to be data-literate, multi-channel strategists who can drive measurable business outcomes. From Freshworks and Zoho to Urban Company and CRED, top Indian companies need marketing leaders who understand brand building, demand generation, and performance marketing. If you are looking for a marketing manager resume example that works in the Indian context, this page provides the perfect template. The sample above demonstrates how to present your strategic thinking, your experience with digital channels, and your ability to lead teams and manage budgets effectively.

The best marketing manager resumes in India focus on outcomes rather than activities. Instead of saying you managed social media accounts, show how your campaigns increased engagement by a specific percentage. Instead of listing the tools you used, explain how you leveraged analytics to optimize spend and improve ROAS. The sample resume follows this impact-driven approach, with every bullet point tied to a measurable result. It also demonstrates experience with account-based marketing and enterprise sales support, which is particularly relevant for B2B marketers targeting India's growing SaaS ecosystem.

India's marketing landscape is unique in its diversity of languages, cultural contexts, and consumer behaviors. Employers value marketers who can adapt global best practices to local markets while maintaining brand consistency. Your resume should highlight any experience with regional campaigns, multilingual content, or India-specific channels like WhatsApp marketing and regional language SEO. Use the format shown in this example, customize the content to reflect your specific achievements and domain experience, and ensure your summary clearly communicates your unique value proposition. With a strong marketing manager resume, you can position yourself for leadership roles at India's most dynamic brands and technology companies.`
  },
  "hr-manager": {
    title: "HR Manager",
    summary: "Dynamic HR Manager with 6+ years of experience in talent acquisition, employee relations, performance management, and HR operations. Passionate about building inclusive workplace cultures and driving organizational growth.",
    skills: ["Talent Acquisition", "Employee Relations", "Performance Management", "HRMS (Darwinbox/Keka)", "Payroll & Compliance", "Learning & Development", "HR Analytics", "Labor Laws (India)"],
    experience: [
      {
        company: "PeopleFirst Solutions, Bengaluru",
        title: "Senior HR Manager",
        dates: "2023 - Present",
        bullets: [
          "Led end-to-end hiring for a 400-person tech company, reducing average time-to-hire from 45 days to 22 days through structured interview panels.",
          "Designed and implemented a performance management framework aligned with quarterly OKRs, increasing employee engagement scores by 18%.",
          "Ensured full compliance with Indian labour laws (PF, ESI, gratuity, POSH) across all states of operation with zero audit findings."
        ]
      },
      {
        company: "TalentBridge Consulting, Mumbai",
        title: "HR Manager",
        dates: "2020 - 2023",
        bullets: [
          "Managed recruitment for 50+ mid-to-senior level positions annually across engineering, product, and sales functions.",
          "Launched an employee wellness program that improved retention rates by 12% and reduced sick leave usage by 20%."
        ]
      }
    ],
    seoContent: `Human resources management in India has evolved far beyond payroll and compliance to become a strategic partner in organizational growth. With the rapid expansion of India's startup ecosystem and the increasing complexity of labour regulations across states, the demand for skilled HR managers has never been higher. Companies like Zomato, Swiggy, Unacademy, and Razorpay are investing heavily in HR technology and people analytics to build world-class workplaces. If you are searching for an HR manager resume example that reflects the realities of the Indian employment landscape, this page is your definitive resource. The sample above demonstrates how to present your expertise in talent acquisition, performance management, compliance, and employee engagement in a format that resonates with Indian employers.

A powerful HR manager resume must balance operational excellence with strategic vision. Indian companies are looking for HR leaders who can not only manage day-to-day HR operations but also design systems that drive organizational effectiveness. The sample resume highlights achievements across the full HR spectrum, from reducing time-to-hire and improving engagement scores to ensuring flawless regulatory compliance with Indian labour laws including PF, ESI, gratuity, and the POSH Act. It also demonstrates experience with modern HRMS platforms like Darwinbox and Keka, which are widely used across Indian enterprises.

The HR landscape in India varies significantly between industries. Tech startups value agility and culture building, manufacturing companies prioritize compliance and industrial relations, and financial services firms focus on talent development and succession planning. When crafting your resume, research your target companies and tailor your experience bullets to address their specific priorities. Use the template provided in this example as a foundation, customize the skills section to match your strongest areas, and ensure your summary communicates your unique blend of operational capability and strategic thinking. A well-crafted HR manager resume will open doors to rewarding opportunities at India's most progressive employers.`
  },
  "business-analyst": {
    title: "Business Analyst",
    summary: "Detail-oriented Business Analyst with 4+ years of experience bridging the gap between business needs and technology solutions. Skilled in requirements gathering, process mapping, data analysis, and stakeholder management.",
    skills: ["Requirements Gathering", "Process Mapping (BPMN)", "SQL", "Excel (Advanced)", "Jira", "Tableau", "Agile/Scrum", "Stakeholder Management"],
    experience: [
      {
        company: "ProcessWise Consulting, Pune",
        title: "Senior Business Analyst",
        dates: "2023 - Present",
        bullets: [
          "Led requirements discovery for a $2M ERP implementation project, conducting 40+ stakeholder interviews and mapping 60+ business processes.",
          "Created detailed BRDs, functional specifications, and user stories that reduced development rework by 25% during the build phase.",
          "Analyzed sales and operations data using SQL and Excel to identify process bottlenecks, recommending changes that saved $500K annually."
        ]
      },
      {
        company: "TechBridge Solutions, Hyderabad",
        title: "Business Analyst",
        dates: "2021 - 2023",
        bullets: [
          "Collaborated with product and engineering teams in agile ceremonies to translate business requirements into technical specifications.",
          "Built Tableau dashboards tracking project delivery KPIs, enabling stakeholders to monitor progress and identify risks proactively."
        ]
      }
    ],
    seoContent: `The business analyst role serves as a critical bridge between business stakeholders and technology teams in India's fast-growing corporate landscape. From IT services giants like TCS and Infosys to product startups and consulting firms, organizations across every sector rely on business analysts to translate complex business requirements into actionable technical specifications. If you are searching for a business analyst resume example tailored to the Indian job market, this page offers exactly what you need. The sample above demonstrates how to showcase your analytical skills, your experience with requirements gathering and process mapping, and your ability to drive business value through data-driven recommendations.

A standout business analyst resume must communicate both analytical rigor and business acumen. Indian employers look for candidates who can conduct thorough stakeholder interviews, document clear business requirements, and use data analysis to inform decision-making. The sample resume uses specific examples such as mapping 60+ business processes for a major ERP implementation, reducing development rework through better specifications, and saving costs through process optimization. These concrete achievements demonstrate the kind of impact that hiring managers value when evaluating candidates for business analyst positions.

The business analyst role in India spans multiple industries with varying expectations. In IT services, BAs are expected to work closely with offshore teams and produce detailed documentation. In product companies, BAs often take on product ownership responsibilities and work in agile environments. In consulting, BAs need strong presentation skills and the ability to synthesize findings quickly. Your resume should reflect the specific context of your target roles while following the clean, achievement-oriented format shown in this example. Use this template as your starting point, personalize the content to reflect your industry experience and domain knowledge, and ensure your summary communicates your unique combination of analytical and communication skills. A well-crafted business analyst resume will help you stand out in India's competitive job market.`
  },
  "graphic-designer": {
    title: "Graphic Designer",
    summary: "Creative Graphic Designer with 4+ years of experience crafting compelling visual identities and marketing collateral. Proficient in Adobe Creative Suite, with a strong portfolio in branding, print, and digital design.",
    skills: ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Figma", "Typography", "Branding & Identity", "Print Design", "Motion Graphics (After Effects)"],
    experience: [
      {
        company: "VisualCraft Studio, Delhi NCR",
        title: "Senior Graphic Designer",
        dates: "2023 - Present",
        bullets: [
          "Designed visual identity systems for 15+ startups, including logos, brand guidelines, and marketing collateral that increased brand recall by 40%.",
          "Created print and digital campaign assets for a national-level product launch, managing a production pipeline of 200+ creative deliverables.",
          "Introduced motion graphics and animated social media content using After Effects, boosting social engagement rates by 65%."
        ]
      },
      {
        company: "CreateMedia Agency, Mumbai",
        title: "Graphic Designer",
        dates: "2021 - 2023",
        bullets: [
          "Produced high-quality visual assets for email campaigns, website banners, brochures, and social media posts across 10+ client accounts.",
          "Collaborated with copywriters and art directors to develop cohesive campaign visuals aligned with brand guidelines and marketing objectives."
        ]
      }
    ],
    seoContent: `Graphic design is a vibrant and essential creative field in India, powering the visual identity of brands across e-commerce, entertainment, advertising, and technology sectors. From D2C brands like Mamaearth and boAt to media companies and advertising agencies in Mumbai and Delhi, skilled graphic designers are in high demand to create compelling visual content across print and digital platforms. If you are looking for a graphic designer resume example that captures what Indian employers want, this page provides a complete template. The sample above demonstrates how to present your proficiency with Adobe Creative Suite, your experience with branding and identity design, and your ability to deliver measurable results through creative work.

A strong graphic designer resume goes beyond listing software skills and describes the impact of your creative work. Indian recruiters want to see how your designs contributed to business outcomes such as increased brand recall, higher engagement rates, and successful product launches. The sample resume uses specific metrics to illustrate these contributions, showing how one designer's motion graphics work boosted social engagement by 65% and how a branding project improved brand recall by 40%. These quantified achievements make your resume more compelling and differentiate you from other candidates who simply list their technical skills.

The graphic design landscape in India demands versatility. Employers value designers who can work across media, from print brochures and packaging to social media graphics and motion design. Familiarity with Figma for UI design is increasingly important as more designers collaborate with product teams. Your resume should reflect this breadth of capability while also highlighting your areas of specialisation. Use the structure provided in this example, customize the experience section to showcase your most impressive projects, and always include a link to your online portfolio. A well-designed resume is itself a demonstration of your design sensibilities, so pay attention to the layout and visual hierarchy when presenting your credentials for graphic design roles in India.`
  },
  "content-writer": {
    title: "Content Writer",
    summary: "Versatile Content Writer with 4+ years of experience producing engaging, SEO-optimized content across B2B and B2C domains. Skilled in long-form articles, blog posts, website copy, and social media content.",
    skills: ["SEO Writing", "Blogging & Articles", "Copywriting", "Content Strategy", "WordPress", "Google Docs", "Research & Fact-Checking", "Grammar & Editing"],
    experience: [
      {
        company: "WordCraft Media, Bengaluru",
        title: "Senior Content Writer",
        dates: "2023 - Present",
        bullets: [
          "Developed content strategy and wrote 120+ SEO-optimized blog posts that grew organic traffic from 20K to 250K monthly visitors within 18 months.",
          "Produced whitepapers, case studies, and landing page copy for B2B SaaS clients, contributing to a 45% increase in demo request conversions.",
          "Managed a team of 5 freelance writers, establishing editorial guidelines and quality review processes that maintained a 4.8/5 content rating."
        ]
      },
      {
        company: "DigitalPulse Agency, Pune",
        title: "Content Writer",
        dates: "2021 - 2023",
        bullets: [
          "Wrote website copy, product descriptions, and email newsletters for e-commerce and tech brands, maintaining consistent brand voice across channels.",
          "Conducted in-depth research on industry topics and competitor content to produce authoritative articles ranking on page 1 of Google."
        ]
      }
    ],
    seoContent: `Content writing has emerged as a critical function in India's digital economy, with brands investing heavily in content marketing to attract, engage, and convert customers online. From SaaS companies like Freshworks and BrowserStack to e-commerce platforms and lifestyle brands, the demand for skilled content writers who can produce SEO-optimized, high-quality content has never been greater. If you are searching for a content writer resume example that works in the Indian context, this page is your ideal starting point. The sample above demonstrates how to showcase your versatility across content formats, your understanding of SEO best practices, and your ability to drive measurable traffic and conversion results.

A compelling content writer resume must demonstrate both creative writing ability and strategic thinking. Indian employers want writers who understand the business goals behind their content and can track and improve performance metrics. The sample resume highlights achievements like growing organic traffic from 20K to 250K monthly visitors, improving demo request conversions by 45%, and managing editorial teams with high quality ratings. These quantified accomplishments show that you are not just a writer but a content professional who delivers business value. The resume also emphasizes SEO writing and research skills, which are non-negotiable for content roles in India's competitive digital landscape.

The content writer role in India offers diverse opportunities across B2B and B2C domains. B2B writers need strong research skills and the ability to write authoritative, industry-specific content. B2C writers require a more creative and engaging style that resonates with consumer audiences. Some roles focus on long-form content like whitepapers and guides, while others prioritize short-form copy for social media and email. When tailoring your resume, align your experience bullets and skills with the specific content type and industry of your target role. Use the format provided in this example as your foundation, customize the summary and experience sections to reflect your unique voice and achievements, and you will have a resume that stands out to India's top employers.`
  },
  "sales-manager": {
    title: "Sales Manager",
    summary: "High-achieving Sales Manager with 7+ years of experience driving revenue growth in B2B technology sales. Proven track record of building and leading high-performance teams, exceeding quotas, and developing enterprise accounts.",
    skills: ["B2B Sales", "Enterprise Account Management", "Salesforce CRM", "Lead Generation", "Negotiation & Closing", "Sales Forecasting", "Team Leadership", "Channel Partnerships"],
    experience: [
      {
        company: "RevenueMax Systems, Gurugram",
        title: "Senior Sales Manager",
        dates: "2022 - Present",
        bullets: [
          "Led a team of 12 sales representatives covering North India, consistently exceeding quarterly targets by 25% and growing ARR from $4M to $8.5M.",
          "Closed 8 enterprise deals worth $1M+ each with Fortune 500 companies, managing complex multi-stakeholder sales cycles of 6-9 months.",
          "Implemented a structured sales methodology (MEDDIC) and Salesforce automation that improved win rates from 22% to 38%."
        ]
      },
      {
        company: "TechSales India, Mumbai",
        title: "Sales Manager",
        dates: "2019 - 2022",
        bullets: [
          "Managed a portfolio of 40+ mid-market accounts, achieving 140% quota attainment in FY2021 and generating $3.2M in new business revenue.",
          "Built and nurtured channel partner relationships with 15+ system integrators, expanding market reach into tier-2 Indian cities."
        ]
      }
    ],
    seoContent: `Sales management in India has become increasingly sophisticated, especially in the B2B technology sector where companies like Zoho, Freshworks, Postman, and Chargebee compete for enterprise accounts across the country. The role of a sales manager extends beyond individual selling to include team leadership, pipeline management, forecasting, and strategic account planning. If you are looking for a sales manager resume example that reflects the realities of India's B2B sales environment, this page offers a comprehensive template. The sample above demonstrates how to present your track record of exceeding quotas, building and leading teams, and developing strategic enterprise relationships.

A powerful sales manager resume in India must be built on concrete numbers. Indian hiring managers want to see your quota attainment percentages, the size of deals you have closed, the team sizes you have managed, and the revenue growth you have driven. The sample resume ticks all these boxes with specific metrics: exceeding quarterly targets by 25%, growing ARR from $4M to $8.5M, closing eight deals worth over $1M each, and achieving 140% quota attainment. These numbers instantly communicate your capability and make your resume stand out in a pile of applications. The resume also highlights methodology implementation and CRM automation, showing that you bring more than just selling skills to the table.

The B2B sales landscape in India spans multiple segments, from selling to SMBs and mid-market companies to pursuing large enterprise accounts with six-to-nine-month sales cycles. Different companies require different sales approaches, and your resume should reflect the context of your target employer. If you are applying to a startup that needs you to build a sales function from scratch, emphasize your experience with channel partnerships and team building. If you are targeting an enterprise SaaS company, lead with your large deal experience and strategic account management skills. Use this sales manager resume template as your framework, customize the content to match your unique achievements, and ensure every section reinforces your ability to drive revenue growth.`
  },
  "financial-analyst": {
    title: "Financial Analyst",
    summary: "Analytical Financial Analyst with 4+ years of experience in financial modeling, valuation, budgeting, and investment analysis. Strong proficiency in Excel, financial statements interpretation, and data-driven decision support.",
    skills: ["Financial Modeling", "Excel (VBA/Power Query)", "Financial Statements", "Valuation (DCF/Comps)", "Bloomberg Terminal", "PowerBI", "Budgeting & Forecasting", "Risk Analysis"],
    experience: [
      {
        company: "Apex Financial Services, Mumbai",
        title: "Senior Financial Analyst",
        dates: "2023 - Present",
        bullets: [
          "Built comprehensive financial models for 6 M&A deals totaling $150M in transaction value, supporting C-suite decision-making with scenario analyses.",
          "Developed automated budgeting and forecasting dashboards in PowerBI and Excel, reducing monthly close cycle from 10 days to 3 days.",
          "Conducted discounted cash flow (DCF) and comparable company analyses for equity research reports covering 20+ publicly listed Indian companies."
        ]
      },
      {
        company: "CapitalWise Consulting, Bengaluru",
        title: "Financial Analyst",
        dates: "2021 - 2023",
        bullets: [
          "Prepared quarterly earnings summaries, variance analyses, and board-level financial presentations for a portfolio of client companies.",
          "Assisted in due diligence for 10+ private equity investments, including financial statement analysis, KPI benchmarking, and risk assessment."
        ]
      }
    ],
    seoContent: `Financial analysis is a cornerstone of decision-making in India's corporate and financial services sectors, spanning investment banking, equity research, corporate finance, and asset management. From the financial districts of Mumbai's Bandra Kurla Complex to Bengaluru's corporate offices, skilled financial analysts are essential for evaluating investments, building financial models, and supporting strategic decisions. If you are searching for a financial analyst resume example that meets the expectations of Indian employers, this page provides the complete template you need. The sample above demonstrates how to present your expertise in financial modeling, valuation techniques, budgeting, and data analysis in a format that resonates with recruiters at banks, consulting firms, and corporate finance departments.

A standout financial analyst resume must demonstrate technical proficiency with numbers and the ability to communicate complex financial insights clearly. Indian employers value candidates who are certified or trained in financial modeling, familiar with Indian accounting standards and SEBI regulations, and experienced with tools like Bloomberg Terminal and Power BI. The sample resume uses specific, quantified achievements to demonstrate these capabilities, including building models for M&A deals totaling $150M, reducing the monthly close cycle from ten days to three days, and conducting valuation analyses for 20+ listed Indian companies. These concrete examples provide hiring managers with immediate evidence of your competence.

The financial analyst role in India spans diverse sectors with different emphasis areas. In investment banking, the focus is on M&A modeling, due diligence, and deal execution. In equity research, the emphasis is on sector analysis, company valuation, and report writing. In corporate finance, the priorities are budgeting, forecasting, and variance analysis. Your resume should be tailored to reflect the specific demands of your target role while following the clean, achievement-oriented structure shown in this example. Use this template as your foundation, customize the skills and experience sections to match your unique background, and always lead with the most impressive and relevant accomplishments. A well-crafted financial analyst resume will help you secure interviews at India's top financial institutions and corporate finance teams.`
  }
};

// Generate static params for static site generation (optional, Next.js optimization)
export function generateStaticParams() {
  return Object.keys(roleData).map((role) => ({
    role,
  }));
}

interface Props {
  params: {
    role: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const roleName = params.role;
  const role = roleData[roleName];
  if (!role) {
    return {
      title: "Resume Example - rawcv",
    };
  }
  return {
    title: `${role.title} Resume Example & Guide | rawcv`,
    description: `Create a professional ${role.title} resume using our free ATS-safe template and examples. Optimize your resume with industry keywords and get hired.`,
  };
}

export default function ResumeExamplePage({ params }: Props) {
  const roleName = params.role;
  const role = roleData[roleName];

  if (!role) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-violet-200/40 via-blue-100/20 to-transparent dark:from-violet-900/20 dark:via-blue-900/10 blur-3xl" />
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-center md:text-left space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 uppercase">
              Resume Examples &amp; Guides
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-950 dark:text-white leading-tight">
              {role.title} Resume Guide &amp; Example
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
              Use this ATS-friendly resume sample and build guide to stand out to hiring managers and pass applicant tracking systems.
            </p>
          </div>
          <div className="md:col-span-4 hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-violet-100 dark:border-violet-900/40 bg-white dark:bg-gray-900 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/resume_guide_illustration.png" 
                alt={`${role.title} Guide Illustration`} 
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Relevant to You - SEO Content Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-violet-50/80 to-white dark:from-violet-950/10 dark:to-gray-950 border border-violet-100 dark:border-violet-900/30 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-violet-600">✦</span> Relevant to you: {role.title} Career Guide for Indian Professionals
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
            {role.seoContent.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph.trim()}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Build Guide */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to write a {role.title} resume</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                When writing a resume for a {role.title} role, you must emphasize your technical skill set, quantifiable accomplishments, and projects. Use standard formats and highlight relevant keywords from the job description.
              </p>
            </div>

            {/* Tip 1 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-violet-600">01.</span> Write a strong summary
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Briefly introduce your professional background, main skill sets, and how you bring value. Mention your years of experience and key domains of expertise.
              </p>
            </div>

            {/* Tip 2 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-violet-600">02.</span> Highlight key skills
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                List the core platforms, programming languages, and methodologies you know. Group them logically so they are easy for recruiters and ATS machines to read.
              </p>
            </div>

            {/* Tip 3 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-violet-600">03.</span> Focus on achievements
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Instead of just listing tasks, quantify your bullets. For example, mention percentages, dollars, metrics, and size of databases or projects you worked with.
              </p>
            </div>

            {/* Interactive Builder Call-To-Action */}
            <div className="p-6 rounded-3xl bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Customize this resume with AI</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Open rawcv&apos;s free resume builder, choose your favorite layout, paste your details, and export a perfectly formatted PDF.
              </p>
              <Link
                href="/build"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Create with Free Builder
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Interactive Resume Template Example */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-violet-200 dark:border-violet-900/40 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Score: 98% ATS-Friendly ✅
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="font-bold text-lg text-gray-900 dark:text-white">JANE SMITH</div>
                <div className="text-xs text-gray-400 mt-1">jane.smith@example.com · (555) 123-4567 · San Francisco, CA</div>
              </div>

              {/* Summary section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wider uppercase">Professional Summary</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{role.summary}</p>
              </div>

              {/* Skills section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wider uppercase">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {role.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-700 dark:text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wider uppercase">Work Experience</h4>
                {role.experience.map((exp, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-900 dark:text-white">
                      <span>{exp.company} — {exp.title}</span>
                      <span className="text-gray-400">{exp.dates}</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {exp.bullets.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Navigation */}
      <section className="max-w-4xl mx-auto px-6 pt-12 border-t border-gray-100 dark:border-gray-800">
        <h3 className="text-center text-gray-500 dark:text-gray-400 font-semibold mb-6">Other Resume Examples</h3>
        <div className="flex justify-center flex-wrap gap-4">
          {Object.keys(roleData).map((r) => {
            if (r === roleName) return null;
            return (
              <Link
                key={r}
                href={`/resume-examples/${r}`}
                className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-850 text-sm transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 text-violet-600 dark:text-violet-400 font-semibold shadow-sm"
              >
                {roleData[r].title} Example
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}