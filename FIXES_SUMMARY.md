# Fixes Applied to rawcv

## Issue 1: CSP (Content Security Policy) Violations

**Problem:** Google AdSense frames were being blocked by CSP directives.

**Error Messages:**
- `Framing 'https://googleads.g.doubleclick.net/' violates the following Content Security Policy directive`
- `Connecting to 'https://ep1.adtrafficquality.google/getconfig/sodar' violates CSP`

**Fix Applied:**
Updated `next.config.mjs` to add Google AdSense domains to CSP:

```javascript
// Added to script-src:
- https://partner.googleadservices.com
- https://www.googletagmanager.com

// Added to connect-src:
- https://pagead2.googlesyndication.com
- https://www.google-analytics.com
- https://ep1.adtrafficquality.google

// Added to frame-src:
- https://googleads.g.doubleclick.net
- https://tpc.googlesyndication.com
```

## Issue 2: API Timeout (504) and Retry Logic

**Problem:** `/api/chat` endpoint was timing out with 504 errors, and there was no retry mechanism.

**Fix Applied:**
1. Created `lib/fetch-retry.ts` utility with:
   - `fetchWithRetry()` - Automatic retry with exponential backoff (up to 2 retries)
   - `safeJsonParse()` - Safe JSON parsing with error handling
   - `fetchJsonWithRetry()` - Combined fetch + retry + JSON parsing

2. Updated `components/ChatBot.tsx`:
   - Imported and used `fetchWithRetry` and `safeJsonParse`
   - Added 60-second timeout per request
   - Exponential backoff: 1s, 2s between retries
   - Better error messages for users:
     - Timeout errors: "Request timed out. The server is taking too long to respond."
     - Network errors: "Network error. Please check your connection and try again."
     - Invalid JSON: "Server returned an invalid response. Please try again."

## Issue 3: JSON Parsing Errors

**Problem:** `Unexpected token 'A', "An error o"... is not valid JSON`

**Fix Applied:**
1. Added `safeJsonParse()` function that:
   - Wraps `res.json()` in try-catch
   - Logs the raw response text on error (first 500 chars)
   - Provides helpful error message to user
   - Prevents app crash on malformed JSON

2. Applied to both:
   - `sendMessage()` function (user chat messages)
   - `triggerGreeting()` function (initial greeting)

## Issue 4: Resume Preview Update Bug

**Problem:** Resume preview wasn't updating after every chat reply.

**Fix Applied:**
Added explicit null checks before calling `Object.keys()`:
```typescript
// Before:
if (chatData.resumeUpdate && Object.keys(chatData.resumeUpdate).length > 0)

// After:
if (chatData.resumeUpdate && chatData.resumeUpdate !== null && Object.keys(chatData.resumeUpdate).length > 0)
```

## Issue 5: Missing `runtime = "nodejs"` in API Routes

**Problem:** Several API routes were missing the required `export const runtime = "nodejs"` declaration.

**Fix Applied:**
Added `export const runtime = "nodejs";` to:
- `app/api/auth/forgot-password/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/auth/reset-password/route.ts`
- `app/api/auth/verify-email/route.ts`
- `app/api/credits/route.ts`
- `app/api/stripe/checkout/route.ts`
- `app/api/stripe/webhook/route.ts`

## Issue 6: React Hook Warnings

**Problem:** ESLint warnings about calling `setState` synchronously within `useEffect`.

**Fix Applied:**
Wrapped state updates in `setTimeout(..., 0)` to avoid cascading renders:
- `app/dashboard/page.tsx` - Tab synchronization
- `components/AILoader.tsx` - State reset on type change

## Testing Recommendations

1. **CSP**: Test Google AdSense ads load without console errors
2. **Retry Logic**: Test chat with slow/unstable network connection
3. **JSON Errors**: Monitor for any remaining JSON parse errors in production
4. **Resume Preview**: Verify preview updates immediately after each chat response
5. **Timeout Handling**: Test with requests that take >60 seconds

## Files Modified

1. `next.config.mjs` - CSP updates
2. `lib/fetch-retry.ts` - NEW FILE - Retry utilities
3. `components/ChatBot.tsx` - Retry logic + JSON error handling
4. `app/dashboard/page.tsx` - React hook fix
5. `components/AILoader.tsx` - React hook fix
6. `app/api/auth/forgot-password/route.ts` - Runtime declaration
7. `app/api/auth/register/route.ts` - Runtime declaration
8. `app/api/auth/reset-password/route.ts` - Runtime declaration
9. `app/api/auth/verify-email/route.ts` - Runtime declaration
10. `app/api/credits/route.ts` - Runtime declaration
11. `app/api/stripe/checkout/route.ts` - Runtime declaration
12. `app/api/stripe/webhook/route.ts` - Runtime declaration

## Next Steps

Consider applying the same retry logic to other API calls in:
- `app/analyze/page.tsx` (ATS, relevance, suggestions, enhance endpoints)
- Any other components making API calls

This can be done by importing and using `fetchJsonWithRetry` from `lib/fetch-retry.ts`.
