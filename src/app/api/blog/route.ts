import { getBlogPosts, pickRelated } from "@/lib/naverBlog";

/**
 * 계산기(클라이언트 컴포넌트)용 관련 블로그 글
 *   GET /api/blog?k=<계산기 슬러그>&n=3
 * RSS는 lib에서 1시간 캐시, 응답도 CDN에 1시간 캐시.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("k") ?? "";
  const n = Math.min(6, Math.max(1, Number(searchParams.get("n")) || 3));
  const posts = await getBlogPosts();
  const related = key ? pickRelated(posts, key, n) : posts.slice(0, n);
  return Response.json(related, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
