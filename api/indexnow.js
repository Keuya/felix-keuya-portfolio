const urls = [
  "https://felix-keuya-portfolio.vercel.app/",
  "https://felix-keuya-portfolio.vercel.app/services.html",
  "https://felix-keuya-portfolio.vercel.app/work.html",
  "https://felix-keuya-portfolio.vercel.app/samples.html",
  "https://felix-keuya-portfolio.vercel.app/request.html",
  "https://felix-keuya-portfolio.vercel.app/resume.html",
  "https://felix-keuya-portfolio.vercel.app/models/public-solar-ipp-model.html",
  "https://felix-keuya-portfolio.vercel.app/models/sa-corporate-ppa-wheeling-model.html",
  "https://felix-keuya-portfolio.vercel.app/projects/zambia-solar-project-finance-model.html",
  "https://felix-keuya-portfolio.vercel.app/projects/south-africa-corporate-ppa-wheeling.html",
  "https://felix-keuya-portfolio.vercel.app/projects/grid-connection-curtailment-analysis.html",
  "https://felix-keuya-portfolio.vercel.app/projects/investment-committee-memo-project-valuation.html",
  "https://felix-keuya-portfolio.vercel.app/projects/ssa-mining-power-opportunity-screen.html",
  "https://felix-keuya-portfolio.vercel.app/projects/rec-readiness-commercial-model.html",
  "https://felix-keuya-portfolio.vercel.app/projects/africa-renewable-project-development-portfolio.html"
];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "felix-keuya-portfolio.vercel.app",
      key: "7466da5f4210c73cef578955ef7f5a42",
      keyLocation: "https://felix-keuya-portfolio.vercel.app/7466da5f4210c73cef578955ef7f5a42.txt",
      urlList: urls
    })
  });

  const responseText = await response.text();
  res.setHeader("cache-control", "no-store");
  return res.status(response.status).json({ status: response.status, submitted: urls.length, response: responseText || "Accepted" });
}
