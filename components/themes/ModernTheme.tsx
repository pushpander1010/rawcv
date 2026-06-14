import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";

interface Props {
  resume: ParsedResume;
}

export default function ModernTheme({ resume }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = resume;

  return (
    <div className="font-sans text-gray-900 bg-white max-w-[800px] mx-auto text-sm leading-relaxed flex">
      {/* Left sidebar */}
      <div className="w-64 bg-slate-800 text-white p-6 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-xl font-bold leading-tight mb-1">{contact.name}</h1>
          <div className="space-y-1 text-xs text-slate-300">
            {contact.email && <div><ContactLink value={contact.email} type="email" /></div>}
            {contact.phone && <div><ContactLink value={contact.phone} type="phone" /></div>}
            {contact.location && <div><ContactLink value={contact.location} type="location" /></div>}
            {contact.linkedin && <div><ContactLink value={contact.linkedin} type="linkedin" /></div>}
            {contact.website && <div><ContactLink value={contact.website} type="website" /></div>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 text-xs px-2 py-0.5 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-3">
                <div className="font-semibold text-xs">{edu.degree}</div>
                <div className="text-xs text-slate-300">{edu.field}</div>
                <div className="text-xs text-slate-400">{edu.institution}</div>
                <div className="text-xs text-slate-500">{edu.graduationYear}</div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Certifications</h2>
            <ul className="space-y-1">
              {certifications.map((cert, i) => (
                <li key={i} className="text-xs text-slate-300">{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
              About
            </h2>
            <div className="w-8 h-0.5 bg-blue-500 mb-3" />
            <p className="text-gray-600">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
              Experience
            </h2>
            <div className="w-8 h-0.5 bg-blue-500 mb-3" />
            {experience.map((job, i) => (
              <div key={i} className="mb-5">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-gray-900">{job.title}</span>
                  <span className="text-xs text-gray-400">{job.startDate} – {job.endDate}</span>
                </div>
                <div className="text-blue-600 font-medium text-xs mb-2">{job.company}</div>
                <ul className="space-y-1">
                  {job.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-gray-600">
                      <span className="text-blue-400 mt-1 flex-shrink-0">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
              Projects
            </h2>
            <div className="w-8 h-0.5 bg-blue-500 mb-3" />
            {projects.map((proj, i) => (
              <div key={i} className="mb-4">
                <div className="font-bold text-gray-900">{proj.name}</div>
                <p className="text-gray-600 mb-1">{proj.description}</p>
                <div className="flex flex-wrap gap-1">
                  {proj.technologies.map((tech, j) => (
                    <span key={j} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
