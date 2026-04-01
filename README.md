# 느좋 코린 📈

**느좋 코린** 은 광고와 마케팅이 배제된 개인용 암호화폐 프리미엄(김프) 및 퀀트 지표 대시보드입니다. 성공팔이와 불필요한 홍보 문구로부터 자유로운 클린 터미널을 지향합니다.

---

## ✨ 핵심 기능 (Core Features)

- **🚫 Zero Ads & Minimalist UI**: 어떠한 광고도 없으며 `shadcn/ui` 기반의 미니멀하고 프리미엄한 디자인을 유지합니다. (상승=Green, 하락=Red 글로벌 표준 색상 적용)
- **📊 실시간 김치 프리미엄 (Premium Page)**: Upbit와 Binance API를 연동하여 13개 주요 종목의 실시간 김프 및 52주 고/저가 대비 수치를 제공합니다.
- **🔍 퀀트 지표 (Indicators Page)**: BTC Dominance, Fear & Greed Index부터 SPX500, KOSPI, 원자재, 환율 등 거시 경제 지표를 한눈에 파악합니다.
- **📰 실시간 속보 (News Page)**: 피드를 활용한 광고 없는 실시간 뉴스 애그리게이터.
- **⚡ 최적화된 성능**: Next.js App Router와 ISR(Incremental Static Regeneration)을 사용하여 빠른 로딩 속도를 보장하며, 클라이언트 사이드 하이드레이션을 통해 실시간성을 보강합니다.

---

## 🛠 기술 스택 (Technical Stack)

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **UI/Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **Charts**: [TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/) & Widgets
- **Data Management**: Server-side fetching with ISR (10-60min interval) & Client-side Sync
- **Deployment**: [Vercel](https://vercel.com/) (Free Tier)

---

## 🏗 아키텍처 및 데이터 흐름 (Architecture)

1. **데이터 소스 (External APIs)**:
   - **Upbit API**: 국내 암호화폐 KRW 시세. 실시간 USD/KRW 환율 정보 (업비트 표준 환율 지표).
   - **Binance API**: 해외 암호화폐 USDT 시세 (multi-endpoint 및 data-api 우회 로직 적용).
   - **FawazAhmed & ExchangeRate-API**: 환율 정보 Fallback 소스.
   - **Investing.com RSS**: 실시간 경제 뉴스 피드.
1. **업데이트 로직**:
   - Vercel ISR을 통해 서버 사이드에서 10~60분마다 데이터를 자동 갱신합니다.
   - **Top Navigation**: 클라이언트 사이드 마운트 시 실시간 환율을 동기화하여 데이터 선도를 유지합니다.
   - 김프 계산 공식: `((Upbit_KRW_Price / (Binance_USD_Price * Exchange_Rate)) - 1) * 100`

---

## 🚀 시작하기 (Getting Started)

### 환경 변수 설정
`.env` 파일을 루트 디렉토리에 생성하고 아래 변수를 설정하세요:
```env
ExchangeRate_API_KEY=your_api_key_here
```
> [ExchangeRate-API](https://www.exchangerate-api.com/)에서 무료 API 키를 발급받을 수 있습니다. (미설정 시에도 Public API를 통해 작동합니다.)

### 로컬 개발 서버 실행
```bash
npm install
npm run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

---

## 📦 배포 (Deployment)

본 프로젝트는 Vercel Free Tier에 최적화되어 있습니다.
1. GitHub 저장소를 포크합니다.
2. 환경 변수(`ExchangeRate_API_KEY`)를 설정합니다. (Vercel Dashboard -> Settings -> Environment Variables)
3. Vercel에서 새 프로젝트를 생성하고 포크한 저장소를 연결합니다.


---

## ⚖️ 라이선스 및 면책 조항 (License & Disclaimer)

- **License**: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
- **Copyright**: 2023-present [GITSAM](https://gitsam.com)
- **Disclaimer**: 본 서비스에서 제공하는 모든 데이터는 투자 권유가 아니며, 데이터 지연 등으로 인한 손실에 대해 책임을 지지 않습니다.

---
*Created by [gitsam](https://gitsam.com). 생각은 깊게, 구현은 쉽게.*
