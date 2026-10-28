"use client";

import { useMemo, useState } from "react";
import type { BlogPost } from "@/lib/naverBlog";
import { FeaturedPost, PostCard } from "./BlogCards";

const PAGE = 12;
const AUTHORS = ["김근량", "고유빈"] as const;

export default function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState("전체");
  const [author, setAuthor] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => p.category && counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (category === "전체" || p.category === category) &&
        (!author || p.author === author) &&
        (!q || `${p.title} ${p.tags.join(" ")} ${p.excerpt}`.toLowerCase().includes(q))
    );
  }, [posts, category, author, query]);

  const isDefault = category === "전체" && !author && !query.trim();
  // 기본 화면에서만 최신 글을 대표 카드로 크게, 필터·검색 중엔 전부 그리드로
  const featured = isDefault ? filtered[0] : null;
  const others = isDefault ? filtered.slice(1) : filtered;
  const list = others.slice(0, shown);

  const chip = (active: boolean) =>
    `shrink-0 px-3.5 py-2 rounded-full text-[13px] font-bold border transition-colors ${
      active
        ? "bg-text-primary text-white border-text-primary"
        : "bg-white text-text-secondary border-ui-border hover:border-text-secondary"
    }`;

  return (
    <>
      {/* 필터 바 */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-8">
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0 lg:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button className={chip(category === "전체")} onClick={() => { setCategory("전체"); setShown(PAGE); }}>
            전체 <span className="opacity-60">{posts.length}</span>
          </button>
          {categories.map(([c, n]) => (
            <button key={c} className={chip(category === c)} onClick={() => { setCategory(c); setShown(PAGE); }}>
              {c} <span className="opacity-60">{n}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 lg:ml-auto">
          {AUTHORS.map((a) => (
            <button
              key={a}
              className={chip(author === a)}
              onClick={() => { setAuthor(author === a ? null : a); setShown(PAGE); }}
            >
              {a} 세무사
            </button>
          ))}
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShown(PAGE); }}
            placeholder="글 검색"
            aria-label="블로그 글 검색"
            className="min-w-0 flex-1 lg:w-44 lg:flex-none px-4 py-2 rounded-full border border-ui-border text-[13px] outline-none focus:border-brand-blue"
          />
        </div>
      </div>

      {featured && (
        <div className="mb-12">
          <FeaturedPost post={featured} />
        </div>
      )}

      {list.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 lg:gap-x-8 lg:gap-y-14">
          {list.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        !featured && (
          <p className="py-20 text-center text-[15px] text-text-secondary">조건에 맞는 글이 없습니다.</p>
        )
      )}

      {others.length > shown && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setShown(shown + PAGE)}
            className="px-8 py-3.5 rounded-xl border border-ui-border text-[14px] font-bold text-text-primary hover:border-brand-blue hover:text-brand-blue transition-colors"
          >
            더 보기 ({others.length - shown})
          </button>
        </div>
      )}
    </>
  );
}
