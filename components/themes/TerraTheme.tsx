import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";

export default function TerraTheme({ resume }: { resume: ParsedResume }) {
  const { contact, summary, experience, education, skills, certifications, projects } = resume;

  return (
    <div className="font-serif text-gray-800 bg-[#fdf8f3] max-w-[800px] mx-auto text-sm leading-relaxed">
      {/* Header */}
      <div className="bg-[#8b4513] text-white px-10 py-8">
        <h1 className="text-3xl font-bold tracking-wide mb-2">{contact.name}</h1>
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-orange-200">
          {contact.email && <ContactLink value={contact.email} type="email" />}
          {contact.phone && <ContactLink value={contact.phone} type="phone" />}
          {contact.location && <ContactLink value={contact.location} type="location" />}
          {contact.linkedin && <ContactLink value={contact.linkedin} type="linkedin" />}
          {contact.website && <ContactLink value={contact.website} type="website" />}
        </div>
      </div>

      <div className="px-10 py-8">
        {summary && (
          <section className="mb-7">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b4513] mb-2">About</h2>
            <div className="h-px bg-[#d4956a] mb-3" />
            <p className="text-gray-600 italic">{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-7">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b4513] mb-2">Experience</h2>
            <div className="h-px bg-[#d4956a] mb-4" />
            {experience.map((job, i) => (
              <div key={i} className="mb-5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{job.title}</span>
                  <span className="text-xs text-gray-400 font-sans">{job.startDate} – {job.endDate}</span>
                </div>
                <div className="text-sm text-[#8b4513] font-semibold mb-2">{job.company}</div>
                <ul className="space-y-1">
                  {job.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-gray-600">
                      <span className="text-[#d4956a] flex-shrink-0 font-bold">›</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          <div>
            {education.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b4513] mb-2">Education</h2>
                <div className="h-px bg-[#d4956a] mb-3" />
                {education.map((edu, i) => (
                  <div key={i} className="mb-3">
                    <div className="font-bold text-gray-900">{edu.degree} in {edu.field}</div>
                    <div className="text-sm text-gray-500">{edu.institution}</div>
                    <div className="text-xs text-gray-400 font-sans">{edu.graduationYear}</div>
                  </div>
                ))}
              </section>
            )}
            {certifications && certifications.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b4513] mb-2">Certifications</h2>
                <div className="h-px bg-[#d4956a] mb-3" />
                <ul className="space-y-1">
                  {certifications.map((c, i) => <li key={i} className="text-gray-600 text-xs">{c}</li>)}
                </ul>
              </section>
            )}
          </div>
          <div>
            {skills.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b4513] mb-2">Skills</h2>
                <div className="h-px bg-[#d4956a] mb-3" />
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, i) => (
                    <span key={i} className="bg-[#f5e6d3] text-[#8b4513] text-xs px-2.5 py-1 rounded-full font-sans">{s}</span>
                  ))}
                </div>
              </section>
            )}
            {projects && projects.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b4513] mb-2">Projects</h2>
                <div className="h-px bg-[#d4956a] mb-3" />
                {projects.map((p, i) => (
                  <div key={i} className="mb-3">
                    <div className="font-bold text-gray-900">{p.name}</div>
                    <p className="text-xs text-gray-600">{p.description}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
