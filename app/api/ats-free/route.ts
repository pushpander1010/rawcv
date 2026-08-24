export const runtime = "nodejs";
export const maxDuration = 30;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, ATSResult } from "@/types";
import { runRuleChecks, calculateBaseScore } from "@/lib/ats-rules";

export async function POST(req: NextRequest) {
  let body: { parsed: ParsedResume; raw: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Expected JSON body" }, { status: 400 });
  }

  const { parsed } = body;
  const raw = body.raw || JSON.stringify(body.parsed ?? {});

  if (!parsed) {
    return NextResponse.json({ error: "missing_fields", message: "parsed field is required" }, { status: 400 });
  }

  const ruleIssues = runRuleChecks(parsed, raw);
  const baseScore = calculateBaseScore(ruleIssues);

  return NextResponse.json({
    score: Math.round(baseScore),
    issues: ruleIssues,
  } satisfies ATSResult);
}
