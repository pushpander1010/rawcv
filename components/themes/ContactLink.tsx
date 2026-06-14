import React from "react";

interface ContactLinkProps {
  value: string;
  type: "email" | "phone" | "linkedin" | "website" | "location";
  className?: string;
}

function getHref(type: string, value: string): string | null {
  const v = value.trim();
  switch (type) {
    case "email":
      return v.startsWith("mailto:") ? v : `mailto:${v}`;
    case "phone": {
      const digits = v.replace(/[^+\d]/g, "");
      return `tel:${digits}`;
    }
    case "linkedin": {
      if (v.startsWith("http")) return v;
      if (v.includes("linkedin.com")) return `https://${v.replace(/^(www\.)?/, "")}`;
      return `https://linkedin.com/in/${v.replace(/^@/, "")}`;
    }
    case "website": {
      if (v.startsWith("http")) return v;
      return `https://${v.replace(/^(www\.)?/, "")}`;
    }
    default:
      return null;
  }
}

function getLabel(type: string, value: string): string {
  const v = value.trim();
  switch (type) {
    case "email":
      return v.replace(/^mailto:/i, "");
    case "phone":
      return v;
    case "linkedin": {
      if (v.startsWith("http") || v.startsWith("www") || v.includes("linkedin.com")) return "LinkedIn";
      return v.replace(/^@/, "");
    }
    case "website": {
      if (v.startsWith("http")) {
        try { return new URL(v).hostname.replace(/^www\./, ""); } catch { return "Website"; }
      }
      return v.replace(/^www\./, "");
    }
    case "location":
      return v;
    default:
      return v;
  }
}

/**
 * Renders a contact field as a clickable link (email, phone, linkedin, website)
 * or plain text (location, name). Safe for PDF export — uses native <a> tags.
 */
export function ContactLink({ value, type, className }: ContactLinkProps) {
  if (!value) return null;

  const href = getHref(type, value);
  const label = getLabel(type, value);

  if (!href) {
    return <span className={className}>{label}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      {label}
    </a>
  );
}
