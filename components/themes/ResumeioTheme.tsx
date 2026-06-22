import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";

interface Props {
  resume: ParsedResume;
}

const ACCENT = "#2563eb";

export default function ResumeioTheme({ resume }: Props) {
  const { contact, photo, summary, experience, education, skills, certifications, projects, languages } = resume;

  const initials = contact.name
    ? contact.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

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
      {/* ── Photo header ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "24px 32px",
          background: "#f8fafc",
          borderBottom: "3px solid #2563eb",
        }}
      >
        {/* Photo */}
        {photo ? (
          <img
            src={photo}
            alt={contact.name}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
              border: "3px solid #2563eb",
            }}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 26,
              fontWeight: 600,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        )}

        {/* Name + Title */}
        <div>
          <div
            style={{
              fontFamily: "Inter, Arial, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 28,
              lineHeight: 1.1,
              color: "#000",
              marginBottom: 2,
            }}
          >
            {contact.name}
          </div>
          {experience[0]?.title && (
            <div style={{ color: ACCENT, fontSize: 15, fontWeight: 500, marginBottom: 8 }}>
              {experience[0].title}
            </div>
          )}

          {/* Contact row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px", fontSize: 12, color: "#555" }}>
            {contact.email && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT }}>✉</span> <ContactLink value={contact.email} type="email" />
              </span>
            )}
            {contact.phone && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT }}>☎</span> <ContactLink value={contact.phone} type="phone" />
              </span>
            )}
            {contact.location && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT }}>⌖</span> <ContactLink value={contact.location} type="location" />
              </span>
            )}
            {contact.linkedin && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT }}>in</span> <ContactLink value={contact.linkedin} type="linkedin" />
              </span>
            )}
            {contact.website && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT }}>🔗</span> <ContactLink value={contact.website} type="website" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 32px 28px" }}>

        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: 20 }}>
            <SectionHeading>Summary</SectionHeading>
            <p style={{ color: "#555", lineHeight: 1.7, margin: 0 }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <SectionHeading>Experience</SectionHeading>
            {experience.map((job, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 2,
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#000" }}>{job.title}</span>
                    <span style={{ color: ACCENT, fontSize: 13, fontWeight: 500, marginLeft: 6 }}>— {job.company}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#999", whiteSpace: "nowrap" }}>
                    {job.startDate} – {job.endDate}
                  </div>
                </div>
                <ul style={{ margin: "4px 0 0", padding: 0, listStyle: "none" }}>
                  {job.bullets.map((b, j) => (
                    <li key={j} style={{ display: "flex", gap: 6, marginBottom: 3, color: "#555", fontSize: 12 }}>
                      <span style={{ color: ACCENT, flexShrink: 0 }}>•</span>
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#000" }}>
                      {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                    </span>
                    <span style={{ color: ACCENT, fontSize: 13, marginLeft: 6 }}>— {edu.institution}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#999", whiteSpace: "nowrap" }}>{edu.graduationYear}</div>
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
                    background: "#eff6ff",
                    color: ACCENT,
                    fontSize: 12,
                    padding: "3px 12px",
                    borderRadius: 4,
                    border: "1px solid #bfdbfe",
                    fontWeight: 500,
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
                <div style={{ fontWeight: 600, fontSize: 13, color: "#000" }}>{proj.name}</div>
                <p style={{ fontSize: 12, color: "#666", margin: "2px 0 4px" }}>{proj.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {proj.technologies.map((tech, j) => (
                    <span key={j} style={{ fontSize: 10, color: ACCENT, background: "#eff6ff", padding: "1px 5px", borderRadius: 3 }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <SectionHeading>Languages</SectionHeading>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
              {languages.map((lang, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 500, fontSize: 13, color: "#333" }}>{lang.language}</span>
                  <span style={{ fontSize: 11, color: ACCENT, background: "#eff6ff", padding: "1px 8px", borderRadius: 10 }}>
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <SectionHeading>Certifications</SectionHeading>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {certifications.map((cert, i) => (
                <li key={i} style={{ fontSize: 12, color: "#555", marginBottom: 3, display: "flex", gap: 6 }}>
                  <span style={{ color: ACCENT }}>•</span> {cert}
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
        borderBottom: "2px solid #2563eb",
        paddingBottom: 4,
        marginBottom: 10,
        textTransform: "uppercase" as const,
        letterSpacing: 0.8,
      }}
    >
      {children}
    </div>
  );
}