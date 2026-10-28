// 홈 — 네이버 블로그 최신 글 섹션 (서버 컴포넌트, RSS 1시간 캐시)
import Link from "next/link";
import { getBlogPosts } from "@/lib/naverBlog";
import { PostCard, PostRow, Thumb, CategoryChip, Meta } from "./BlogCards";

export default async function BlogSection() {
  const posts = await getBlogPosts();
  if (posts.length === 0) return null;
  const [featured, ...rest] = posts;

  return (
    <section className="px-5 lg:px-20 py-16 lg:py-24 max-w-[1440px] mx-auto">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <p className="text-[13px] font-bold text-brand-blue mb-2">세무회계 새벽 블로그</p>
            <h2 className="text-[28px] lg:text-[40px] font-extrabold text-text-primary tracking-tight leading-tight">
              세무사가 직접 씁니다.
            </h2>
            <p className="mt-2 text-[15px] lg:text-[17px] text-text-secondary font-medium">
              매주 새 글이 올라옵니다.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1 text-[14px] font-bold text-text-primary hover:text-brand-blue no-underline shrink-0"
          >
            전체 글 보기 →
          </Link>
        </div>

        {/* PC: 대표 글 + 최신 리스트 */}
        <div className="hidden md:grid grid-cols-12 gap-10">
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group col-span-5 flex flex-col no-underline"
          >
            <Thumb post={featured} className="aspect-square rounded-3xl border border-ui-border" />
            <div className="pt-5 flex flex-col gap-2">
              <CategoryChip post={featured} />
              <h3 className="text-[22px] font-extrabold text-text-primary leading-snug tracking-tight group-hover:text-brand-blue transition-colors">
                {featured.title}
              </h3>
              <p className="text-[14px] text-text-secondary leading-relaxed line-clamp-2">{featured.excerpt}</p>
              <Meta post={featured} />
            </div>
          </a>
          <div className="col-span-7 flex flex-col justify-between">
            <div>
              {rest.slice(0, 5).map((p) => (
                <PostRow key={p.id} post={p} />
              ))}
            </div>
            <Link
              href="/blog"
              className="mt-4 block text-center rounded-xl border border-ui-border py-3.5 text-[14px] font-bold text-text-primary hover:border-brand-blue hover:text-brand-blue transition-colors no-underline"
            >
              블로그 글 {posts.length}개 전체 보기
            </Link>
          </div>
        </div>

        {/* 모바일: 가로 스와이프 캐러셀 */}
        <div className="md:hidden -mx-5">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {posts.slice(0, 6).map((p) => (
              <div key={p.id} className="snap-start shrink-0 w-[76%]">
                <PostCard post={p} />
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/blog"
          className="md:hidden mt-6 block text-center rounded-xl bg-ui-surface border border-ui-border py-3.5 text-[14px] font-bold text-text-primary no-underline"
        >
          전체 글 보기
        </Link>
      </div>
    </section>
  );
}
