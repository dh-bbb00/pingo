export interface ParsedCardNotification {
  issuer:            string        // 카드사명 (예: '신한카드', '신한')
  last4:             string        // 카드번호 끝 4자리
  amountStr:         string        // 결제금액 문자열 (예: '10,000원')
  amount:            number        // 결제금액 숫자 (원 단위)
  isInstallment:     boolean       // 할부 여부
  installmentMonths: number | null // 할부 개월수. null = 일시불 또는 개월수 불명
  date:              string        // 결제일 (MM/DD)
  time:              string        // 결제시각 (HH:MM)
  merchant:          string        // 가맹점명
}

/**
 * 카드 승인 알림 여부 판별
 * title에 (4자리숫자)승인 패턴이 핵심 식별자 — 카드사명에 '카드' 없어도 동작
 */
export function isCardUsageNotification(title: string, text: string): boolean {
  return /\(\d{4}\)\s*승인/.test(title) && /[\d,]+원/.test(text)
}

/**
 * 카드사명 + 끝 4자리 파싱
 * 예: "신한카드(1234)승인 김*현" → { issuer: '신한카드', last4: '1234' }
 * 예: "신한(1234)승인"           → { issuer: '신한',     last4: '1234' }
 */
function parseIssuerAndLast4(title: string): { issuer: string; last4: string } | null {
  const match = title.match(/^(.+?)\((\d{4})\)\s*승인/)
  if (!match) return null
  return { issuer: match[1].trim(), last4: match[2] }
}

/**
 * 결제금액 + 결제유형 파싱
 * 괄호 형식: 일시불/개월수 텍스트·숫자 모두 지원
 * 슬래시 형식: 숫자만 지원
 *
 * 예: "10,000원(일시불)"    → isInstallment: false, installmentMonths: null
 * 예: "10,000원(3개월)"     → isInstallment: true,  installmentMonths: 3
 * 예: "10,000원(할부3개월)" → isInstallment: true,  installmentMonths: 3
 * 예: "10,000원(3개월할부)" → isInstallment: true,  installmentMonths: 3
 * 예: "10,000원(06)"        → isInstallment: true,  installmentMonths: 6
 * 예: "10,000원(할부)"      → isInstallment: true,  installmentMonths: null
 * 예: "10,000원/06"         → isInstallment: true,  installmentMonths: 6
 */
function parseAmountAndPayType(text: string): {
  amountStr:         string
  amount:            number
  isInstallment:     boolean
  installmentMonths: number | null
} | null {
  const amountMatch = text.match(/([\d,]+)원/)
  if (!amountMatch) return null

  const amountStr  = `${amountMatch[1]}원`
  const amount     = parseInt(amountMatch[1].replace(/,/g, ''), 10)

  // 금액 바로 뒤 결제유형 추출 — 괄호 or 슬래시
  const afterAmount = text.slice(text.indexOf(amountMatch[0]) + amountMatch[0].length)
  const parenMatch  = afterAmount.match(/^\s*\(([^)]+)\)/)
  const slashMatch  = afterAmount.match(/^\s*\/(\d+)/)

  const payTypeRaw = parenMatch?.[1].trim() ?? slashMatch?.[1] ?? null

  // 결제유형 정보 없거나 일시불
  if (!payTypeRaw || payTypeRaw === '일시불') {
    return { amountStr, amount, isInstallment: false, installmentMonths: null }
  }

  // 개월수 추출: 순수 숫자(예: "06") 또는 "N개월" 형식 모두 처리
  const monthMatch = payTypeRaw.match(/^0*(\d+)$/) ?? payTypeRaw.match(/(\d+)\s*개월/)
  const installmentMonths = monthMatch ? parseInt(monthMatch[1], 10) : null

  return { amountStr, amount, isInstallment: true, installmentMonths }
}

/**
 * 결제일시 파싱 — 시간 구분자 ':' / ';' 둘 다 허용 (기기마다 다를 수 있음)
 * 예: "06/19 11;13 전셰프의뷔페" → { date: '06/19', time: '11:13' }
 */
function parseDateAndTime(text: string): { date: string; time: string } | null {
  const match = text.match(/(\d{2}\/\d{2})\s+(\d{2}[;:]\d{2})/)
  if (!match) return null
  return { date: match[1], time: match[2].replace(';', ':') }
}

/**
 * 가맹점명 파싱 — 날짜/시간 뒤, '/' 구분자 앞까지
 * 예: "06/19 11;13 가맹점 / 누적 2,222,222원" → '가맹점'
 */
function parseMerchant(text: string): string | null {
  const match = text.match(/\d{2}[;:]\d{2}\s+(.+?)(?:\s*\/|$)/)
  if (!match) return null
  return match[1].trim()
}

export function parseCardNotification(
  title: string,
  text:  string,
): ParsedCardNotification | null {
  const issuerData   = parseIssuerAndLast4(title)
  const amountData   = parseAmountAndPayType(text)
  const dateTimeData = parseDateAndTime(text)
  const merchant     = parseMerchant(text)

  if (!issuerData || !amountData || !dateTimeData || !merchant) return null

  return {
    issuer:            issuerData.issuer,
    last4:             issuerData.last4,
    amountStr:         amountData.amountStr,
    amount:            amountData.amount,
    isInstallment:     amountData.isInstallment,
    installmentMonths: amountData.installmentMonths,
    date:              dateTimeData.date,
    time:              dateTimeData.time,
    merchant,
  }
}
