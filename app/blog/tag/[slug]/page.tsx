import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlogPost } from '../../../lib/api';
import BlogCard from '../../../comps/blog/BlogCard';

// OPTIMIZED: Next.js 15+ async params support
interface TagPageProps {
  readonly params: Promise<{
    readonly slug: string;
  }>;
}

// OPTIMIZED: Direct API calls with environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getTagData(slug: string) {
  try {
    const [tagResponse, postsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/v1/tags/slug/${slug}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      }),
      fetch(`${API_BASE_URL}/v1/tags/${slug}/posts`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      })
    ]);

    if (!tagResponse.ok || !postsResponse.ok) {
      if (tagResponse.status === 404 || postsResponse.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${tagResponse.status || postsResponse.status}`);
    }

    const [tagData, postsData] = await Promise.all([
      tagResponse.json(),
      postsResponse.json()
    ]);

    return {
      tag: tagData.success ? tagData.data : null,
      posts: postsData.success ? postsData.data : [],
      meta: postsData.meta || null
    };
  } catch (error) {
    console.error('Error fetching tag data:', error);
    return null;
  }
}

export default async function TagPage({ params }: TagPageProps) {
  // OPTIMIZED: Await params for Next.js 15+
  const resolvedParams = await params;
  
  const data = await getTagData(resolvedParams.slug);

  if (!data?.tag) {
    notFound();
  }

  const { tag, posts, meta } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden bg-white/40 backdrop-blur-sm">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-teal-600/5 to-cyan-600/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>
          </nav>

          {/* Tag Header */}
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-6 glass-card border border-emerald-200/50">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-emerald-700">Tag</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                #{tag.name}
              </span>
            </h1>
            
            <div className="glass-card inline-block px-6 py-3 rounded-2xl border border-white/30">
              <p className="text-lg font-medium text-gray-700">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {meta?.total ?? 0}
                </span>
                {' '}{(meta?.total ?? 0) === 1 ? 'article' : 'articles'} tagged with{' '}
                <span className="font-semibold text-emerald-700">{tag.name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts && posts.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="text-center mb-12">
              <div className="glass-card inline-block px-8 py-4 rounded-3xl border border-white/30 mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Tagged Articles
                </h2>
              </div>
            </div>
            
            {/* Enhanced Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post: BlogPost, index: number) => (
                <div key={post.id} className="stagger-item" style={{ animationDelay: `${index * 0.15}s` }}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>

            {/* Pagination Info */}
            {meta?.total && meta?.per_page && meta.total > meta.per_page && (
              <div className="text-center mt-16">
                <div className="glass-card inline-block px-6 py-3 rounded-2xl border border-white/30">
                  <p className="text-sm text-gray-600">
                    Showing {posts.length} of {meta.total} articles
                    {meta?.current_page && meta?.last_page && (
                      <span> • Page {meta.current_page} of {meta.last_page}</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Enhanced No Results State */
          <div className="text-center py-20">
            <div className="glass-card p-12 rounded-3xl max-w-lg mx-auto border border-white/30 shadow-large">
              <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <svg className="w-14 h-14 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                No Tagged Articles
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                No articles have been tagged with <span className="font-semibold text-emerald-700">#{tag.name}</span> yet. 
                Check back soon for new content!
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl hover:from-emerald-600 hover:to-teal-700 hover-lift transition-all duration-300 shadow-large hover:shadow-glow-blue"
              >
                <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Browse All Articles
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// OPTIMIZED: Metadata generation with async params
export async function generateMetadata({ params }: TagPageProps) {
  try {
    const resolvedParams = await params;
    const data = await getTagData(resolvedParams.slug);
    
    if (!data?.tag) {
      return {
        title: 'Tag Not Found',
        description: 'The requested tag could not be found.',
      };
    }
    
    const { tag, meta } = data;
    const articleCount = meta?.total ?? 0;
    
    return {
      title: `#${tag.name} | My Portfolio Blog`,
      description: `Discover ${articleCount} ${articleCount === 1 ? 'article' : 'articles'} tagged with ${tag.name}`,
      openGraph: {
        title: `#${tag.name} Tag`,
        description: `Articles tagged with ${tag.name}`,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.',
    };
  }
}