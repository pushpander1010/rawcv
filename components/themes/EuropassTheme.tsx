import type { ParsedResume, LanguageProficiency } from "@/types";
import { ContactLink } from "./ContactLink";

interface Props {
  resume: ParsedResume;
}

const ACCENT = "#1a3a5c";
const PHOTO_SIZE = 100;

export default function EuropassTheme({ resume }: Props) {
  const { contact, photo, summary, experience, education, skills, certifications, projects, languages, format } = resume;

  const isEu = format === "eu";

  const levelLabel = (level: LanguageProficiency["level"]): string => {
    const map: Record<string, string> = {
      basic: "A1 - Basic",
      elementary: "A2 - Elementary",
      intermediate: "B1 - Intermediate",
      "upper-intermediate": "B2 - Upper Intermediate",
      advanced: "C1 - Advanced",
      fluent: "C2 - Proficient",
      native: "Native",
      bilingual: "Bilingual",
    };
    return map[level] ?? level;
  };

  const levelDots = (level: LanguageProficiency["level"]): number => {
    const map: Record<string, number> = {
      basic: 1,
      elementary: 2,
      intermediate: 3,
      "upper-intermediate": 4,
      advanced: 5,
      fluent: 6,
      native: 6,
      bilingual: 6,
    };
    return map[level] ?? 3;
  };

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
      {/* ── Header with photo ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "28px 32px 20px",
          borderBottom: "2px solid #1a3a5c",
          background: "#f4f7fa",
        }}
      >
        {/* Photo */}
        {photo ? (
          <img
            src={photo}
            alt={contact.name}
            style={{
              width: PHOTO_SIZE,
              height: PHOTO_SIZE,
              borderRadius: 4,
              objectFit: "cover",
              flexShrink: 0,
              border: "2px solid #1a3a5c",
            }}
          />
        ) : (
          <div
            style={{
              width: PHOTO_SIZE,
              height: PHOTO_SIZE,
              borderRadius: 4,
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 28,
              fontWeight: 600,
              color: "#fff",
              flexShrink: 0,
              border: "2px solid #1a3a5c",
            }}
          >
            {contact.name
              ? contact.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
              : "?"}
          </div>
        )}

        {/* Name + Title + Personal Details */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "Inter, Arial, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: 0.5,
              lineHeight: 1,
              color: "#000",
              marginBottom: 2,
            }}
          >
            {contact.name}
          </div>
          {experience[0]?.title && (
            <div style={{ color: ACCENT, fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
              {experience[0].title}
            </div>
          )}

          {/* Contact row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", fontSize: 12, color: "#444" }}>
            {contact.phone && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT, fontWeight: 600 }}>☎</span> <ContactLink value={contact.phone} type="phone" />
              </span>
            )}
            {contact.email && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT, fontWeight: 600 }}>✉</span> <ContactLink value={contact.email} type="email" />
              </span>
            )}
            {contact.location && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT, fontWeight: 600 }}>⌖</span> <ContactLink value={contact.location} type="location" />
              </span>
            )}
            {contact.linkedin && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT, fontWeight: 600 }}>in</span> <ContactLink value={contact.linkedin} type="linkedin" />
              </span>
            )}
            {contact.website && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: ACCENT, fontWeight: 600 }}>🔗</span> <ContactLink value={contact.website} type="website" />
              </span>
            )}
          </div>

          {/* Personal details for EU format (nationality, date of birth - shown as label placeholders) */}
          {isEu && (
            <div style={{ fontSize: 11, color: "#666", marginTop: 6, borderTop: "1px dashed #ccc", paddingTop: 6 }}>
              <span style={{ marginRight: 16 }}>📅 Date of Birth: [Add date]</span>
              <span>🏳 Nationality: [Add nationality]</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Body: two-column ──────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 0 }}>

        {/* Left — Main column */}
        <div style={{ padding: "20px 28px 24px 32px", borderRight: "1px solid #e5e7eb" }}>

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
                      <span style={{ fontFamily: "Inter, Arial, sans-serif", fontWeight: 600, fontSize: 14, color: "#000" }}>
                        {job.title}
                      </span>
                      <span style={{ color: ACCENT, fontSize: 13, marginLeft: 6 }}>— {job.company}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>
                      {job.startDate} – {job.endDate}
                    </div>
                  </div>
                  <ul style={{ margin: "4px 0 0", padding: 0, listStyle: "none" }}>
                    {job.bullets.map((b, j) => (
                      <li key={j} style={{ display: "flex", gap: 6, marginBottom: 3, color: "#444", fontSize: 12 }}>
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
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <span style={{ fontFamily: "Inter, Arial, sans-serif", fontWeight: 600, fontSize: 14, color: "#000" }}>
                        {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                      </span>
                      <span style={{ color: ACCENT, fontSize: 13, marginLeft: 6 }}>— {edu.institution}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>{edu.graduationYear}</div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <SectionHeading>Projects</SectionHeading>
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "Inter, Arial, sans-serif", fontWeight: 600, fontSize: 14, color: "#000" }}>
                    {proj.name}
                  </div>
                  <p style={{ fontSize: 12, color: "#555", margin: "2px 0 4px" }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {proj.technologies.map((tech, j) => (
                      <span key={j} style={{ fontSize: 11, color: ACCENT, background: "#eef2f6", padding: "1px 6px", borderRadius: 3 }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right — Sidebar */}
        <div style={{ padding: "20px 24px 24px 20px", background: "#fafbfc" }}>

          {/* Skills */}
          {skills.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <SidebarHeading>Skills</SidebarHeading>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#e8edf3",
                      color: ACCENT,
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 3,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages (EU-specific) */}
          {languages && languages.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <SidebarHeading>Languages</SidebarHeading>
              {languages.map((lang, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 500, fontSize: 13, color: "#000" }}>{lang.language}</span>
                    <span style={{ fontSize: 11, color: "#666" }}>{levelLabel(lang.level)}</span>
                  </div>
                  <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
                    {[1, 2, 3, 4, 5, 6].map((dot) => (
                      <div
                        key={dot}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: dot <= levelDots(lang.level) ? ACCENT : "#ddd",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <SidebarHeading>Certifications</SidebarHeading>
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
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
        fontWeight: 600,
        fontSize: 15,
        color: "#000",
        borderBottom: "2px solid #1a3a5c",
        paddingBottom: 3,
        marginBottom: 10,
        textTransform: "uppercase" as const,
        letterSpacing: 0.8,
      }}
    >
      {children}
    </div>
  );
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
        fontWeight: 600,
        fontSize: 13,
        color: "#000",
        borderBottom: "1px solid #1a3a5c",
        paddingBottom: 2,
        marginBottom: 8,
        textTransform: "uppercase" as const,
        letterSpacing: 0.5,
      }}
    >
      {children}
    </div>
  );
}
