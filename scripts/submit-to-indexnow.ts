/**
 * Submit all rawcv pages to IndexNow after deployment
 * Run with: npx tsx scripts/submit-to-indexnow.ts
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const BASE_URL = "https://www.rawcv.com";

const urls = [
  `${BASE_URL}/`,
  `${BASE_URL}/build`,
  `${BASE_URL}/how-to`,
  `${BASE_URL}/contact`,
  `${BASE_URL}/register`,
  `${BASE_URL}/login`,
  `${BASE_URL}/credits`,
  `${BASE_URL}/privacy`,
  `${BASE_URL}/terms`,
  `${BASE_URL}/forgot-password`,
  `${BASE_URL}/blog`,
  `${BASE_URL}/blog/how-to-write-ats-friendly-resume`,
  `${BASE_URL}/blog/quantifying-achievements-resume-examples`,
  `${BASE_URL}/blog/resume-keywords-matcher-guide`,
];

async function submitToIndexNow() {
  if (!INDEXNOW_KEY) {
    console.error("❌ INDEXNOW_KEY environment variable not set");
    console.log("\nSet it with:");
    console.log("  export INDEXNOW_KEY=your-key-here");
    process.exit(1);
  }

  console.log("🚀 Submitting URLs to IndexNow...\n");

  const payload = {
    host: "www.rawcv.com",
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status === 200 || response.status === 202) {
      console.log("✅ Successfully submitted to IndexNow!");
      console.log(`\n📊 Submitted ${urls.length} URLs:`);
      urls.forEach((url) => console.log(`   - ${url}`));
      console.log("\n🔍 Verify in Bing Webmaster Tools:");
      console.log("   https://www.bing.com/webmasters");
    } else {
      console.error(`❌ IndexNow returned status ${response.status}`);
      const text = await response.text();
      console.error(`Response: ${text}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error submitting to IndexNow:");
    console.error(error);
    process.exit(1);
  }
}

submitToIndexNow();
