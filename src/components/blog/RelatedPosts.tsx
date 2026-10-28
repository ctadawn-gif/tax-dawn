"use client";

// 계산기 하단 "관련 블로그 글" — 계산기 페이지가 클라이언트 컴포넌트라 /api/blog 로 받아온다
import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/naverBlog";
import { PostCard, PostRow } from "./BlogCards";

export default function RelatedPosts({ k, className = "mb-8" }: { k: string; className?: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch(`/api/blog?k=${encodeURIComponent(k)}&n=3`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setPosts)
      .catch(() => {});
  }, [k]);

  if (posts.length === 0) return null;

  return (
    <div className={`no-print bg-white rounded-2xl p-6 md:p-8 border border-ui-border ${className}`}>
      <div className="flex items-center justify-between mb-2 md:mb-6">
        <h5 className="text-[16px] font-extrabold text-text-primary tracking-tight">세무사가 쓴 관련 글</h5>
        <Link href="/blog" className="text-[13px] font-bold text-text-secondary hover:text-brand-blue no-underline">
          전체 보기 →
        </Link>
      </div>
      <div className="md:hidden">
        {posts.map((p) => (
          <PostRow key={p.id} post={p} />
        ))}
      </div>
      <div className="hidden md:grid grid-cols-3 gap-6">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
