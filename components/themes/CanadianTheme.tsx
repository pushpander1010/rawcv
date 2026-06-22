import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";

interface Props {
  resume: ParsedResume;
}

export default function CanadianTheme({ resume }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = resume;

  return (
    <div
      style={{
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
        color: "#222",
        background: "#fff",
        maxWidth: 800,
        margin: "0 auto",
        fontSize: 13,
        lineHeight: "1.4",
      }}
    >
      {/* ── Clean header — No photo, no personal details ─────────────────── */}
      <div
        style={{
          padding: "28px 32px 16px",
          borderBottom: "3px solid #cc2936",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, Arial, Helvetica, sans-serif",
            fontWeight: 700,
            fontSize: 28,
            color: "#000",
            lineHeight: 1.1,
            marginBottom: 2,
          }}
        >
          {contact.name}
        </div>
        {experience[0]?.title && (
          <div style={{ color: "#cc2936", fontSize: 15, fontWeight: 500, marginBottom: 8 }}>
            {experience[0].title}
          </div>
        )}

        {/* Contact info only — no location details beyond what's needed */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 12, color: "#555" }}>
          {contact.email && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "#cc2936" }}>✉</span> <ContactLink value={contact.email} type="email" />
            </span>
          )}
          {contact.phone && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "#cc2936" }}>☎</span> <ContactLink value={contact.phone} type="phone" />
            </span>
          )}
          {contact.linkedin && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "#cc2936" }}>in</span> <ContactLink value={contact.linkedin} type="linkedin" />
            </span>
          )}
          {contact.website && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "#cc2936" }}>🔗</span> <ContactLink value={contact.website} type="website" />
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: "0 32px 28px" }}>
        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: 20 }}>
            <SectionHeading>Professional Summary</SectionHeading>
            <p style={{ color: "#444", lineHeight: 1.6, margin: 0 }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <SectionHeading>Work Experience</SectionHeading>
            {experience.map((job, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#000" }}>{job.title}</span>
                    <span style={{ color: "#cc2936", fontSize: 13, marginLeft: 6 }}>— {job.company}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>
                    {job.startDate} – {job.endDate}
                  </div>
                </div>
                <ul style={{ margin: "4px 0 0", padding: 0, listStyle: "none" }}>
                  {job.bullets.map((b, j) => (
                    <li key={j} style={{ display: "flex", gap: 6, marginBottom: 3, color: "#444", fontSize: 12 }}>
                      <span style={{ color: "#cc2936", flexShrink: 0 }}>•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <SectionHeading>Education</SectionHeading>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#000" }}>
                      {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                    </span>
                    <span style={{ color: "#cc2936", fontSize: 13, marginLeft: 6 }}>— {edu.institution}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>{edu.graduationYear}</div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <SectionHeading>Skills</SectionHeading>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    background: "#fef0f0",
                    color: "#b31a28",
                    fontSize: 12,
                    padding: "3px 10px",
                    borderRadius: 3,
                    border: "1px solid #f5c6cb",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <SectionHeading>Projects</SectionHeading>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#000" }}>{proj.name}</div>
                <p style={{ fontSize: 12, color: "#555", margin: "2px 0 4px" }}>{proj.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {proj.technologies.map((tech, j) => (
                    <span key={j} style={{ fontSize: 11, color: "#b31a28", background: "#fef0f0", padding: "1px 6px", borderRadius: 3 }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <SectionHeading>Certifications</SectionHeading>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {certifications.map((cert, i) => (
                <li key={i} style={{ fontSize: 12, color: "#444", marginBottom: 4, display: "flex", gap: 6 }}>
                  <span style={{ color: "#cc2936" }}>•</span> {cert}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
        fontWeight: 600,
        fontSize: 14,
        color: "#000",
        borderBottom: "2px solid #cc2936",
        paddingBottom: 3,
        marginBottom: 10,
        textTransform: "uppercase" as const,
        letterSpacing: 0.5,
      }}
    >
      {children}
    </div>
  );
}