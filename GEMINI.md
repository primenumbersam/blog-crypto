## Project: Zero-Ad Lightweight 김프

**Role:** Senior Full-stack Engineer / System Architect
**Objective:** 광고가 없고 필요한 지표만 빠르게 제공하는 개인용 김치프리미엄(Kimp) 대시보드 구축.

### 1. Technical Stack (Base)
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS + shadcn/ui
* **Deployment/Hosting:** Vercel (Free Tier)
* **Charts:** TradingView Lightweight Charts & Free Widgets
* **Data Updates:** ISR (Incremental Static Regeneration) via Vercel Cron Jobs (15 min interval)

### 2. Architecture & Data Flow
* **External APIs:**
    * **Upbit API:** 국내 암호화폐 시세 (`KRW-BTC`, `KRW-ETH` 등)
    * **Binance API:** 해외 암호화폐 시세 (`BTCUSDT`, `ETHUSDT` 등)
    * **Export-Import Bank of Korea (공공데이터포털):** 실시간 환율 정보 API
    * **Coinness RSS:** 속보 데이터 피드
* **Update Logic:**
    * Vercel Cron Job이 15분마다 전용 API Route를 호출.
    * 각 API에서 데이터를 가져와 김프(Premium) 계산: $$((\text{KRW\_Price} / (\text{USD\_Price} \times \text{Exchange\_Rate})) - 1) \times 100$$
    * 계산된 데이터를 기반으로 페이지 캐시 갱신 (On-demand Revalidation).

### 3. Core Pages Specification
* **Top Nav:** 메인, 김프, 지표, 속보
* **Main Page:** `BTCUSD` TradingView Chart (Advanced Real-time Chart Widget) 대형 배치.
* **Premium Page (Table):**
    * Assets: USDT, USDC, BTC, ETH, XRP, SOL, LINK, Gold (Gold는 TradingView 위젯으로 대체 가능 확인).
    * Fields: 자산명(링크), 현재가(USD/KRW), 김프(%), 3일 전 대비(%), 52주 고가/저가 대비(%).
* **Indicators Page (Groups):**
    * Crypto: BTC Dominance, Total Market Cap, Fear & Greed Index.
    * Stock: SPX500, NAS100, US30, KOSPI, KOSDAQ, KOSPI200.
    * Commodity: Gold, Silver, Copper, WTI(USOIL), Brent(UKOIL), Natural Gas.
    * Currency: USDKRW, EURKRW, JPYKRW.
    * *Note: 대부분 TradingView Market Overview 위젯으로 구현.*
* **News Page:** `rss-parser` 라이브러리를 사용해 Coinness RSS 피드 렌더링.

### 4. Implementation Guidelines (Gemini Instructions)
* **Step-by-Step:** 한 번에 전체를 짜지 말고, 컴포넌트 단위로 분할하여 진행할 것.
* **Modern Coding:** Next.js App Router의 Server Components와 Client Components를 엄격히 구분하여 성능 최적화.
* **Constraint:** 광고 및 불필요한 UI 요소를 배제하고 shadcn/ui 기반의 미니멀한 디자인 유지.
* **Fallback:** 공공데이터포털 환율 API 호출 실패 시 마지막 성공 데이터를 사용하도록 예외 처리 로직 포함.
