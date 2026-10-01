import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";
import { normalizeSectionOrder } from "@/lib/section-order";

interface Props {
  resume: ParsedResume;
}

export default function ExecutiveTheme({ resume }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = resume;
  const order = normalizeSectionOrder(resume.sectionOrder);
  const topSections = order.filter((k) => k === "summary" || k === "experience");
  const leftSections = order.filter((k) => k === "education" || k === "certifications");
  const rightSections = order.filter((k) => k === "skills" || k === "projects");

  return (
    <div className="font-sans text-gray-900 bg-white max-w-[800px] mx-auto text-sm leading-relaxed">
      {/* Header band */}
      <div className="bg-gray-900 text-white px-10 py-8">
        <h1 className="text-3xl font-bold tracking-wide mb-2">{contact.name}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-300">
          {contact.email && <ContactLink value={contact.email} type="email" />}
          {contact.phone && <ContactLink value={contact.phone} type="phone" />}
          {contact.location && <ContactLink value={contact.location} type="location" />}
          {contact.linkedin && <ContactLink value={contact.linkedin} type="linkedin" />}
          {contact.website && <ContactLink value={contact.website} type="website" />}
        </div>
      </div>

      <div className="px-10 py-8">
        {topSections.map((key) => {
          switch (key) {
            case "summary":
              return summary ? (
                <section key="summary" className="mb-7">
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-1">
                    Executive Summary
                  </h2>
                  <div className="h-0.5 bg-gray-900 mb-3" />
                  <p className="text-gray-600 leading-relaxed">{summary}</p>
                </section>
              ) : null;
            case "experience":
              return experience.length > 0 ? (
                <section key="experience" className="mb-7">
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-1">
                    Professional Experience
                  </h2>
                  <div className="h-0.5 bg-gray-900 mb-4" />
                  {experience.map((job, i) => (
                    <div key={i} className="mb-6">
                      <div className="flex justify-between items-start mb-0.5">
                        <div>
                          <span className="font-bold text-base text-gray-900">{job.title}</span>
                          <span className="text-gray-500 mx-2">·</span>
                          <span className="font-semibold text-gray-700">{job.company}</span>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                          {job.startDate} – {job.endDate}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {job.bullets.map((b, j) => (
                          <li key={j} className="flex gap-2 text-gray-600">
                            <span className="font-bold text-gray-900 flex-shrink-0">—</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              ) : null;
            default:
              return null;
          }
        })}

        {/* Two-column lower section */}
        <div className="flex gap-8">
          <div className="flex-1">
            {leftSections.map((key) => {
              switch (key) {
                case "education":
                  return education.length > 0 ? (
                    <section key="education" className="mb-7">
                      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-1">
                        Education
                      </h2>
                      <div className="h-0.5 bg-gray-900 mb-3" />
                      {education.map((edu, i) => (
                        <div key={i} className="mb-3">
                          <div className="font-semibold text-gray-900">{edu.degree} in {edu.field}</div>
                          <div className="text-gray-600">{edu.institution}</div>
                          <div className="text-xs text-gray-400">{edu.graduationYear}</div>
                        </div>
                      ))}
                    </section>
                  ) : null;
                case "certifications":
                  return certifications && certifications.length > 0 ? (
                    <section key="certifications">
                      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-1">
                        Certifications
                      </h2>
                      <div className="h-0.5 bg-gray-900 mb-3" />
                      <ul className="space-y-1">
                        {certifications.map((cert, i) => (
                          <li key={i} className="text-gray-600">{cert}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null;
                default:
                  return null;
              }
            })}
          </div>

          <div className="w-56 flex-shrink-0">
            {rightSections.map((key) => {
              switch (key) {
                case "skills":
                  return skills.length > 0 ? (
                    <section key="skills" className="mb-7">
                      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-1">
                        Core Competencies
                      </h2>
                      <div className="h-0.5 bg-gray-900 mb-3" />
                      <ul className="space-y-1">
                        {skills.map((skill, i) => (
                          <li key={i} className="text-gray-600 flex gap-2">
                            <span className="text-gray-400">›</span>
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null;
                case "projects":
                  return projects && projects.length > 0 ? (
                    <section key="projects">
                      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-1">
                        Key Projects
                      </h2>
                      <div className="h-0.5 bg-gray-900 mb-3" />
                      {projects.map((proj, i) => (
                        <div key={i} className="mb-3">
                          <div className="font-semibold text-gray-900">{proj.name}</div>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <p className="text-gray-500 text-xs mb-0.5">{proj.technologies.join(", ")}</p>
                          )}
                          <p className="text-gray-600 text-xs">{proj.description}</p>
                        </div>
                      ))}
                    </section>
                  ) : null;
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
