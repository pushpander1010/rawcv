import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";
import { normalizeSectionOrder } from "@/lib/section-order";

export default function SharpTheme({ resume }: { resume: ParsedResume }) {
  const { contact, summary, experience, education, skills, certifications, projects } = resume;
  const order = normalizeSectionOrder(resume.sectionOrder);
  const topSections = order.filter((k) => k === "summary" || k === "experience");
  const leftSections = order.filter((k) => k === "education" || k === "certifications");
  const rightSections = order.filter((k) => k === "skills" || k === "projects");

  return (
    <div className="font-sans text-gray-900 bg-white max-w-[800px] mx-auto text-sm leading-relaxed">
      {/* Header — full-width black bar with white text */}
      <div className="bg-black text-white px-10 py-7">
        <h1 className="text-3xl font-black tracking-tight uppercase mb-1">{contact.name}</h1>
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-gray-400 font-mono">
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
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 bg-black" />
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Summary</h2>
                  </div>
                  <p className="text-gray-600 pl-7">{summary}</p>
                </section>
              ) : null;
            case "experience":
              return experience.length > 0 ? (
                <section key="experience" className="mb-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 bg-black" />
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Experience</h2>
                  </div>
                  <div className="pl-7 space-y-5">
                    {experience.map((job, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline">
                          <span className="font-black text-base">{job.title}</span>
                          <span className="text-xs font-mono text-gray-400">{job.startDate} – {job.endDate}</span>
                        </div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{job.company}</div>
                        <ul className="space-y-1">
                          {job.bullets.map((b, j) => (
                            <li key={j} className="flex gap-2 text-gray-600">
                              <span className="font-black text-black flex-shrink-0">+</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;
            default:
              return null;
          }
        })}

        <div className="grid grid-cols-2 gap-8">
          <div>
            {leftSections.map((key) => {
              switch (key) {
                case "education":
                  return education.length > 0 ? (
                    <section key="education" className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-black" />
                        <h2 className="text-xs font-black uppercase tracking-[0.2em]">Education</h2>
                      </div>
                      <div className="pl-7 space-y-3">
                        {education.map((edu, i) => (
                          <div key={i}>
                            <div className="font-bold">{edu.degree} in {edu.field}</div>
                            <div className="text-xs text-gray-500">{edu.institution}</div>
                            <div className="text-xs font-mono text-gray-400">{edu.graduationYear}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null;
                case "certifications":
                  return certifications && certifications.length > 0 ? (
                    <section key="certifications">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-black" />
                        <h2 className="text-xs font-black uppercase tracking-[0.2em]">Certifications</h2>
                      </div>
                      <ul className="pl-7 space-y-1">
                        {certifications.map((c, i) => <li key={i} className="text-gray-600 text-xs">{c}</li>)}
                      </ul>
                    </section>
                  ) : null;
                default:
                  return null;
              }
            })}
          </div>
          <div>
            {rightSections.map((key) => {
              switch (key) {
                case "skills":
                  return skills.length > 0 ? (
                    <section key="skills" className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-black" />
                        <h2 className="text-xs font-black uppercase tracking-[0.2em]">Skills</h2>
                      </div>
                      <div className="pl-7 flex flex-wrap gap-1.5">
                        {skills.map((s, i) => (
                          <span key={i} className="border-2 border-black text-xs font-bold px-2 py-0.5">{s}</span>
                        ))}
                      </div>
                    </section>
                  ) : null;
                case "projects":
                  return projects && projects.length > 0 ? (
                    <section key="projects">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-black" />
                        <h2 className="text-xs font-black uppercase tracking-[0.2em]">Projects</h2>
                      </div>
                      <div className="pl-7 space-y-3">
                        {projects.map((p, i) => (
                          <div key={i}>
                            <div className="font-bold">{p.name}</div>
                            {p.technologies && p.technologies.length > 0 && (
                              <div className="text-xs text-gray-500 mb-0.5">{p.technologies.join(", ")}</div>
                            )}
                            <p className="text-xs text-gray-600">{p.description}</p>
                          </div>
                        ))}
                      </div>
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
