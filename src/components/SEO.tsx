import Script from 'next/script';

export function SEO() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "느좋 코린 (Neujoh Korin)",
    "alternateName": "Kimp Dashboard by gitsam",
    "url": "https://primenumbersam.vercel.app",
    "description": "광고와 마케팅이 배제된 개인용 암호화폐 프리미엄(김프) 및 퀀트 지표 대시보드. 오픈 소스 기반의 투명한 데이터 제공.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "author": {
      "@type": "Person",
      "name": "gitsam",
      "jobTitle": "Quant Hacker",
      "url": "https://gitsam.com"
    },
    "featureList": [
      "Real-time Kimchi Premium Calculation",
      "TradingView Advanced Charts Integration",
      "Crypto & Macro Indicator Dashboard",
      "Automated News Aggregator",
      "One-Click Vercel Deployment"
    ],
    "screenshot": "https://primenumbersam.vercel.app/screen.jpg"
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
