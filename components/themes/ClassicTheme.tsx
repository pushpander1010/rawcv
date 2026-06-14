import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";

interface Props {
  resume: ParsedResume;
}

export default function ClassicTheme({ resume }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = resume;

  return (
    <div className="font-serif text-gray-900 bg-white p-10 max-w-[800px] mx-auto text-sm leading-relaxed">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-wide uppercase mb-1">{contact.name}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
          {contact.email && <ContactLink value={contact.email} type="email" />}
          {contact.phone && <ContactLink value={contact.phone} type="phone" />}
          {contact.location && <ContactLink value={contact.location} type="location" />}
          {contact.linkedin && <ContactLink value={contact.linkedin} type="linkedin" />}
          {contact.website && <ContactLink value={contact.website} type="website" />}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-base font-bold uppercase tracking-widest border-b border-gray-400 mb-2 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-base font-bold uppercase tracking-widest border-b border-gray-400 mb-2 pb-1">
            Experience
          </h2>
          {experience.map((job, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{job.title}</span>
                <span className="text-xs text-gray-500">{job.startDate} – {job.endDate}</span>
              </div>
              <div className="text-gray-600 italic mb-1">{job.company}</div>
              <ul className="list-disc list-outside ml-5 space-y-0.5">
                {job.bullets.map((b, j) => (
                  <li key={j} className="text-gray-700">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-base font-bold uppercase tracking-widest border-b border-gray-400 mb-2 pb-1">
            Education
          </h2>
          {education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{edu.degree} in {edu.field}</span>
                <span className="text-xs text-gray-500">{edu.graduationYear}</span>
              </div>
              <div className="text-gray-600 italic">{edu.institution}</div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-base font-bold uppercase tracking-widest border-b border-gray-400 mb-2 pb-1">
            Skills
          </h2>
          <p className="text-gray-700">{skills.join(" · ")}</p>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-base font-bold uppercase tracking-widest border-b border-gray-400 mb-2 pb-1">
            Projects
          </h2>
          {projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="font-bold">{proj.name}</div>
              <p className="text-gray-700 mb-0.5">{proj.description}</p>
              <p className="text-xs text-gray-500">{proj.technologies.join(", ")}</p>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-base font-bold uppercase tracking-widest border-b border-gray-400 mb-2 pb-1">
            Certifications
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-0.5">
            {certifications.map((cert, i) => (
              <li key={i} className="text-gray-700">{cert}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
