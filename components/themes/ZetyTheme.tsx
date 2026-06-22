import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";

interface Props {
  resume: ParsedResume;
}

const ACCENT = "#2c3e50";

export default function ZetyTheme({ resume }: Props) {
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
      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: 800 }}>

        {/* ── Left Sidebar (dark) ──────────────────────────────────────────── */}
        <div
          style={{
            background: ACCENT,
            color: "#fff",
            padding: "32px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Photo circle */}
          {photo ? (
            <img
              src={photo}
              alt={contact.name}
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 20,
                border: "4px solid rgba(255,255,255,0.2)",
              }}
            />
          ) : (
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, Arial, sans-serif",
                fontSize: 36,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 20,
                border: "4px solid rgba(255,255,255,0.2)",
              }}
            >
              {initials}
            </div>
          )}

          {/* Name in sidebar */}
          <div
            style={{
              fontFamily: "Inter, Arial, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 22,
              textAlign: "center" as const,
              lineHeight: 1.2,
              color: "#fff",
              marginBottom: 2,
            }}
          >
            {contact.name}
          </div>
          {experience[0]?.title && (
            <div
              style={{
                color: "#95a5a6",
                fontSize: 13,
                fontWeight: 500,
                textAlign: "center" as const,
                marginBottom: 20,
                textTransform: "uppercase" as const,
                letterSpacing: 1,
              }}
            >
              {experience[0].title}
            </div>
          )}

          {/* Contact info in sidebar */}
          <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, marginBottom: 20 }}>
            <SidebarSectionTitle>Contact</SidebarSectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
              {contact.email && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#95a5a6", width: 16, textAlign: "center" as const, flexShrink: 0 }}>✉</span>
                  <span style={{ color: "#ddd", wordBreak: "break-all" as const }}>
                    <ContactLink value={contact.email} type="email" />
                  </span>
                </div>
              )}
              {contact.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#95a5a6", width: 16, textAlign: "center" as const, flexShrink: 0 }}>☎</span>
                  <span style={{ color: "#ddd" }}><ContactLink value={contact.phone} type="phone" /></span>
                </div>
              )}
              {contact.location && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#95a5a6", width: 16, textAlign: "center" as const, flexShrink: 0 }}>⌖</span>
                  <span style={{ color: "#ddd" }}><ContactLink value={contact.location} type="location" /></span>
                </div>
              )}
              {contact.linkedin && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#95a5a6", width: 16, textAlign: "center" as const, flexShrink: 0 }}>in</span>
                  <span style={{ color: "#ddd" }}><ContactLink value={contact.linkedin} type="linkedin" /></span>
                </div>
              )}
              {contact.website && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#95a5a6", width: 16, textAlign: "center" as const, flexShrink: 0 }}>🔗</span>
                  <span style={{ color: "#ddd", wordBreak: "break-all" as const }}>
                    <ContactLink value={contact.website} type="website" />
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Skills in sidebar */}
          {skills.length > 0 && (
            <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, marginBottom: 20 }}>
              <SidebarSectionTitle>Skills</SidebarSectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      color: "#ddd",
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 3,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages in sidebar */}
          {languages && languages.length > 0 && (
            <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
              <SidebarSectionTitle>Languages</SidebarSectionTitle>
              {languages.map((lang, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                  <span style={{ color: "#ddd" }}>{lang.language}</span>
                  <span style={{ color: "#95a5a6", fontSize: 11, textTransform: "capitalize" as const }}>{lang.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right main column ───────────────────────────────────────────── */}
        <div style={{ padding: "32px 28px" }}>

          {/* Summary */}
          {summary && (
            <section style={{ marginBottom: 24 }}>
              <MainSectionTitle>Professional Summary</MainSectionTitle>
              <p style={{ color: "#555", lineHeight: 1.7, margin: 0, fontSize: 12 }}>{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <MainSectionTitle>Experience</MainSectionTitle>
              {experience.map((job, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#000" }}>{job.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: ACCENT, fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                    <span>{job.company}</span>
                    <span style={{ fontSize: 11, color: "#999", fontWeight: 400 }}>
                      {job.startDate} – {job.endDate}
                    </span>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
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
            <section style={{ marginBottom: 24 }}>
              <MainSectionTitle>Education</MainSectionTitle>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#000" }}>
                    {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: ACCENT, fontSize: 13 }}>
                    <span>{edu.institution}</span>
                    <span style={{ fontSize: 11, color: "#999" }}>{edu.graduationYear}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <MainSectionTitle>Projects</MainSectionTitle>
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#000" }}>{proj.name}</div>
                  <p style={{ fontSize: 12, color: "#666", margin: "2px 0 4px" }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {proj.technologies.map((tech, j) => (
                      <span key={j} style={{ fontSize: 10, color: ACCENT, background: "#ecf0f1", padding: "1px 5px", borderRadius: 3 }}>
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
              <MainSectionTitle>Certifications</MainSectionTitle>
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
    </div>
  );
}

function SidebarSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#95a5a6",
        textTransform: "uppercase" as const,
        letterSpacing: 1.5,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function MainSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
        fontWeight: 600,
        fontSize: 14,
        color: ACCENT,
        borderBottom: "2px solid #ecf0f1",
        paddingBottom: 4,
        marginBottom: 12,
        textTransform: "uppercase" as const,
        letterSpacing: 0.8,
      }}
    >
      {children}
    </div>
  );
}