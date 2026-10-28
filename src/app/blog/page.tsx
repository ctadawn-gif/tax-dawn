import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogExplorer from "@/components/blog/BlogExplorer";
import { BLOG_URL, getBlogPosts } from "@/lib/naverBlog";

// 네이버 블로그 RSS를 1시간마다 다시 읽어 새 글을 반영
export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-5 lg:px-10 py-10 lg:py-14">
        <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#03C75A]/10 text-[#03a14a] rounded-full px-3 py-1.5 text-[13px] font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#03C75A]" />
              네이버 블로그 연동
            </div>
            <h1 className="text-[30px] lg:text-[42px] font-extrabold text-text-primary tracking-tight leading-tight">
              세무 블로그
            </h1>
            <p className="mt-3 text-[15px] lg:text-[17px] text-text-secondary font-medium leading-relaxed">
              대표세무사 2인이 직접 씁니다.
              <br className="md:hidden" />
              <span className="hidden md:inline"> </span>실제 상담에서 나온 이야기만.
            </p>
          </div>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#03C75A] text-white text-[14px] font-bold hover:bg-[#02b351] transition-colors no-underline shrink-0"
          >
            <span className="font-extrabold">N</span> 블로그 이웃추가
          </a>
        </header>

        {posts.length > 0 ? (
          <BlogExplorer posts={posts} />
        ) : (
          <div className="py-24 text-center">
            <p className="text-[15px] text-text-secondary mb-4">글을 불러오지 못했습니다.</p>
            <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-blue">
              네이버 블로그에서 보기 →
            </a>
          </div>
        )}

        <div className="mt-20 rounded-3xl bg-brand-navy px-6 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-white text-[20px] md:text-[24px] font-extrabold tracking-tight">
              내 상황은 어떨까요?
            </p>
            <p className="text-white/60 text-[14px] md:text-[15px] mt-1.5">
              글로 다 못 담은 건 상담에서.
            </p>
          </div>
          <div className="flex gap-2.5">
            <Link
              href="/#calculators"
              className="flex-1 md:flex-none text-center px-5 py-3 rounded-xl bg-white/10 text-white text-[14px] font-bold hover:bg-white/20 transition-colors no-underline"
            >
              계산기 써보기
            </Link>
            <Link
              href="/contact"
              className="flex-1 md:flex-none text-center px-5 py-3 rounded-xl bg-brand-blue text-white text-[14px] font-bold hover:bg-blue-700 transition-colors no-underline"
            >
              상담 문의
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
