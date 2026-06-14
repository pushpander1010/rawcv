import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";

export default function NavyTheme({ resume }: { resume: ParsedResume }) {
  const { contact, summary, experience, education, skills, certifications, projects } = resume;

  return (
    <div className="font-sans text-gray-900 bg-white max-w-[800px] mx-auto text-sm leading-relaxed flex min-h-[1000px]">
      {/* Sidebar */}
      <div className="w-60 bg-[#0f2044] text-white flex-shrink-0 flex flex-col">
        <div className="px-6 py-8 border-b border-white/10">
          <h1 className="text-lg font-bold leading-tight mb-3">{contact.name}</h1>
          <div className="space-y-1 text-xs text-blue-200">
            {contact.email && <div className="flex gap-1.5 items-center"><span className="text-yellow-400">✉</span><ContactLink value={contact.email} type="email" /></div>}
            {contact.phone && <div className="flex gap-1.5 items-center"><span className="text-yellow-400">✆</span><ContactLink value={contact.phone} type="phone" /></div>}
            {contact.location && <div className="flex gap-1.5 items-center"><span className="text-yellow-400">⌖</span><ContactLink value={contact.location} type="location" /></div>}
            {contact.linkedin && <div className="flex gap-1.5 items-center"><span className="text-yellow-400">in</span><ContactLink value={contact.linkedin} type="linkedin" /></div>}
            {contact.website && <div className="flex gap-1.5 items-center"><span className="text-yellow-400">⊕</span><ContactLink value={contact.website} type="website" /></div>}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="px-6 py-5 border-b border-white/10">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 mb-3">Skills</h2>
            <div className="space-y-1.5">
              {skills.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                  <span className="text-xs text-blue-100">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="px-6 py-5 border-b border-white/10">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 mb-3">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-3">
                <div className="text-xs font-semibold text-white">{edu.degree}</div>
                <div className="text-xs text-blue-200">{edu.field}</div>
                <div className="text-xs text-blue-300">{edu.institution}</div>
                <div className="text-[10px] text-blue-400">{edu.graduationYear}</div>
              </div>
            ))}
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div className="px-6 py-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 mb-3">Certifications</h2>
            <ul className="space-y-1">
              {certifications.map((c, i) => <li key={i} className="text-xs text-blue-200">{c}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 px-8 py-8">
        {summary && (
          <section className="mb-7">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f2044] mb-1">Profile</h2>
            <div className="h-0.5 bg-yellow-400 w-10 mb-3" />
            <p className="text-gray-600">{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-7">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f2044] mb-1">Experience</h2>
            <div className="h-0.5 bg-yellow-400 w-10 mb-4" />
            {experience.map((job, i) => (
              <div key={i} className="mb-5 pl-3 border-l-2 border-yellow-400">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{job.title}</span>
                  <span className="text-xs text-gray-400">{job.startDate} – {job.endDate}</span>
                </div>
                <div className="text-xs font-semibold text-[#0f2044] mb-2">{job.company}</div>
                <ul className="space-y-1">
                  {job.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-gray-600 text-xs">
                      <span className="text-yellow-500 flex-shrink-0">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f2044] mb-1">Projects</h2>
            <div className="h-0.5 bg-yellow-400 w-10 mb-4" />
            {projects.map((p, i) => (
              <div key={i} className="mb-4">
                <div className="font-bold">{p.name}</div>
                <p className="text-gray-600 text-xs mb-1">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.technologies.map((t, j) => (
                    <span key={j} className="bg-blue-50 text-[#0f2044] text-[10px] px-2 py-0.5 rounded font-medium">{t}</span>
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
