// 네이버 블로그(tax_dawn) RSS → 홈페이지 블로그 카드 데이터
// - RSS는 최신 50개 글을 제공. 1시간 단위로 재검증(ISR)해서 새 글이 자동 반영된다.
// - 썸네일(blogthumb.pstatic.net)은 외부 Referer가 붙으면 403 → <img referrerPolicy="no-referrer"> 필수.

export const BLOG_URL = "https://blog.naver.com/tax_dawn";
const RSS_URL = "https://rss.blog.naver.com/tax_dawn.xml";
export const BLOG_REVALIDATE = 3600;

export interface BlogPost {
  id: string; // logNo
  title: string;
  url: string;
  category: string;
  excerpt: string;
  thumbnail: string | null;
  publishedAt: string; // ISO
  tags: string[];
  author: "김근량" | "고유빈" | null;
}

function cdata(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return m ? m[1].trim() : "";
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

// 네이버 카테고리는 "상속ᆞ증여세"처럼 한글 아래아(ᆞ)를 가운뎃점으로 쓴다
function normalizeCategory(s: string): string {
  return s.replace(/ᆞ/g, "·").trim();
}

export function parseRss(xml: string): BlogPost[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.map((item) => {
    const guid = cdata(item, "guid");
    const id = guid.split("/").pop() ?? guid;
    const rawDesc = cdata(item, "description");
    const img = rawDesc.match(/<img[^>]+src="([^"]+)"/);
    const text = decodeEntities(rawDesc.replace(/<[^>]+>/g, " "))
      .replace(/\.{3,}\s*$/, "")
      .replace(/\s+/g, " ")
      .trim();
    const kim = text.indexOf("김근량");
    const ko = text.indexOf("고유빈");
    const author = kim < 0 && ko < 0 ? null : ko < 0 || (kim >= 0 && kim < ko) ? "김근량" : "고유빈";
    return {
      id,
      title: decodeEntities(cdata(item, "title")),
      url: `${BLOG_URL}/${id}`,
      category: normalizeCategory(cdata(item, "category")),
      excerpt: text,
      // type=s3(365px) → w2(743px) 고해상도
      thumbnail: img ? img[1].replace(/type=s3$/, "type=w2") : null,
      publishedAt: new Date(cdata(item, "pubDate")).toISOString(),
      tags: cdata(item, "tag")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      author,
    };
  });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(RSS_URL, { next: { revalidate: BLOG_REVALIDATE } });
    if (!res.ok) return [];
    return parseRss(await res.text());
  } catch {
    return [];
  }
}

// 계산기별 관련 글 — 제목·태그·카테고리에서 키워드 매칭, 최신순
export const RELATED_KEYWORDS: Record<string, string[]> = {
  "income-tax": ["종합소득세", "종소세", "사업자", "절세", "경비", "프리랜서", "3.3%"],
  "inherit-gift": ["상속", "증여"],
  vat: ["부가가치세", "부가세", "간이과세", "폐업"],
  "acquisition-tax": ["취득세", "자금조달", "자금출처", "아파트"],
  "holding-tax": ["보유세", "종부세", "종합부동산세", "재산세", "세제개편"],
  vehicle: ["차량", "승용차", "리스", "렌트", "경비"],
  insurance: ["4대보험", "인건비", "원천세", "직원", "알바", "급여"],
  "loan-agreement": ["차용증", "자금출처", "증여", "자금조달"],
};

export function pickRelated(posts: BlogPost[], key: string, limit = 3): BlogPost[] {
  const kws = RELATED_KEYWORDS[key] ?? [];
  const scored = posts
    .map((p, i) => {
      const hay = `${p.title} ${p.category} ${p.tags.join(" ")}`;
      const score = kws.reduce((s, k) => s + (hay.includes(k) ? (p.title.includes(k) ? 3 : 1) : 0), 0);
      return { p, i, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i);
  return scored.slice(0, limit).map((x) => x.p);
}

export function isNew(iso: string, days = 7): boolean {
  return Date.now() - new Date(iso).getTime() < days * 86400000;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  // 서버(UTC)·클라이언트 동일 결과를 위해 KST 기준으로 고정
  const k = new Date(d.getTime() + 9 * 3600000);
  return `${k.getUTCFullYear()}.${String(k.getUTCMonth() + 1).padStart(2, "0")}.${String(k.getUTCDate()).padStart(2, "0")}`;
}
