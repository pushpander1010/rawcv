# Download Button Fixes

## Issues Fixed

### 1. **Added Retry Logic**
- Integrated `fetchWithRetry` from `lib/fetch-retry.ts`
- 1 retry attempt with 90-second timeout (PDF generation can be slow)
- Exponential backoff between retries

### 2. **Better Error Handling**
- Added `safeJsonParse` for JSON response parsing
- Catches and handles JSON parse errors gracefully
- Provides specific error messages for different failure scenarios:
  - Timeout errors: "PDF generation timed out..."
  - Network errors: "Network error. Please check your connection..."
  - Generic errors: Shows the actual error message from server

### 3. **Improved Export API Route**
- Added comprehensive error logging with `[export]` prefix
- Wrapped entire route in try-catch for unexpected errors
- Better error messages in JSON responses
- Logs specific details about failures (JSON parse, missing fields, PDF generation)

### 4. **Fallback to Print Dialog**
- If Puppeteer fails (common in production), returns HTML with `fallbackHtml`
- Client automatically opens print dialog as fallback
- User can still download/print resume even if PDF generation fails

## Changes Made

### `components/DownloadButton.tsx`
```typescript
// Added imports
import { fetchWithRetry, safeJsonParse } from "@/lib/fetch-retry";

// Updated fetch call
const res = await fetchWithRetry("/api/export", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ parsed: state.parsed, theme: state.selectedTheme }),
}, 1, 90000); // 1 retry, 90s timeout

// Better error handling
const json = await safeJsonParse<{ fallbackHtml?: string; message?: string }>(res).catch(() => ({}));

// Specific error messages
if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
  setError("PDF generation timed out. The server is taking too long. Please try again.");
} else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
  setError("Network error. Please check your connection and try again.");
} else {
  setError(errorMessage);
}
```

### `app/api/export/route.ts`
```typescript
// Added error logging throughout
console.error("[export] JSON parse error:", err);
console.error("[export] Missing fields:", { hasParsed: !!parsed, hasTheme: !!theme });
console.error("[export] PDF generation failed:", message, err);
console.error("[export] Unexpected error:", message, err);

// Wrapped entire route in try-catch
try {
  // ... existing code ...
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error("[export] Unexpected error:", message, err);
  return NextResponse.json(
    { error: "export_failed", message: "An unexpected error occurred. Please try again." },
    { status: 500 }
  );
}
```

## Common Issues & Solutions

### Issue: "PDF generation timed out"
**Cause:** Puppeteer is taking too long to generate PDF (>90s)
**Solution:** 
- Check server resources (CPU, memory)
- Verify Chromium binary is accessible
- Check if resume has very large content

### Issue: "Network error"
**Cause:** Client can't reach the server
**Solution:**
- Check internet connection
- Verify server is running
- Check for CORS issues

### Issue: "Invalid response from server"
**Cause:** Server returned non-JSON response
**Solution:**
- Check server logs for errors
- Verify API route is working correctly
- Check if Puppeteer is installed

### Issue: Print dialog opens instead of PDF download
**Cause:** Puppeteer failed, fallback activated
**Solution:**
- This is expected behavior when Puppeteer fails
- User can still print/save as PDF from browser
- Check server logs to see why Puppeteer failed

## Testing Checklist

- [ ] Download works with valid resume
- [ ] Error message shows on network failure
- [ ] Error message shows on timeout
- [ ] Fallback print dialog works when Puppeteer fails
- [ ] Retry logic activates on first failure
- [ ] Loading state shows during generation
- [ ] Error clears on successful retry

## Production Considerations

1. **Chromium Binary**: Ensure `@sparticuz/chromium-min` is properly configured
2. **Memory**: PDF generation is memory-intensive, ensure adequate resources
3. **Timeout**: 90s timeout may need adjustment based on server performance
4. **Monitoring**: Watch server logs for `[export]` errors
5. **Fallback**: Print dialog fallback ensures users can always get their resume
