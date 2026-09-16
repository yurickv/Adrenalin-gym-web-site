import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/lh-summary.mjs <lighthouse.json>');
  process.exit(1);
}

const report = JSON.parse(readFileSync(file, 'utf8'));
const audits = report.audits;
const metrics = audits.metrics.details.items[0];
const ms = value => `${Math.round(value)} ms`;

console.log(`URL: ${report.finalDisplayedUrl}`);
console.log(`Performance: ${Math.round(report.categories.performance.score * 100)}`);
console.log(
  `Simulated: FCP ${ms(metrics.firstContentfulPaint)} | LCP ${ms(metrics.largestContentfulPaint)} | TBT ${ms(metrics.totalBlockingTime)} | CLS ${metrics.cumulativeLayoutShift.toFixed(3)}`
);
console.log(
  `Observed:  FCP ${ms(metrics.observedFirstContentfulPaint)} | LCP ${ms(metrics.observedLargestContentfulPaint)} | load ${ms(metrics.observedLoad)}`
);

const lcpAudit = audits['largest-contentful-paint-element'];
const lcpNode = lcpAudit?.details?.items?.[0]?.items?.[0]?.node;
console.log(`LCP element: ${lcpNode?.snippet?.slice(0, 160) ?? 'n/a'}`);
for (const phase of lcpAudit?.details?.items?.[1]?.items ?? []) {
  console.log(`  ${phase.phase}: ${ms(phase.timing)}`);
}

const requests = audits['network-requests']?.details?.items ?? [];
const start = requests[0]?.networkRequestTime ?? 0;
console.log('First 12 requests:');
for (const req of requests.slice(0, 12)) {
  const offset = String(Math.round(req.networkRequestTime - start)).padStart(5);
  console.log(
    `  ${offset} ms ${(req.resourceType ?? '').padEnd(10)} ${String(req.transferSize).padStart(7)} B ${req.url.slice(0, 90)}`
  );
}
