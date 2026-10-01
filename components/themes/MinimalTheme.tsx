import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";
import { normalizeSectionOrder } from "@/lib/section-order";

interface Props {
  resume: ParsedResume;
}

export default function MinimalTheme({ resume }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = resume;
  const order = normalizeSectionOrder(resume.sectionOrder);

  return (
    <div className="font-sans text-gray-800 bg-white p-12 max-w-[800px] mx-auto text-sm leading-relaxed">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">{contact.name}</h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
          {contact.email && <ContactLink value={contact.email} type="email" />}
          {contact.phone && <ContactLink value={contact.phone} type="phone" />}
          {contact.location && <ContactLink value={contact.location} type="location" />}
          {contact.linkedin && <ContactLink value={contact.linkedin} type="linkedin" />}
          {contact.website && <ContactLink value={contact.website} type="website" />}
        </div>
      </div>

      {order.map((key) => {
        switch (key) {
          case "summary":
            return summary ? (
              <section key="summary" className="mb-7">
                <p className="text-gray-500 leading-relaxed">{summary}</p>
              </section>
            ) : null;
          case "experience":
            return experience.length > 0 ? (
              <section key="experience" className="mb-7">
                <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Experience</h2>
                {experience.map((job, i) => (
                  <div key={i} className="mb-5 flex gap-6">
                    <div className="w-28 flex-shrink-0 text-right">
                      <div className="text-xs text-gray-400 leading-tight">
                        {job.startDate}<br />–<br />{job.endDate}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-400 mb-2">{job.company}</div>
                      <ul className="space-y-1">
                        {job.bullets.map((b, j) => (
                          <li key={j} className="text-gray-600 pl-3 border-l border-gray-200">{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </section>
            ) : null;
          case "education":
            return education.length > 0 ? (
              <section key="education" className="mb-7">
                <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Education</h2>
                {education.map((edu, i) => (
                  <div key={i} className="mb-3 flex gap-6">
                    <div className="w-28 flex-shrink-0 text-right text-xs text-gray-400">{edu.graduationYear}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{edu.degree} in {edu.field}</div>
                      <div className="text-xs text-gray-400">{edu.institution}</div>
                    </div>
                  </div>
                ))}
              </section>
            ) : null;
          case "skills":
            return skills.length > 0 ? (
              <section key="skills" className="mb-7">
                <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            ) : null;
          case "projects":
            return projects && projects.length > 0 ? (
              <section key="projects" className="mb-7">
                <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Projects</h2>
                {projects.map((proj, i) => (
                  <div key={i} className="mb-4 flex gap-6">
                    <div className="w-28 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{proj.name}</div>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <p className="text-xs text-gray-400 mb-1">{proj.technologies.join(", ")}</p>
                      )}
                      <p className="text-gray-500">{proj.description}</p>
                    </div>
                  </div>
                ))}
              </section>
            ) : null;
          case "certifications":
            return certifications && certifications.length > 0 ? (
              <section key="certifications">
                <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Certifications</h2>
                <ul className="space-y-1">
                  {certifications.map((cert, i) => (
                    <li key={i} className="text-gray-500 pl-3 border-l border-gray-200">{cert}</li>
                  ))}
                </ul>
              </section>
            ) : null;
          default:
            return null;
        }
      })}
    </div>
  );
}
