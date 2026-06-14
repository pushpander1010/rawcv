import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";

interface Props {
  resume: ParsedResume;
}

export default function CreativeTheme({ resume }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = resume;

  return (
    <div className="font-sans text-gray-800 bg-white max-w-[800px] mx-auto text-sm leading-relaxed">
      {/* Header with accent */}
      <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-10 py-8">
        <h1 className="text-3xl font-bold mb-1">{contact.name}</h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-violet-200">
          {contact.email && (
            <span className="flex items-center gap-1">
              <span>✉</span> <ContactLink value={contact.email} type="email" />
            </span>
          )}
          {contact.phone && (
            <span className="flex items-center gap-1">
              <span>✆</span> <ContactLink value={contact.phone} type="phone" />
            </span>
          )}
          {contact.location && (
            <span className="flex items-center gap-1">
              <span>⌖</span> <ContactLink value={contact.location} type="location" />
            </span>
          )}
          {contact.linkedin && (
            <span className="flex items-center gap-1">
              <span>in</span> <ContactLink value={contact.linkedin} type="linkedin" />
            </span>
          )}
          {contact.website && (
            <span className="flex items-center gap-1">
              <span>⊕</span> <ContactLink value={contact.website} type="website" />
            </span>
          )}
        </div>
      </div>

      <div className="px-10 py-8">
        {/* Summary */}
        {summary && (
          <section className="mb-7">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0" />
              <h2 className="font-bold text-violet-700 uppercase tracking-widest text-xs">About Me</h2>
            </div>
            <p className="text-gray-600 pl-6">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0" />
              <h2 className="font-bold text-indigo-700 uppercase tracking-widest text-xs">Experience</h2>
            </div>
            <div className="pl-6 border-l-2 border-violet-100 space-y-5">
              {experience.map((job, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-violet-300 border-2 border-white" />
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-gray-900">{job.title}</span>
                    <span className="text-xs text-gray-400">{job.startDate} – {job.endDate}</span>
                  </div>
                  <div className="text-violet-600 font-medium text-xs mb-2">{job.company}</div>
                  <ul className="space-y-1">
                    {job.bullets.map((b, j) => (
                      <li key={j} className="text-gray-600 flex gap-2">
                        <span className="text-violet-300 flex-shrink-0">◆</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex gap-8">
          <div className="flex-1">
            {/* Education */}
            {education.length > 0 && (
              <section className="mb-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0" />
                  <h2 className="font-bold text-violet-700 uppercase tracking-widest text-xs">Education</h2>
                </div>
                {education.map((edu, i) => (
                  <div key={i} className="mb-3 pl-6">
                    <div className="font-semibold text-gray-900">{edu.degree} in {edu.field}</div>
                    <div className="text-indigo-600 text-xs">{edu.institution}</div>
                    <div className="text-xs text-gray-400">{edu.graduationYear}</div>
                  </div>
                ))}
              </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0" />
                  <h2 className="font-bold text-indigo-700 uppercase tracking-widest text-xs">Projects</h2>
                </div>
                {projects.map((proj, i) => (
                  <div key={i} className="mb-4 pl-6">
                    <div className="font-semibold text-gray-900">{proj.name}</div>
                    <p className="text-gray-600 mb-1">{proj.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map((tech, j) => (
                        <span key={j} className="bg-violet-50 text-violet-700 text-xs px-2 py-0.5 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div className="w-52 flex-shrink-0">
            {/* Skills */}
            {skills.length > 0 && (
              <section className="mb-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0" />
                  <h2 className="font-bold text-violet-700 uppercase tracking-widest text-xs">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-6">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gradient-to-r from-violet-100 to-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0" />
                  <h2 className="font-bold text-indigo-700 uppercase tracking-widest text-xs">Certifications</h2>
                </div>
                <ul className="space-y-1 pl-6">
                  {certifications.map((cert, i) => (
                    <li key={i} className="text-gray-600 text-xs">{cert}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
