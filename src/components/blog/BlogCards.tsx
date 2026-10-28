// 블로그 카드 공용 컴포넌트 — 서버/클라이언트 양쪽에서 사용 (hooks 없음)
// 썸네일은 네이버 핫링크 차단(외부 Referer → 403) 때문에 반드시 referrerPolicy="no-referrer"
import { type BlogPost, formatDate, isNew } from "@/lib/naverBlog";

export function Thumb({ post, className = "" }: { post: BlogPost; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-ui-surface ${className}`}>
      {post.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.thumbnail}
          alt=""
          referrerPolicy="no-referrer"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-slate-300">
          세무회계 새벽
        </div>
      )}
    </div>
  );
}

export function CategoryChip({ post }: { post: BlogPost }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-blue">
      {post.category}
      {isNew(post.publishedAt) && (
        <span className="text-[10px] font-extrabold text-white bg-red-500 rounded px-1.5 py-[1px]">NEW</span>
      )}
    </span>
  );
}

export function Meta({ post }: { post: BlogPost }) {
  return (
    <p className="text-[12px] text-slate-400 font-medium">
      {post.author && <span className="text-text-secondary">{post.author} 세무사 · </span>}
      {formatDate(post.publishedAt)}
    </p>
  );
}

/** 세로형 카드 (그리드·가로 캐러셀용) */
export function PostCard({ post }: { post: BlogPost }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col no-underline"
    >
      <Thumb post={post} className="aspect-square rounded-2xl border border-ui-border" />
      <div className="pt-4 flex flex-col gap-1.5">
        <CategoryChip post={post} />
        <h3 className="text-[16px] font-extrabold text-text-primary leading-snug tracking-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
          {post.title}
        </h3>
        <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2">{post.excerpt}</p>
        <Meta post={post} />
      </div>
    </a>
  );
}

/** 가로형 리스트 행 (토스 테크 스타일) */
export function PostRow({ post }: { post: BlogPost }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-5 py-4 no-underline border-b border-ui-border last:border-b-0"
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <CategoryChip post={post} />
        <h3 className="text-[15px] md:text-[16px] font-extrabold text-text-primary leading-snug tracking-tight line-clamp-2 md:line-clamp-1 group-hover:text-brand-blue transition-colors">
          {post.title}
        </h3>
        <p className="hidden md:block text-[13px] text-text-secondary leading-relaxed line-clamp-1">{post.excerpt}</p>
        <Meta post={post} />
      </div>
      <Thumb post={post} className="w-[76px] h-[76px] md:w-[92px] md:h-[92px] shrink-0 rounded-xl border border-ui-border" />
    </a>
  );
}

/** 대표 글 (가로 히어로형) */
export function FeaturedPost({ post, label = "최신 글" }: { post: BlogPost; label?: string }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid md:grid-cols-[minmax(0,420px)_1fr] gap-6 md:gap-10 items-center rounded-3xl border border-ui-border bg-white p-4 md:p-6 hover:border-brand-blue/40 hover:shadow-xl hover:shadow-blue-900/5 transition-all no-underline"
    >
      <Thumb post={post} className="aspect-square rounded-2xl" />
      <div className="flex flex-col gap-3 md:pr-4 pb-2 md:pb-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold tracking-wide text-white bg-brand-navy rounded-full px-2.5 py-1">
            {label}
          </span>
          <CategoryChip post={post} />
        </div>
        <h3 className="text-[22px] md:text-[28px] font-extrabold text-text-primary leading-[1.3] tracking-tight group-hover:text-brand-blue transition-colors">
          {post.title}
        </h3>
        <p className="text-[14px] md:text-[15px] text-text-secondary leading-relaxed line-clamp-3 md:line-clamp-4">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between mt-1">
          <Meta post={post} />
          <span className="text-[13px] font-bold text-brand-blue">읽어보기 →</span>
        </div>
      </div>
    </a>
  );
}
