import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '../../lib/api';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Truncate content - FIXED: Replace deprecated substr() with substring()
  const truncateContent = (content: string, maxLength: number = 150): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Calculate reading time
  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <article className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-large hover:shadow-glow-blue border border-gray-200/60 overflow-hidden hover-lift transition-smooth">
      {/* Featured Image */}
      {post.featured_image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-700"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Reading Time Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 shadow-large">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {calculateReadTime(post.content)} min
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        {post.category && (
          <div className="mb-4">
            <Link
              href={`/blog/category/${post.category.slug}`}
              className="relative inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-smooth hover-lift group/category"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full group-hover/category:from-blue-500/20 group-hover/category:to-indigo-500/20 transition-all"></div>
              <div className="absolute inset-0 bg-white/70 rounded-full group-hover/category:bg-white/90 transition-colors"></div>
              <div className="relative w-2 h-2 rounded-full bg-blue-500 mr-2 group-hover/category:bg-indigo-500 transition-colors"></div>
              <span className="relative text-blue-700 group-hover/category:text-indigo-700 font-medium transition-colors">
                {post.category.name}
              </span>
            </Link>
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors duration-300">
          <Link
            href={`/blog/${post.slug || post.id}`}
            className="after:absolute after:inset-0"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt || truncateContent(post.content)}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="relative z-10 inline-flex items-center text-xs text-gray-500 hover:text-pink-600 transition-colors duration-200 bg-gray-50 hover:bg-pink-50 px-2.5 py-1 rounded-lg border border-gray-200 hover:border-pink-200 group/tag"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-400 group-hover/tag:bg-pink-500 mr-1.5 transition-colors"></span>
                  {tag.name}
                </Link>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            {post.author && (
              <>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-2 shadow-large">
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700">{post.author.name}</span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
              </>
            )}
            <time dateTime={post.published_at || post.created_at} className="text-gray-500">
              {formatDate(post.published_at || post.created_at)}
            </time>
          </div>
        </div>

        {/* Read More Button */}
        <div className="relative z-10">
          <Link
            href={`/blog/${post.slug || post.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition-all duration-200 group/button"
          >
            <span className="mr-2">Read Article</span>
            <svg
              className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-blue-200/50 transition-colors duration-500 pointer-events-none" />
      
      {/* Enhanced shadow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-glow-blue" />
    </article>
  );
};

export default BlogCard;