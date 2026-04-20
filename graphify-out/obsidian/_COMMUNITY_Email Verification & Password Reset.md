---
type: community
cohesion: 0.52
members: 7
---

# Email Verification & Password Reset

**Cohesion:** 0.52 - moderately connected
**Members:** 7 nodes

## Members
- [[buildResetHtml()]] - code - rawcv\lib\email.ts
- [[buildVerificationHtml()]] - code - rawcv\lib\email.ts
- [[buildVerificationText()]] - code - rawcv\lib\email.ts
- [[email.ts]] - code - rawcv\lib\email.ts
- [[escapeHtml()]] - code - rawcv\lib\email.ts
- [[sendPasswordResetEmail()]] - code - rawcv\lib\email.ts
- [[sendVerificationEmail()]] - code - rawcv\lib\email.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Email_Verification_&_Password_Reset
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_API Routes & Auth Guards]]

## Top bridge nodes
- [[sendVerificationEmail()]] - degree 4, connects to 1 community