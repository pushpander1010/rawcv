# Graph Report - rawcv  (2026-04-19)

## Corpus Check
- Corpus is ~45,850 words - fits in a single context window. You may not need a graph.

## Summary
- 208 nodes · 223 edges · 66 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_API Routes & Auth Guards|API Routes & Auth Guards]]
- [[_COMMUNITY_User Store & Credits|User Store & Credits]]
- [[_COMMUNITY_Resume Renderers & HTML Templates|Resume Renderers & HTML Templates]]
- [[_COMMUNITY_Resume State & Persistence|Resume State & Persistence]]
- [[_COMMUNITY_AI Provider & OpenRouter|AI Provider & OpenRouter]]
- [[_COMMUNITY_Google OAuth|Google OAuth]]
- [[_COMMUNITY_Email Verification & Password Reset|Email Verification & Password Reset]]
- [[_COMMUNITY_File Parsing & Text Extraction|File Parsing & Text Extraction]]
- [[_COMMUNITY_Razorpay Payment Flow|Razorpay Payment Flow]]
- [[_COMMUNITY_Misc Utilities A|Misc Utilities A]]
- [[_COMMUNITY_Change Tracking UI|Change Tracking UI]]
- [[_COMMUNITY_Misc Utilities B|Misc Utilities B]]
- [[_COMMUNITY_Misc Utilities C|Misc Utilities C]]
- [[_COMMUNITY_Misc Utilities D|Misc Utilities D]]
- [[_COMMUNITY_String Normalisation|String Normalisation]]
- [[_COMMUNITY_Deployment Stack|Deployment Stack]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Robots & SEO|Robots & SEO]]
- [[_COMMUNITY_Sitemap|Sitemap]]
- [[_COMMUNITY_Analyze Layout|Analyze Layout]]
- [[_COMMUNITY_Chat Layout|Chat Layout]]
- [[_COMMUNITY_How-To Page|How-To Page]]
- [[_COMMUNITY_How-To Layout|How-To Layout]]
- [[_COMMUNITY_Step Component|Step Component]]
- [[_COMMUNITY_Tailor Layout|Tailor Layout]]
- [[_COMMUNITY_Tailor Page|Tailor Page]]
- [[_COMMUNITY_ATS Score Card|ATS Score Card]]
- [[_COMMUNITY_Credit Balance|Credit Balance]]
- [[_COMMUNITY_Credit Warning|Credit Warning]]
- [[_COMMUNITY_Landing CTA|Landing CTA]]
- [[_COMMUNITY_Resizable Panels|Resizable Panels]]
- [[_COMMUNITY_Resume Preview|Resume Preview]]
- [[_COMMUNITY_Session Provider|Session Provider]]
- [[_COMMUNITY_Theme Picker|Theme Picker]]
- [[_COMMUNITY_Prisma Client|Prisma Client]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Middleware|Middleware]]
- [[_COMMUNITY_Next Env Types|Next Env Types]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Prisma Config|Prisma Config]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]
- [[_COMMUNITY_Login Page|Login Page]]
- [[_COMMUNITY_Webhook Route|Webhook Route]]
- [[_COMMUNITY_Signup Page|Signup Page]]
- [[_COMMUNITY_Verify Email Page|Verify Email Page]]
- [[_COMMUNITY_AI Loader|AI Loader]]
- [[_COMMUNITY_Relevance Score Card|Relevance Score Card]]
- [[_COMMUNITY_Reset Button|Reset Button]]
- [[_COMMUNITY_Suggestions List|Suggestions List]]
- [[_COMMUNITY_Toast|Toast]]
- [[_COMMUNITY_User Nav|User Nav]]
- [[_COMMUNITY_Classic Theme|Classic Theme]]
- [[_COMMUNITY_Creative Theme|Creative Theme]]
- [[_COMMUNITY_Enhancv Theme|Enhancv Theme]]
- [[_COMMUNITY_Executive Theme|Executive Theme]]
- [[_COMMUNITY_Theme Index|Theme Index]]
- [[_COMMUNITY_Minimal Theme|Minimal Theme]]
- [[_COMMUNITY_Modern Theme|Modern Theme]]
- [[_COMMUNITY_Navy Theme|Navy Theme]]
- [[_COMMUNITY_Sharp Theme|Sharp Theme]]
- [[_COMMUNITY_Terra Theme|Terra Theme]]
- [[_COMMUNITY_Auth Config|Auth Config]]
- [[_COMMUNITY_Stripe Config|Stripe Config]]
- [[_COMMUNITY_Resume Types|Resume Types]]
- [[_COMMUNITY_PDF.js Types|PDF.js Types]]

## God Nodes (most connected - your core abstractions)
1. `POST()` - 40 edges
2. `esc()` - 11 edges
3. `GET()` - 9 edges
4. `li()` - 7 edges
5. `toStoredUser()` - 7 edges
6. `normalizeEmail()` - 6 edges
7. `extractText()` - 5 edges
8. `callOpenRouter()` - 5 edges
9. `DELETE()` - 4 edges
10. `handlePurchase()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `addCreditsFromStripePayment()`  [INFERRED]
  rawcv\app\api\tailor\route.ts → rawcv\lib\user-store.ts
- `POST()` --calls--> `normalizeParsed()`  [EXTRACTED]
  rawcv\app\api\tailor\route.ts → rawcv\app\api\parse\route.ts
- `POST()` --calls--> `complete()`  [INFERRED]
  rawcv\app\api\tailor\route.ts → rawcv\lib\ai-providers.ts
- `POST()` --calls--> `chargeCredits()`  [INFERRED]
  rawcv\app\api\tailor\route.ts → rawcv\lib\credits.ts
- `POST()` --calls--> `rateLimit()`  [INFERRED]
  rawcv\app\api\tailor\route.ts → rawcv\lib\rate-limit.ts

## Communities

### Community 0 - "API Routes & Auth Guards"
Cohesion: 0.1
Nodes (14): requireAuth(), sanitiseJD(), sanitiseMessages(), analyseResume(), applyChanges(), buildResumeSnapshot(), calculateBaseScore(), DELETE() (+6 more)

### Community 1 - "User Store & Credits"
Cohesion: 0.14
Nodes (18): chargeCredits(), getIp(), rateLimit(), GET(), addCreditsFromStripePayment(), clearPasswordResetToken(), createUser(), deductCredits() (+10 more)

### Community 2 - "Resume Renderers & HTML Templates"
Cohesion: 0.33
Nodes (13): esc(), li(), renderClassic(), renderCreative(), renderEnhancv(), renderExecutive(), renderMinimal(), renderModern() (+5 more)

### Community 3 - "Resume State & Persistence"
Cohesion: 0.24
Nodes (6): DownloadButton(), loadPersistedState(), persistState(), storageKey(), useResume(), UndoButton()

### Community 4 - "AI Provider & OpenRouter"
Cohesion: 0.43
Nodes (7): callOpenRouter(), complete(), completeAnalysis(), completeChat(), extractJson(), parseAndValidate(), withRetry()

### Community 5 - "Google OAuth"
Cohesion: 0.29
Nodes (1): GoogleIcon()

### Community 6 - "Email Verification & Password Reset"
Cohesion: 0.52
Nodes (6): buildResetHtml(), buildVerificationHtml(), buildVerificationText(), escapeHtml(), sendPasswordResetEmail(), sendVerificationEmail()

### Community 7 - "File Parsing & Text Extraction"
Cohesion: 0.53
Nodes (5): detectMime(), extractDocxText(), extractPdfText(), extractText(), normalizeParsed()

### Community 8 - "Razorpay Payment Flow"
Cohesion: 0.47
Nodes (4): handlePurchase(), loadRazorpay(), loadRazorpayScript(), switchTab()

### Community 9 - "Misc Utilities A"
Cohesion: 0.33
Nodes (0): 

### Community 10 - "Change Tracking UI"
Cohesion: 0.47
Nodes (3): handleEdit(), handleReject(), updateChange()

### Community 11 - "Misc Utilities B"
Cohesion: 0.4
Nodes (0): 

### Community 12 - "Misc Utilities C"
Cohesion: 0.67
Nodes (0): 

### Community 13 - "Misc Utilities D"
Cohesion: 0.67
Nodes (0): 

### Community 14 - "String Normalisation"
Cohesion: 1.0
Nodes (2): findIndex(), normalise()

### Community 15 - "Deployment Stack"
Cohesion: 0.67
Nodes (3): Geist Font, Next.js Framework, Vercel Deployment

### Community 16 - "Root Layout"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Robots & SEO"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Sitemap"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Analyze Layout"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Chat Layout"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "How-To Page"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "How-To Layout"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Step Component"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Tailor Layout"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Tailor Page"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "ATS Score Card"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Credit Balance"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Credit Warning"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Landing CTA"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Resizable Panels"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Resume Preview"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Session Provider"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Theme Picker"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Prisma Client"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Middleware"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Next Env Types"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Next Config"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Prisma Config"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Tailwind Config"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Login Page"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Webhook Route"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Signup Page"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Verify Email Page"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "AI Loader"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Relevance Score Card"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Reset Button"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Suggestions List"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Toast"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "User Nav"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Classic Theme"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Creative Theme"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "Enhancv Theme"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Executive Theme"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "Theme Index"
Cohesion: 1.0
Nodes (0): 

### Community 57 - "Minimal Theme"
Cohesion: 1.0
Nodes (0): 

### Community 58 - "Modern Theme"
Cohesion: 1.0
Nodes (0): 

### Community 59 - "Navy Theme"
Cohesion: 1.0
Nodes (0): 

### Community 60 - "Sharp Theme"
Cohesion: 1.0
Nodes (0): 

### Community 61 - "Terra Theme"
Cohesion: 1.0
Nodes (0): 

### Community 62 - "Auth Config"
Cohesion: 1.0
Nodes (0): 

### Community 63 - "Stripe Config"
Cohesion: 1.0
Nodes (0): 

### Community 64 - "Resume Types"
Cohesion: 1.0
Nodes (0): 

### Community 65 - "PDF.js Types"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **2 isolated node(s):** `Vercel Deployment`, `Geist Font`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Root Layout`** (2 nodes): `RootLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Robots & SEO`** (2 nodes): `robots.ts`, `robots()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sitemap`** (2 nodes): `sitemap.ts`, `sitemap()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Analyze Layout`** (2 nodes): `AnalyzeLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chat Layout`** (2 nodes): `ChatLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `How-To Page`** (2 nodes): `handleComplete()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `How-To Layout`** (2 nodes): `HowToLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Step Component`** (2 nodes): `Step()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailor Layout`** (2 nodes): `TailorLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailor Page`** (2 nodes): `runTailor()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ATS Score Card`** (2 nodes): `CircularGauge()`, `ATSScoreCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Credit Balance`** (2 nodes): `CreditBalance()`, `CreditBalance.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Credit Warning`** (2 nodes): `CreditWarningBanner()`, `CreditWarningBanner.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Landing CTA`** (2 nodes): `HeroCTA()`, `LandingCTA.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Resizable Panels`** (2 nodes): `ResizablePanels.tsx`, `ResizablePanels()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Resume Preview`** (2 nodes): `ResumePreview.tsx`, `ResumePreview()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Session Provider`** (2 nodes): `SessionProvider.tsx`, `SessionProvider()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme Picker`** (2 nodes): `ThemePicker.tsx`, `handleSelect()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Client`** (2 nodes): `createPrismaClient()`, `prisma.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Middleware`** (1 nodes): `middleware.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Env Types`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Config`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Config`** (1 nodes): `prisma.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind Config`** (1 nodes): `tailwind.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Webhook Route`** (1 nodes): `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Signup Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Verify Email Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AI Loader`** (1 nodes): `AILoader.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Relevance Score Card`** (1 nodes): `RelevanceScoreCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Reset Button`** (1 nodes): `ResetButton.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Suggestions List`** (1 nodes): `SuggestionsList.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Toast`** (1 nodes): `Toast.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Nav`** (1 nodes): `UserNav.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Classic Theme`** (1 nodes): `ClassicTheme.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Creative Theme`** (1 nodes): `CreativeTheme.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Enhancv Theme`** (1 nodes): `EnhancTheme.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Executive Theme`** (1 nodes): `ExecutiveTheme.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme Index`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minimal Theme`** (1 nodes): `MinimalTheme.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Modern Theme`** (1 nodes): `ModernTheme.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Navy Theme`** (1 nodes): `NavyTheme.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sharp Theme`** (1 nodes): `SharpTheme.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Terra Theme`** (1 nodes): `TerraTheme.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Config`** (1 nodes): `auth.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Stripe Config`** (1 nodes): `stripe-config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Resume Types`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PDF.js Types`** (1 nodes): `pdfjs-dist-build.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POST()` connect `API Routes & Auth Guards` to `User Store & Credits`, `Resume Renderers & HTML Templates`, `AI Provider & OpenRouter`, `Email Verification & Password Reset`, `File Parsing & Text Extraction`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **Why does `renderThemeHtml()` connect `Resume Renderers & HTML Templates` to `API Routes & Auth Guards`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `complete()` connect `AI Provider & OpenRouter` to `API Routes & Auth Guards`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `POST()` (e.g. with `requireAuth()` and `complete()`) actually correct?**
  _`POST()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `GET()` (e.g. with `getUserByVerificationToken()` and `updateUser()`) actually correct?**
  _`GET()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Vercel Deployment`, `Geist Font` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Routes & Auth Guards` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._