import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlogPost } from '../../../lib/api';
import BlogCard from '../../../comps/blog/BlogCard';

// OPTIMIZED: Next.js 15+ async params support
interface CategoryPageProps {
  readonly params: Promise<{
    readonly slug: string;
  }>;
}

// OPTIMIZED: Direct API calls with environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getCategoryData(slug: string) {
  try {
    const [categoryResponse, postsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/v1/categories/slug/${slug}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      }),
      fetch(`${API_BASE_URL}/v1/categories/${slug}/posts`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      })
    ]);

    if (!categoryResponse.ok || !postsResponse.ok) {
      if (categoryResponse.status === 404 || postsResponse.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${categoryResponse.status || postsResponse.status}`);
    }

    const [categoryData, postsData] = await Promise.all([
      categoryResponse.json(),
      postsResponse.json()
    ]);

    return {
      category: categoryData.success ? categoryData.data : null,
      posts: postsData.success ? postsData.data : [],
      meta: postsData.meta || null
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return null;
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // OPTIMIZED: Await params for Next.js 15+
  const resolvedParams = await params;
  
  const data = await getCategoryData(resolvedParams.slug);

  if (!data?.category) {
    notFound();
  }

  const { category, posts, meta } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden bg-white/40 backdrop-blur-sm">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>
          </nav>

          {/* Category Header */}
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-6 glass-card border border-blue-200/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span className="gradient-text-blue">Category</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 gradient-text-blue">
              {category.name}
            </h1>
            
            {category.description && (
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6">
                {category.description}
              </p>
            )}
            
            <div className="glass-card inline-block px-6 py-3 rounded-2xl border border-white/30">
              <p className="text-lg font-medium text-gray-700">
                <span className="text-2xl font-bold gradient-text-warm">{meta?.total ?? 0}</span>
                {' '}{(meta?.total ?? 0) === 1 ? 'article' : 'articles'} in this category
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
                <h2 className="text-3xl font-bold gradient-text-blue">Articles</h2>
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
              <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center">
                <svg className="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold gradient-text-blue mb-4">No Articles Yet</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                No articles have been published in the <span className="font-semibold">{category.name}</span> category yet. Check back soon!
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center px-8 py-4 text-sm font-semibold text-white bg-gradient-bg-primary rounded-2xl hover-lift transition-all duration-300 shadow-large hover:shadow-glow-blue"
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
export async function generateMetadata({ params }: CategoryPageProps) {
  try {
    const resolvedParams = await params;
    const data = await getCategoryData(resolvedParams.slug);
    
    if (!data?.category) {
      return {
        title: 'Category Not Found',
        description: 'The requested category could not be found.',
      };
    }
    
    const { category, meta } = data;
    const articleCount = meta?.total ?? 0;
    
    return {
      title: `${category.name} | Your Portfolio Blog`,
      description: category.description ?? `Explore ${articleCount} ${articleCount === 1 ? 'article' : 'articles'} in the ${category.name} category`,
      openGraph: {
        title: `${category.name} Category`,
        description: category.description ?? `Articles in ${category.name} category`,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }
}