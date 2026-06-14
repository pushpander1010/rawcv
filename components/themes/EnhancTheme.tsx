import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";

interface Props {
  resume: ParsedResume;
}

const ACCENT = "#008cff";

export default function EnhancTheme({ resume }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = resume;

  const initials = contact.name
    ? contact.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div
      style={{
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
        color: "#111",
        background: "#fff",
        maxWidth: 800,
        margin: "0 auto",
        fontSize: 13,
        lineHeight: "1.4",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 32px 16px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {/* Name + title + contact */}
        <div>
          <div
            style={{
              fontFamily: "Rubik, Arial, Helvetica, sans-serif",
              fontWeight: 500,
              fontSize: 32,
              textTransform: "uppercase",
              letterSpacing: 1,
              lineHeight: 1,
              color: "#000",
              marginBottom: 4,
            }}
          >
            {contact.name}
          </div>
          {experience[0]?.title && (
            <div style={{ color: ACCENT, fontSize: 15, marginBottom: 10 }}>
              {experience[0].title}
            </div>
          )}
          {/* Contact row */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "#444" }}>
            {contact.phone && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT }}>☎</span> <ContactLink value={contact.phone} type="phone" />
              </span>
            )}
            {contact.email && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT }}>✉</span> <ContactLink value={contact.email} type="email" />
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

        {/* Avatar circle */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: ACCENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Rubik, Arial, sans-serif",
            fontSize: 24,
            fontWeight: 600,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
      </div>

      {/* ── Body: two columns ──────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 38%", gap: 0 }}>

        {/* Left main column */}
        <div style={{ padding: "20px 24px 24px 32px", borderRight: "1px solid #e5e7eb" }}>

          {/* Summary */}
          {summary && (
            <section style={{ marginBottom: 20 }}>
              <SectionHeading>Summary</SectionHeading>
              <p style={{ color: "#444", lineHeight: 1.6, margin: 0 }}>{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <SectionHeading>Experience</SectionHeading>
              {experience.map((job, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "Rubik, Arial, sans-serif", fontWeight: 500, fontSize: 15, color: "#000" }}>
                    {job.title}
                  </div>
                  <div style={{ color: ACCENT, fontSize: 13, marginBottom: 2 }}>{job.company}</div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>
                    {job.startDate} – {job.endDate}
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {job.bullets.map((b, j) => (
                      <li key={j} style={{ display: "flex", gap: 6, marginBottom: 3, color: "#444" }}>
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
            <section>
              <SectionHeading>Education</SectionHeading>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "Rubik, Arial, sans-serif", fontWeight: 500, fontSize: 15, color: "#000" }}>
                    {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                  </div>
                  <div style={{ color: ACCENT, fontSize: 13 }}>{edu.institution}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{edu.graduationYear}</div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ padding: "20px 24px 24px 20px" }}>

          {/* Skills */}
          {skills.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <SectionHeading>Skills</SectionHeading>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#f0f7ff",
                      color: "#1a6abf",
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 4,
                      border: "1px solid #cce0ff",
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
                  <div style={{ fontFamily: "Rubik, Arial, sans-serif", fontWeight: 500, fontSize: 14, color: "#000" }}>
                    {proj.name}
                  </div>
                  <p style={{ fontSize: 12, color: "#555", margin: "2px 0 4px" }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {proj.technologies.map((tech, j) => (
                      <span key={j} style={{ fontSize: 11, color: ACCENT, background: "#f0f7ff", padding: "1px 6px", borderRadius: 3 }}>
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
                    <span style={{ color: ACCENT }}>•</span> {cert}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "Rubik, Arial, Helvetica, sans-serif",
        fontWeight: 500,
        fontSize: 17,
        color: "#000",
        borderBottom: "2.5px solid #000",
        paddingBottom: 3,
        marginBottom: 12,
        textTransform: "uppercase" as const,
        letterSpacing: 0.5,
      }}
    >
      {children}
    </div>
  );
}
