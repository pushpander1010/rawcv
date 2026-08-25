import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HowToSchema from "@/components/HowToSchema";

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
  },
  "project-manager": {
    title: "Project Manager",
    summary: "Certified Project Manager with 5+ years of experience delivering complex software and infrastructure projects on time and within budget. Skilled in Agile/Scrum, stakeholder management, risk mitigation, and cross-functional team leadership.",
    skills: ["Agile & Scrum", "Project Planning", "Risk Management", "Stakeholder Communication", "Jira", "Budget Management", "Resource Allocation", "PMP Certified"],
    experience: [
      {
        company: "TechNova Solutions, Bengaluru",
        title: "Senior Project Manager",
        dates: "2022 - Present",
        bullets: [
          "Led 12+ cross-functional projects worth $8M combined, achieving 95% on-time delivery and a 20% reduction in schedule slippage.",
          "Implemented Scrum ceremonies and sprint planning, boosting team velocity by 30% across 3 product squads.",
          "Managed stakeholder expectations across C-suite and engineering, presenting weekly status reports and risk registers."
        ]
      },
      {
        company: "InfraWorks Ltd., Pune",
        title: "Project Manager",
        dates: "2019 - 2022",
        bullets: [
          "Coordinated a 25-member team to deliver a cloud migration project two weeks ahead of schedule.",
          "Reduced project costs by 15% through vendor renegotiation and resource-leveling."
        ]
      }
    ],
    seoContent: `Project management has become one of the most in-demand professions across India's technology, construction, and infrastructure sectors. From IT services companies like TCS, Infosys, and Wipro to product startups in Bengaluru and large infrastructure projects in the Delhi NCR, skilled project managers are essential for delivering work on time, within budget, and to specification. If you are searching for a project manager resume example that reflects the expectations of Indian employers, this page provides the complete template you need. The sample above demonstrates how to present your project delivery record, your familiarity with Agile and Scrum methodologies, and your ability to manage stakeholders in a format that impresses both recruiters and applicant tracking systems.\n\nA standout project manager resume must demonstrate measurable delivery outcomes rather than a simple list of duties. Indian hiring managers look for evidence of projects shipped on time, budgets managed, teams led, and risks mitigated. The sample resume uses specific, quantified achievements such as leading twelve projects worth eight million dollars, reducing schedule slippage by twenty percent, and boosting team velocity by thirty percent. These concrete numbers give recruiters immediate proof of your competence and separate you from candidates who simply list responsibilities.\n\nThe project management role in India spans multiple industries, each with its own emphasis. In IT services, the focus is on Agile delivery, sprint management, and client communication. In construction and infrastructure, the priority is on timelines, safety, and vendor coordination. In product companies, project managers often blend product ownership with delivery management. Whichever path you follow, tailor your resume to mirror the keywords in the job description and lead with your most impressive quantifiable results. Use this template as your foundation, customize the summary and experience sections to match your own background, and you will dramatically improve your chances of landing interviews at India's top companies.`
  },
  "digital-marketing-manager": {
    title: "Digital Marketing Manager",
    summary: "Results-driven Digital Marketing Manager with 4+ years of experience in SEO, paid advertising, content strategy, and analytics. Proven track record of growing organic traffic, lowering customer acquisition costs, and driving measurable revenue.",
    skills: ["SEO & SEM", "Google Ads", "Meta Ads", "Content Marketing", "Google Analytics 4", "Email Marketing", "Marketing Automation", "Social Media Strategy"],
    experience: [
      {
        company: "GrowthLabs Digital, Gurugram",
        title: "Digital Marketing Manager",
        dates: "2022 - Present",
        bullets: [
          "Grew organic traffic from 20K to 250K monthly visitors through SEO and content strategy, a 12x increase in 18 months.",
          "Managed a ₹1.5 Cr annual paid media budget across Google and Meta, reducing CAC by 35% while scaling leads 2.5x.",
          "Launched email and WhatsApp marketing funnels that recovered 18% of abandoned carts and lifted repeat purchases by 22%."
        ]
      },
      {
        company: "BrandSpark Media, Mumbai",
        title: "Senior Marketing Executive",
        dates: "2020 - 2022",
        bullets: [
          "Executed paid social campaigns that generated 40K+ qualified leads at an average CPL under ₹40.",
          "Redesigned the content calendar around keyword clusters, increasing blog-driven conversions by 28%."
        ]
      }
    ],
    seoContent: `Digital marketing is one of the fastest-growing career tracks in India, driven by the rapid shift of businesses online and the explosion of e-commerce, D2C brands, and SaaS companies. From marketing agencies in Gurugram and Mumbai to in-house teams at consumer brands and technology companies, organizations need digital marketing managers who can plan campaigns, manage budgets, and prove return on investment. If you are searching for a digital marketing manager resume example tailored to the Indian job market, this page offers exactly what you need. The sample above demonstrates how to present your experience with SEO, paid advertising, content marketing, and analytics in a way that showcases measurable business impact.\n\nA compelling digital marketing resume must be built around numbers, because marketing is ultimately judged by results. Indian employers value candidates who can demonstrate growth in organic traffic, reductions in customer acquisition cost, improvements in conversion rates, and strong return on ad spend. The sample resume highlights achievements like growing organic traffic from twenty thousand to two hundred fifty thousand monthly visitors, reducing CAC by thirty-five percent, and managing an annual budget of one point five crore rupees. These quantified accomplishments prove that you are a revenue-focused marketer, not just someone who runs campaigns.\n\nThe digital marketing role in India offers diverse specializations, and your resume should reflect the one you are targeting. Performance marketers focus on paid channels and ROI, SEO specialists on organic search and content, and growth marketers on the full funnel. Some roles are brand-focused while others are strictly acquisition-focused. When tailoring your resume, align your experience bullets and skills with the specific channel and industry of your target role, mirror the keywords in the job description, and always lead with your strongest revenue impact. Use this template as your starting point and you will stand out to India's top marketing employers.`
  },
  "accountant": {
    title: "Accountant",
    summary: "Detail-oriented Accountant with 4+ years of experience in financial reporting, taxation, accounts payable and receivable, and statutory compliance. Proficient in Tally, SAP, and GST filing with a strong command of Indian accounting standards.",
    skills: ["Tally ERP", "GST Filing", "TDS Computation", "Financial Reporting", "Accounts Payable & Receivable", "SAP FICO", "Bank Reconciliation", "Indian Accounting Standards"],
    experience: [
      {
        company: "Sharma & Associates, New Delhi",
        title: "Senior Accountant",
        dates: "2022 - Present",
        bullets: [
          "Managed end-to-end accounting for 15+ SME clients, including monthly bookkeeping, GST returns, and TDS compliance with zero late-filing penalties.",
          "Streamlined the month-end close process, reducing reporting turnaround from 8 days to 3 days.",
          "Reconciled bank statements and ledgers worth ₹40 Cr annually, resolving discrepancies within 48 hours."
        ]
      },
      {
        company: "MetroRetail Pvt. Ltd., Noida",
        title: "Accountant",
        dates: "2020 - 2022",
        bullets: [
          "Processed accounts payable and receivable for a ₹60 Cr turnover business, improving vendor payment accuracy by 20%.",
          "Prepared financial statements and assisted in statutory audits, ensuring 100% compliance with Indian accounting standards."
        ]
      }
    ],
    seoContent: `Accounting remains one of the most stable and respected professions in India, with consistent demand across every industry from manufacturing and retail to IT services and professional consulting firms. Every organization, whether a small proprietorship or a large listed company, needs skilled accountants to manage bookkeeping, taxation, and statutory compliance. If you are searching for an accountant resume example that reflects the expectations of Indian employers, this page provides the complete template you need. The sample above demonstrates how to present your expertise in Tally and SAP, your command of GST and TDS regulations, and your ability to manage financial reporting in a format that resonates with recruiters.\n\nA strong accountant resume must demonstrate accuracy, compliance, and efficiency, because these are the qualities employers value most in finance professionals. Indian hiring managers look for evidence of clean GST filings, accurate bookkeeping, timely reporting, and familiarity with Indian accounting standards and the Income Tax Act. The sample resume uses specific, quantified achievements such as managing accounting for fifteen SME clients, reconciling ledgers worth forty crore rupees annually, and reducing month-end close time from eight days to three. These concrete examples provide immediate proof of your competence and reliability.\n\nThe accounting role in India spans diverse environments, each with its own emphasis. In chartered accountancy firms, the focus is on client bookkeeping, audit support, and tax compliance. In corporate finance teams, the priority is on financial reporting, budgeting, and internal controls. In small and medium businesses, accountants often wear multiple hats covering everything from payroll to statutory filings. Whichever path you follow, tailor your resume to reflect the specific tools and regulations relevant to your target employer, and lead with your most impressive quantifiable achievements. Use this template as your foundation and you will secure interviews at India's top finance and accounting firms.`
  },
  "chartered-accountant": {
    title: "Chartered Accountant",
    summary: "Qualified Chartered Accountant with 4+ years of experience in statutory audit, taxation, and financial advisory. Expertise in direct and indirect taxation, Ind AS/IFRS reporting, and internal controls, with a strong record of client delivery.",
    skills: ["Statutory Audit", "Direct & Indirect Taxation", "Ind AS / IFRS", "GST Advisory", "Internal Controls", "Financial Due Diligence", "Transfer Pricing", "Companies Act Compliance"],
    experience: [
      {
        company: "Deloitte India, Mumbai",
        title: "Assistant Manager - Audit & Assurance",
        dates: "2022 - Present",
        bullets: [
          "Led statutory audit engagements for 8 listed and unlisted clients with combined revenue of ₹2,500 Cr, delivering clean audit reports on schedule.",
          "Identified internal control weaknesses at a manufacturing client, recommending fixes that reduced inventory write-offs by ₹1.2 Cr.",
          "Mentored a team of 5 article assistants, improving engagement efficiency and audit quality review scores."
        ]
      },
      {
        company: "Khandelwal & Co. LLP, Jaipur",
        title: "Chartered Accountant",
        dates: "2020 - 2022",
        bullets: [
          "Prepared and filed GST and income tax returns for 40+ corporate and individual clients with zero compliance errors.",
          "Advised SMEs on GST structuring and input tax credit optimization, saving clients an average of ₹8 Lakh annually."
        ]
      }
    ],
    seoContent: `The Chartered Accountant qualification is widely regarded as the gold standard of finance and accounting credentials in India, opening doors to careers in audit, taxation, consulting, and corporate finance. From the Big Four firms like Deloitte, EY, KPMG, and PwC to mid-size practices and in-house finance teams at leading companies, qualified CAs are in constant demand across the country. If you are searching for a chartered accountant resume example that meets the high expectations of Indian employers, this page provides the complete template you need. The sample above demonstrates how to present your audit and taxation expertise, your command of Ind AS and IFRS, and your advisory capabilities in a format that impresses recruiters.\n\nA standout CA resume must communicate technical depth, client delivery, and professional credibility. Indian hiring managers look for evidence of successful audit engagements, clean tax compliance, strong knowledge of the Companies Act and Income Tax Act, and the ability to manage teams and client relationships. The sample resume uses specific, quantified achievements such as leading audits for clients with combined revenue of twenty-five hundred crore rupees, identifying control weaknesses that saved one point two crore rupees, and filing returns for forty plus clients with zero errors. These concrete results demonstrate the rigor and reliability that define a top-tier chartered accountant.\n\nThe career path for CAs in India is broad, spanning audit and assurance, taxation, corporate finance, investment banking, and entrepreneurship. In the Big Four, the emphasis is on audit quality, client management, and technical excellence. In industry, the focus shifts to financial planning, reporting, and business partnering. When tailoring your resume, align your experience with the specific domain you are targeting, highlight your technical specializations and any post-qualification certifications, and lead with quantifiable outcomes. Use this template as your foundation and you will position yourself strongly for roles at India's most prestigious firms and companies.`
  },
  "mechanical-engineer": {
    title: "Mechanical Engineer",
    summary: "Mechanical Engineer with 4+ years of experience in product design, manufacturing, and quality control. Proficient in SolidWorks, AutoCAD, and CNC programming with a strong foundation in thermodynamics and machine design.",
    skills: ["SolidWorks", "AutoCAD", "CNC Programming", "GD&T", "Thermodynamics", "Machine Design", "Six Sigma", "Manufacturing Processes"],
    experience: [
      {
        company: "Bharat Auto Components, Pune",
        title: "Senior Mechanical Engineer",
        dates: "2022 - Present",
        bullets: [
          "Designed and validated 15+ automotive components using SolidWorks and FEA analysis, reducing material cost by 18% while maintaining safety standards.",
          "Led a Six Sigma project that reduced production line defects by 22%, saving the plant ₹30 Lakh annually.",
          "Implemented CNC process improvements that increased machining throughput by 15%."
        ]
      },
      {
        company: "Precision Engineering Works, Chennai",
        title: "Mechanical Engineer",
        dates: "2020 - 2022",
        bullets: [
          "Prepared detailed manufacturing drawings and GD&T specifications for 50+ parts, reducing rework by 25%.",
          "Coordinated with vendors and the quality team to resolve dimensional issues, cutting rejection rates by 12%."
        ]
      }
    ],
    seoContent: `Mechanical engineering is one of India's most established and versatile engineering disciplines, powering industries from automotive and aerospace to energy, manufacturing, and heavy machinery. With major automotive hubs in Pune and Chennai, and manufacturing clusters across Gujarat, Maharashtra, and Tamil Nadu, skilled mechanical engineers are in steady demand throughout the country. If you are searching for a mechanical engineer resume example tailored to the Indian job market, this page provides the complete template you need. The sample above demonstrates how to present your design, manufacturing, and quality expertise in a format that resonates with recruiters at both engineering firms and manufacturing companies.\n\nA compelling mechanical engineering resume must demonstrate hands-on technical skills and measurable engineering outcomes. Indian employers value candidates proficient in CAD tools like SolidWorks and AutoCAD, familiar with manufacturing processes and GD&T, and experienced with quality methodologies like Six Sigma. The sample resume uses specific, quantified achievements such as designing fifteen automotive components, reducing material costs by eighteen percent, and cutting production defects by twenty-two percent. These concrete numbers provide immediate evidence of your engineering impact and separate you from candidates who simply list software skills.\n\nThe mechanical engineering field in India offers diverse career paths across design, manufacturing, quality, and maintenance. In product and design roles, the focus is on CAD modeling, simulation, and prototyping. In manufacturing, the priority is on process optimization, CNC operations, and production efficiency. In quality engineering, the emphasis is on inspection, standards compliance, and defect reduction. Whichever path you pursue, tailor your resume to highlight the specific tools, processes, and industries relevant to your target employer, and lead with quantifiable results. Use this template as your foundation and you will stand out in India's competitive engineering job market.`
  },
  "civil-engineer": {
    title: "Civil Engineer",
    summary: "Civil Engineer with 4+ years of experience in structural design, construction management, and site supervision. Proficient in AutoCAD, STAAD Pro, and project scheduling with a strong record of on-budget project delivery.",
    skills: ["AutoCAD", "STAAD Pro", "Structural Design", "Construction Management", "Project Scheduling", "Site Supervision", "Quantity Surveying", "AutoCAD Civil 3D"],
    experience: [
      {
        company: "L&T Construction, Hyderabad",
        title: "Senior Civil Engineer",
        dates: "2022 - Present",
        bullets: [
          "Supervised construction of a 12-storey commercial complex with a project value of ₹85 Cr, delivering the structure 3 weeks ahead of schedule.",
          "Prepared and reviewed structural drawings for 200+ RCC elements, ensuring 100% compliance with IS codes and safety standards.",
          "Coordinated with architects, contractors, and vendors, resolving 30+ site issues and reducing material wastage by 12%."
        ]
      },
      {
        company: "Srinivasa Constructions, Bengaluru",
        title: "Civil Engineer",
        dates: "2020 - 2022",
        bullets: [
          "Managed site execution for residential projects totaling 500,000 sq ft, maintaining zero safety incidents across 24 months.",
          "Prepared quantity surveys and cost estimates, reducing project budget overruns by 8%."
        ]
      }
    ],
    seoContent: `Civil engineering is the backbone of India's infrastructure growth, with the country investing heavily in roads, bridges, metro systems, housing, and commercial real estate. From large EPC contractors like L&T and Shapoorji Pallonji to regional builders and government infrastructure agencies, civil engineers are in constant demand across the nation. If you are searching for a civil engineer resume example tailored to the Indian job market, this page provides the complete template you need. The sample above demonstrates how to present your structural design, construction management, and site supervision experience in a format that impresses recruiters at both large contractors and boutique firms.\n\nA strong civil engineering resume must demonstrate technical competence and on-ground project delivery. Indian employers value candidates proficient in AutoCAD and STAAD Pro, familiar with IS codes and construction standards, and experienced in site supervision and project scheduling. The sample resume uses specific, quantified achievements such as supervising an eighty-five crore rupee commercial complex, preparing drawings for two hundred structural elements, and reducing material wastage by twelve percent. These concrete results provide immediate evidence of your ability to deliver projects on time and within budget.\n\nThe civil engineering field in India offers diverse career paths across design, construction, and project management. In design roles, the focus is on structural analysis, drafting, and specification. In construction, the priority is on site execution, contractor coordination, and quality control. In project management, the emphasis is on scheduling, budgeting, and stakeholder communication. Whichever path you pursue, tailor your resume to highlight the specific tools, codes, and project types relevant to your target employer, and lead with measurable outcomes. Use this template as your foundation and you will secure interviews at India's leading construction and infrastructure companies.`
  },
  "teacher": {
    title: "Teacher",
    summary: "Dedicated Teacher with 5+ years of experience in curriculum planning, classroom instruction, and student assessment. Skilled in creating engaging lesson plans and fostering an inclusive learning environment that drives academic growth.",
    skills: ["Curriculum Planning", "Classroom Management", "Lesson Planning", "Student Assessment", "Educational Technology", "Differentiated Instruction", "Parent Communication", "CBSE/ICSE Curriculum"],
    experience: [
      {
        company: "Green Valley Public School, New Delhi",
        title: "Senior Teacher - Science",
        dates: "2021 - Present",
        bullets: [
          "Taught Science to 120+ students across grades 8-10, improving average board exam scores by 18% over two years.",
          "Designed 40+ interactive lesson plans integrating smart-class technology, increasing student participation by 35%.",
          "Mentored 3 junior teachers and led the school's science exhibition, which won a district-level award."
        ]
      },
      {
        company: "Sunrise Academy, Jaipur",
        title: "Teacher",
        dates: "2019 - 2021",
        bullets: [
          "Delivered engaging lessons to 90+ students while maintaining a 95% parent satisfaction rating.",
          "Introduced formative assessment techniques that helped identify and support 15 struggling students."
        ]
      }
    ],
    seoContent: `Teaching is one of the most respected and stable professions in India, with consistent demand for qualified educators across CBSE, ICSE, state board, and international schools, as well as coaching institutes and ed-tech platforms. From metropolitan schools in Delhi, Mumbai, and Bengaluru to institutions in smaller cities and towns, skilled teachers shape the next generation and are always needed. If you are searching for a teacher resume example tailored to the Indian job market, this page provides the complete template you need. The sample above demonstrates how to present your classroom instruction, curriculum planning, and student assessment experience in a format that resonates with school administrators.\n\nA compelling teacher resume must demonstrate both pedagogical skill and measurable impact on student learning. Indian schools value candidates who can plan engaging lessons, manage classrooms effectively, integrate technology, and communicate with parents. The sample resume uses specific, quantified achievements such as improving board exam scores by eighteen percent, designing forty interactive lesson plans, and maintaining a ninety-five percent parent satisfaction rating. These concrete results prove that you are an effective educator, not just someone who delivers content.\n\nThe teaching profession in India offers diverse opportunities across subjects, grade levels, and institution types. In schools, the emphasis is on curriculum delivery, student outcomes, and classroom management. In coaching institutes, the focus is on exam preparation and results. In ed-tech companies, teachers create online content and deliver live classes. Whichever path you pursue, tailor your resume to highlight your subject expertise, teaching certifications, and student outcomes, and lead with measurable achievements. Use this template as your foundation and you will stand out to India's leading schools and educational institutions.`
  },
  "nurse": {
    title: "Nurse",
    summary: "Compassionate Registered Nurse with 4+ years of experience in patient care, clinical assessment, and care coordination. Skilled in medication administration, patient monitoring, and documentation with a focus on patient safety.",
    skills: ["Patient Care", "Medication Administration", "Clinical Assessment", "IV Therapy", "Patient Monitoring", "Wound Care", "Electronic Health Records", "Patient Education"],
    experience: [
      {
        company: "Apollo Hospitals, Chennai",
        title: "Senior Staff Nurse",
        dates: "2022 - Present",
        bullets: [
          "Delivered direct patient care to 12+ patients per shift in a 40-bed medical-surgical unit, maintaining a 98% patient satisfaction score.",
          "Administered medications and IV therapy following strict safety protocols, achieving zero medication errors over 18 months.",
          "Mentored 4 junior nurses and led infection control initiatives that reduced hospital-acquired infections by 15%."
        ]
      },
      {
        company: "Fortis Hospital, New Delhi",
        title: "Staff Nurse",
        dates: "2020 - 2022",
        bullets: [
          "Monitored patient vitals and documented care in EHR systems, supporting timely clinical decisions for 150+ patients monthly.",
          "Collaborated with physicians and care teams on treatment plans, improving patient discharge readiness scores by 20%."
        ]
      }
    ],
    seoContent: `Nursing is one of India's most respected and essential healthcare professions, with strong demand across hospitals, clinics, and community health settings, both domestically and internationally. From leading hospital chains like Apollo and Fortis to government health facilities and specialized care centers, skilled nurses are the backbone of patient care delivery. If you are searching for a nurse resume example tailored to the Indian job market, this page provides the complete template you need. The sample above demonstrates how to present your patient care, clinical assessment, and documentation skills in a format that resonates with healthcare recruiters.\n\nA strong nursing resume must demonstrate clinical competence, patient safety, and compassionate care. Indian and international employers alike value candidates with solid medication administration skills, accurate documentation, infection control awareness, and strong communication with patients and families. The sample resume uses specific, quantified achievements such as caring for twelve patients per shift with a ninety-eight percent satisfaction score, achieving zero medication errors over eighteen months, and reducing hospital-acquired infections by fifteen percent. These concrete results provide immediate evidence of your skill and reliability as a nurse.\n\nThe nursing profession offers diverse career paths across specializations and settings. In hospital medical-surgical units, the focus is on acute patient care and monitoring. In critical care, the emphasis is on advanced assessment and life support. In community health, nurses deliver preventive care and education. Many Indian nurses also pursue international opportunities in the UK, US, Australia, and the Gulf, where documentation skills and certifications like IELTS and NCLEX matter greatly. Whichever path you pursue, tailor your resume to highlight your specialization, certifications, and patient outcomes, and lead with measurable achievements. Use this template as your foundation and you will stand out to leading healthcare employers.`
  },
  "customer-service-representative": {
    title: "Customer Service Representative",
    summary: "Customer-focused professional with 3+ years of experience in customer support, issue resolution, and relationship management across voice and digital channels. Skilled in CRM tools and committed to high customer satisfaction.",
    skills: ["Customer Support", "CRM Software (Zendesk/Salesforce)", "Issue Resolution", "Call Handling", "Email & Chat Support", "Conflict Resolution", "Product Knowledge", "Customer Retention"],
    experience: [
      {
        company: "TechServe Solutions, Bengaluru",
        title: "Senior Customer Service Representative",
        dates: "2022 - Present",
        bullets: [
          "Resolved 70+ customer queries daily across voice, email, and chat, maintaining a 96% customer satisfaction (CSAT) score.",
          "Reduced average handling time by 20% while improving first-contact resolution rate from 78% to 88%.",
          "Handled escalations and retained at-risk customers, recovering ₹15 Lakh in annual recurring revenue."
        ]
      },
      {
        company: "ShopEase Pvt. Ltd., Gurugram",
        title: "Customer Support Executive",
        dates: "2021 - 2022",
        bullets: [
          "Processed 50+ orders and returns daily with 99% accuracy, reducing refund-related complaints by 25%.",
          "Documented customer feedback that informed two product improvements, reducing repeat tickets by 15%."
        ]
      }
    ],
    seoContent: `Customer service is one of the fastest-growing employment sectors in India, driven by the country's emergence as a global hub for business process outsourcing and customer experience management. From BPO companies in Bengaluru, Gurugram, and Pune to in-house support teams at e-commerce, fintech, and SaaS companies, skilled customer service professionals are in constant demand. If you are searching for a customer service representative resume example tailored to the Indian job market, this page provides the complete template you need. The sample above demonstrates how to present your support skills, CRM expertise, and customer satisfaction record in a format that resonates with recruiters.\n\nA compelling customer service resume must demonstrate communication skill, problem-solving ability, and a measurable impact on customer satisfaction and retention. Indian and international employers value candidates who can handle high query volumes, resolve issues on first contact, and use CRM tools like Zendesk and Salesforce effectively. The sample resume uses specific, quantified achievements such as resolving seventy queries daily with a ninety-six percent CSAT score, improving first-contact resolution from seventy-eight to eighty-eight percent, and recovering fifteen lakh rupees in annual revenue. These concrete numbers prove your value as a customer-facing professional.\n\nThe customer service field offers diverse career paths across voice, chat, email, and social media support. In BPO and call center roles, the focus is on query volume and resolution metrics. In in-house support teams, the emphasis is on product knowledge and customer retention. Many professionals progress into team leadership, quality assurance, or customer success roles. Whichever path you pursue, tailor your resume to highlight your channel expertise, CRM proficiency, and customer satisfaction metrics, and lead with quantifiable results. Use this template as your foundation and you will stand out to India's leading service and technology companies.`
  },
  "quality-assurance-engineer": {
    title: "Quality Assurance Engineer",
    summary: "Detail-oriented QA Engineer with 4+ years of experience in manual and automated testing of web and mobile applications. Proficient in Selenium, Cypress, and API testing with a strong focus on quality and release readiness.",
    skills: ["Manual Testing", "Selenium", "Cypress", "API Testing (Postman/REST Assured)", "Test Automation", "JIRA", "Agile Testing", "SQL"],
    experience: [
      {
        company: "SoftGrid Technologies, Pune",
        title: "Senior QA Engineer",
        dates: "2022 - Present",
        bullets: [
          "Built and maintained an automated test suite of 400+ test cases using Selenium and Cypress, reducing regression testing time by 60%.",
          "Identified and documented 120+ critical bugs pre-release, improving production quality and cutting post-release defects by 35%.",
          "Led API testing for 30+ REST endpoints using Postman, ensuring contract compliance across 3 microservices."
        ]
      },
      {
        company: "AppWorks Solutions, Hyderabad",
        title: "QA Engineer",
        dates: "2020 - 2022",
        bullets: [
          "Executed manual and automated tests across web and mobile apps, maintaining a 99% test execution rate per sprint.",
          "Collaborated with developers in an Agile environment, reducing bug turnaround time by 25%."
        ]
      }
    ],
    seoContent: `Quality assurance has become an essential function in India's booming software industry, with every product company, IT services firm, and startup investing in rigorous testing to ensure reliable releases. From technology hubs in Bengaluru, Pune, and Hyderabad to remote-first product teams, skilled QA engineers are in steady demand across the country. If you are searching for a quality assurance engineer resume example tailored to the Indian job market, this page provides the complete template you need. The sample above demonstrates how to present your manual and automated testing expertise, your API testing skills, and your impact on release quality in a format that resonates with recruiters.\n\nA strong QA resume must demonstrate both testing rigor and measurable impact on product quality. Indian employers value candidates proficient in automation tools like Selenium and Cypress, experienced with API testing using Postman or REST Assured, and familiar with Agile testing practices and defect tracking in JIRA. The sample resume uses specific, quantified achievements such as building an automated suite of four hundred test cases, reducing regression time by sixty percent, and cutting post-release defects by thirty-five percent. These concrete results prove that you are a quality-focused engineer who adds real value to the release process.\n\nThe QA field in India offers diverse career paths across manual testing, test automation, performance testing, and SDET (software development engineer in test) roles. In manual testing roles, the focus is on test case design and execution. In automation roles, the emphasis is on building and maintaining test frameworks. In SDET roles, QA engineers write production-grade code for test infrastructure. Whichever path you pursue, tailor your resume to highlight your tooling expertise, automation experience, and quality metrics, and lead with quantifiable outcomes. Use this template as your foundation and you will stand out in India's competitive software testing market.`
  },
  "cybersecurity-analyst": {
    title: "Cybersecurity Analyst",
    summary: "Security-focused analyst with 4+ years of experience in threat monitoring, vulnerability assessment, and incident response. Skilled in SIEM tools, network security, and security compliance frameworks.",
    skills: ["SIEM (Splunk/QRadar)", "Network Security", "Vulnerability Assessment", "Incident Response", "Firewall Management", "Penetration Testing", "SOC Operations", "ISO 27001 / NIST"],
    experience: [
      {
        company: "SecureNet Technologies, Bengaluru",
        title: "Senior Cybersecurity Analyst",
        dates: "2022 - Present",
        bullets: [
          "Monitored security events across a 5,000-endpoint environment using Splunk, detecting and containing 200+ threats annually.",
          "Led incident response for 15+ security incidents, reducing average containment time from 6 hours to 2 hours.",
          "Conducted quarterly vulnerability assessments, driving remediation that reduced critical vulnerabilities by 40%."
        ]
      },
      {
        company: "FinSecure Bank, Mumbai",
        title: "Security Analyst",
        dates: "2020 - 2022",
        bullets: [
          "Managed firewall and IDS/IPS systems protecting banking infrastructure, maintaining 99.99% security uptime.",
          "Supported ISO 27001 and RBI compliance audits, achieving zero major non-conformities across two audit cycles."
        ]
      }
    ],
    seoContent: `Cybersecurity has emerged as one of the most critical and fast-growing career fields in India, as organizations across banking, IT services, government, and e-commerce race to defend against an escalating threat landscape. From security operations centers in Bengaluru and Hyderabad to in-house security teams at banks and technology companies, skilled cybersecurity analysts are in urgent demand nationwide. If you are searching for a cybersecurity analyst resume example tailored to the Indian job market, this page provides the complete template you need. The sample above demonstrates how to present your threat monitoring, incident response, and vulnerability assessment experience in a format that impresses recruiters.\n\nA compelling cybersecurity resume must demonstrate technical depth and measurable impact on security posture. Indian employers value candidates experienced with SIEM tools like Splunk and QRadar, familiar with network security and firewall management, and knowledgeable about compliance frameworks like ISO 27001 and RBI guidelines. The sample resume uses specific, quantified achievements such as monitoring a five thousand endpoint environment, containing two hundred threats annually, and reducing average incident containment time from six hours to two. These concrete results prove your ability to protect an organization's critical assets.\n\nThe cybersecurity field offers diverse career paths across SOC analysis, penetration testing, security engineering, and governance risk and compliance (GRC). In SOC roles, the focus is on continuous monitoring and incident response. In penetration testing, the emphasis is on offensive security and vulnerability discovery. In GRC, the priority is on compliance, policy, and risk management. Whichever path you pursue, tailor your resume to highlight your specific security tooling, certifications like CEH or CISSP, and security metrics, and lead with quantifiable outcomes. Use this template as your foundation and you will stand out to India's leading security employers.`
  },
  "java-developer": {
    title: "Java Developer",
    summary: "Experienced Java Developer with 4+ years of experience building scalable backend services and enterprise applications. Proficient in Spring Boot, Hibernate, and microservices architecture with strong database skills.",
    skills: ["Java 8/11/17", "Spring Boot", "Hibernate/JPA", "Microservices", "REST APIs", "MySQL/PostgreSQL", "Docker", "AWS"],
    experience: [
      {
        company: "Infosys, Bengaluru",
        title: "Senior Java Developer",
        dates: "2022 - Present",
        bullets: [
          "Developed and maintained 10+ microservices using Spring Boot handling 2M+ daily requests with 99.95% availability.",
          "Optimized database queries and introduced caching with Redis, reducing API response times by 45%.",
          "Led the migration of a legacy monolith to microservices architecture, improving deployment frequency by 3x."
        ]
      },
      {
        company: "TechMinds Solutions, Chennai",
        title: "Java Developer",
        dates: "2020 - 2022",
        bullets: [
          "Built REST APIs for an e-commerce platform serving 500K+ users, integrating payment and inventory services.",
          "Wrote unit and integration tests using JUnit and Mockito, achieving 85% code coverage."
        ]
      }
    ],
    seoContent: `Java remains one of the most widely used programming languages in India's enterprise technology landscape, powering core banking systems, e-commerce platforms, and large-scale enterprise applications. From IT services giants like Infosys, TCS, and Wipro to product companies and fintech startups, skilled Java developers are among the most in-demand professionals in the country. If you are searching for a Java developer resume example tailored to the Indian job market, this page provides the complete template you need. The sample above demonstrates how to present your Spring Boot, microservices, and database expertise in a format that resonates with recruiters.\n\nA standout Java developer resume must demonstrate depth in the Java ecosystem and measurable impact on system performance and scalability. Indian employers value candidates proficient in Spring Boot and Hibernate, experienced with microservices architecture and REST API design, and comfortable with relational databases and cloud platforms. The sample resume uses specific, quantified achievements such as developing ten microservices handling two million daily requests, reducing API response times by forty-five percent, and tripling deployment frequency through a migration to microservices. These concrete results provide immediate evidence of your engineering capability.\n\nThe Java developer career path in India spans enterprise application development, microservices, and full-stack roles. In enterprise settings, the focus is on building and maintaining large-scale backend systems. In product companies, the emphasis is on scalability, performance, and modern cloud-native practices. Many Java developers also branch into DevOps, architecture, or technical leadership over time. Whichever path you pursue, tailor your resume to highlight your specific Java stack, cloud experience, and performance improvements, and lead with quantifiable outcomes. Use this template as your foundation and you will secure interviews at India's top technology companies.`
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
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white pb-20">
<HowToSchema name="How to use this resume example" description="Use this resume example to build your own in four steps." steps={[{ name: "Review the example", text: "Study the sample resume format for this role." }, { name: "Copy the structure", text: "Use the same sections and formatting for your own resume." }, { name: "Add your details", text: "Replace the sample content with your own experience and achievements." }, { name: "Tailor and download", text: "Tailor it to the job and download as a PDF." }]} />
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-center md:text-left space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-brand-100 text-brand-700 dark:text-brand-300 uppercase">
              Resume Examples &amp; Guides
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-950 leading-tight">
              {role.title} Resume Guide &amp; Example
            </h1>
            <p className="text-lg text-gray-500 dark:text-slate-300 max-w-2xl mx-auto md:mx-0">
              Use this ATS-friendly resume sample and build guide to stand out to hiring managers and pass applicant tracking systems.
            </p>
          </div>
          <div className="md:col-span-4 hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-brand-100 dark:border-brand-800 bg-white dark:bg-slate-900 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/resume_guide_illustration.jpg" 
                alt={`${role.title} Guide Illustration`} 
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Relevant to You - SEO Content Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-50 dark:from-slate-900/80 to-white dark:to-slate-900 border border-brand-100 dark:border-brand-800 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-brand-600">✦</span> Relevant to you: {role.title} Career Guide for Indian Professionals
          </h2>
          <div className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed space-y-3">
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
              <p className="text-sm text-gray-500 dark:text-slate-300 leading-relaxed">
                When writing a resume for a {role.title} role, you must emphasize your technical skill set, quantifiable accomplishments, and projects. Use standard formats and highlight relevant keywords from the job description.
              </p>
            </div>

            {/* Tip 1 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-brand-600">01.</span> Write a strong summary
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-300 leading-relaxed">
                Briefly introduce your professional background, main skill sets, and how you bring value. Mention your years of experience and key domains of expertise.
              </p>
            </div>

            {/* Tip 2 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-brand-600">02.</span> Highlight key skills
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-300 leading-relaxed">
                List the core platforms, programming languages, and methodologies you know. Group them logically so they are easy for recruiters and ATS machines to read.
              </p>
            </div>

            {/* Tip 3 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-brand-600">03.</span> Focus on achievements
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-300 leading-relaxed">
                Instead of just listing tasks, quantify your bullets. For example, mention percentages, dollars, metrics, and size of databases or projects you worked with.
              </p>
            </div>

            {/* Interactive Builder Call-To-Action */}
            <div className="p-6 rounded-3xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-800 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Customize this resume with AI</h3>
              <p className="text-xs text-gray-500 dark:text-slate-300 leading-relaxed">
                Open rawcv&apos;s free resume builder, choose your favorite layout, paste your details, and export a perfectly formatted PDF.
              </p>
              <Link
                href="/build"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Create with Free Builder
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Interactive Resume Template Example */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-brand-200 dark:border-brand-800 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Score: 98% ATS-Friendly ✅
              </div>

              <div className="border-b border-gray-200 dark:border-slate-700 pb-4">
                <div className="font-bold text-lg text-gray-900 dark:text-white">JANE SMITH</div>
                <div className="text-xs text-gray-400 dark:text-slate-500 mt-1">jane.smith@example.com · (555) 123-4567 · San Francisco, CA</div>
              </div>

              {/* Summary section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-brand-600 tracking-wider uppercase">Professional Summary</h4>
                <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">{role.summary}</p>
              </div>

              {/* Skills section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-brand-600 tracking-wider uppercase">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {role.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-[10px] text-gray-700 dark:text-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-600 tracking-wider uppercase">Work Experience</h4>
                {role.experience.map((exp, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-900 dark:text-white">
                      <span>{exp.company} — {exp.title}</span>
                      <span className="text-gray-400 dark:text-slate-500">{exp.dates}</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {exp.bullets.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="text-[10px] text-gray-500 dark:text-slate-300 leading-relaxed">
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
      <section className="max-w-4xl mx-auto px-6 pt-12 border-t border-gray-100 dark:border-slate-800">
        <h3 className="text-center text-gray-500 dark:text-slate-300 font-semibold mb-6">Other Resume Examples</h3>
        <div className="flex justify-center flex-wrap gap-4">
          {Object.keys(roleData).map((r) => {
            if (r === roleName) return null;
            return (
              <Link
                key={r}
                href={`/resume-examples/${r}`}
                className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 text-brand-600 font-semibold shadow-sm"
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