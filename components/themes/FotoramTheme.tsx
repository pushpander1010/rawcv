import type { ParsedResume } from "@/types";
import { ContactLink } from "./ContactLink";

interface Props {
  resume: ParsedResume;
}

export default function FotoramTheme({ resume }: Props) {
  const { contact, photo, summary, experience, education, skills, certifications, projects, languages } = resume;

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
      {/* ── Large photo hero section ──────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          padding: "32px 36px",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          color: "#fff",
        }}
      >
        {/* Large photo */}
        {photo ? (
          <img
            src={photo}
            alt={contact.name}
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
              border: "4px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          />
        ) : (
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 42,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              border: "4px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            {contact.name
              ? contact.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
              : "?"}
          </div>
        )}

        {/* Name + Contact */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "Inter, Arial, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: -0.5,
              lineHeight: 1,
              color: "#fff",
              marginBottom: 4,
            }}
          >
            {contact.name}
          </div>
          {experience[0]?.title && (
            <div style={{ color: "#4fc3f7", fontSize: 16, fontWeight: 500, marginBottom: 12 }}>
              {experience[0].title}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 12, color: "#b0bec5" }}>
            {contact.email && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#4fc3f7" }}>✉</span>{" "}
                <span style={{ color: "#e0e0e0" }}><ContactLink value={contact.email} type="email" /></span>
              </span>
            )}
            {contact.phone && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#4fc3f7" }}>☎</span>{" "}
                <span style={{ color: "#e0e0e0" }}><ContactLink value={contact.phone} type="phone" /></span>
              </span>
            )}
            {contact.location && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#4fc3f7" }}>⌖</span>{" "}
                <span style={{ color: "#e0e0e0" }}><ContactLink value={contact.location} type="location" /></span>
              </span>
            )}
            {contact.linkedin && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#4fc3f7" }}>in</span>{" "}
                <span style={{ color: "#e0e0e0" }}><ContactLink value={contact.linkedin} type="linkedin" /></span>
              </span>
            )}
            {contact.website && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#4fc3f7" }}>🔗</span>{" "}
                <span style={{ color: "#e0e0e0" }}><ContactLink value={contact.website} type="website" /></span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: "24px 36px 28px" }}>

        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: 24 }}>
            <SectionHeading accent="#4fc3f7">About Me</SectionHeading>
            <p style={{ color: "#555", lineHeight: 1.7, margin: 0, fontSize: 13 }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <SectionHeading accent="#4fc3f7">Experience</SectionHeading>
            {experience.map((job, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    paddingLeft: 12,
                    borderLeft: "3px solid #4fc3f7",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 15, color: "#1a1a2e" }}>{job.title}</span>
                    <span style={{ color: "#0f3460", fontSize: 13, marginLeft: 6, fontWeight: 500 }}>@ {job.company}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#999", whiteSpace: "nowrap" }}>
                    {job.startDate} – {job.endDate}
                  </div>
                </div>
                <ul style={{ margin: "6px 0 0", padding: "0 0 0 15px", listStyle: "none" }}>
                  {job.bullets.map((b, j) => (
                    <li key={j} style={{ display: "flex", gap: 8, marginBottom: 4, color: "#555", fontSize: 12, lineHeight: 1.5 }}>
                      <span style={{ color: "#4fc3f7", flexShrink: 0, fontSize: 16, lineHeight: 1 }}>▸</span>
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
            <SectionHeading accent="#4fc3f7">Education</SectionHeading>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: "3px solid #4fc3f7" }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>
                  {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                </div>
                <div style={{ color: "#0f3460", fontSize: 13 }}>{edu.institution}</div>
                <div style={{ fontSize: 11, color: "#999" }}>{edu.graduationYear}</div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <SectionHeading accent="#4fc3f7">Skills</SectionHeading>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                    color: "#e0e0e0",
                    fontSize: 12,
                    padding: "4px 14px",
                    borderRadius: 20,
                    fontWeight: 500,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Bottom row: Projects, Languages, Certifications */}
        <div style={{ display: "grid", gridTemplateColumns: projects && languages ? "1fr 1fr 1fr" : projects ? "1fr 1fr" : "1fr", gap: 24 }}>
          {projects && projects.length > 0 && (
            <section>
              <SectionHeading accent="#4fc3f7">Projects</SectionHeading>
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>{proj.name}</div>
                  <p style={{ fontSize: 11, color: "#666", margin: "2px 0" }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {proj.technologies.map((tech, j) => (
                      <span key={j} style={{ fontSize: 10, color: "#4fc3f7", background: "#e3f2fd", padding: "1px 5px", borderRadius: 3 }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {languages && languages.length > 0 && (
            <section>
              <SectionHeading accent="#4fc3f7">Languages</SectionHeading>
              {languages.map((lang, i) => (
                <div key={i} style={{ marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>{lang.language}</span>
                  <span style={{ fontSize: 11, color: "#4fc3f7", fontWeight: 500 }}>{lang.level}</span>
                </div>
              ))}
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <SectionHeading accent="#4fc3f7">Certifications</SectionHeading>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {certifications.map((cert, i) => (
                  <li key={i} style={{ fontSize: 11, color: "#555", marginBottom: 3, display: "flex", gap: 5 }}>
                    <span style={{ color: "#4fc3f7" }}>▸</span> {cert}
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

function SectionHeading({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div
      style={{
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
        fontWeight: 600,
        fontSize: 14,
        color: "#1a1a2e",
        borderBottom: `2px solid ${accent}`,
        paddingBottom: 4,
        marginBottom: 12,
        textTransform: "uppercase" as const,
        letterSpacing: 1,
      }}
    >
      {children}
    </div>
  );
}