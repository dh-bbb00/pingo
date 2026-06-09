export interface ParsedCardNotification {
  issuer:   string  // 카드사명
  last4:    string  // 카드번호 끝 4자리
  amount:   string  // 결제금액 (원 단위 포함)
  payType:  string  // 결제유형 (일시불 | N개월)
  date:     string  // 결제일 (MM/DD)
  time:     string  // 결제시각 (HH:MM)
  merchant: string  // 가맹점명
}

// 카드사용 알림 여부 판별
export function isCardUsageNotification(title: string, text: string): boolean {
  return title.includes('카드') && title.includes('승인') && /\d+원\(/.test(text)
}

// 카드사용 알림 파싱
// 예: title="신한카드(0000)승인 김*현", text="10,000원(일시불)06/19 11;13 전셰프의뷔페"
export function parseCardNotification(
  title: string,
  text:  string,
): ParsedCardNotification | null {
  const titleMatch = title.match(/(.+카드[^(]*)\((\d{4})\)\s*승인/)
  if (!titleMatch) return null

  // 시간 구분자는 ':' 또는 ';' 둘 다 허용 (기기마다 다를 수 있음)
  const contentMatch = text.match(
    /([\d,]+원)\(([^)]+)\)\s*(\d{2}\/\d{2})\s+(\d{2}[;:]\d{2})\s+(.+)/,
  )
  if (!contentMatch) return null

  return {
    issuer:   titleMatch[1].trim(),
    last4:    titleMatch[2],
    amount:   contentMatch[1],
    payType:  contentMatch[2],
    date:     contentMatch[3],
    time:     contentMatch[4].replace(';', ':'),
    merchant: contentMatch[5].trim(),
  }
}
