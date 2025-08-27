'use client'

import { useState, useEffect, useMemo } from 'react';
import BlogCard from '../comps/blog/BlogCard';
import { BlogPost } from '../lib/api';

// Define types
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

type SortOption = 'newest' | 'oldest' | 'reading-time';

// OPTIMIZED: Environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Search & Filter Component
export default function BlogPage() {
  // State management
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isSearching, setIsSearching] = useState(false);

  // OPTIMIZED: Fetch data with environment variables
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        
        // OPTIMIZED: Test health first with environment variable
        const healthCheck = await fetch(`${API_BASE_URL}/health`);
        if (!healthCheck.ok) {
          throw new Error(`Health check failed: ${healthCheck.status}`);
        }

        // OPTIMIZED: All API calls using environment variable
        const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/v1/posts`, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }).then(res => res.json()),
          fetch(`${API_BASE_URL}/v1/categories`, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }).then(res => res.json()),
          fetch(`${API_BASE_URL}/v1/tags`, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }).then(res => res.json()),
        ]);

        setPosts(postsResponse.data || []);
        setCategories(categoriesResponse.data || []);
        setTags(tagsResponse.data || []);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Search functionality with debouncing
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Calculate reading time - OPTIMIZED: Better HTML tag stripping
  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const cleanContent = content.replace(/<[^>]*>/g, '');
    const wordCount = cleanContent.split(' ').filter(word => word.length > 0).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Search filter - OPTIMIZED: Better search logic
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => {
        const title = post.title.toLowerCase();
        const content = post.content.replace(/<[^>]*>/g, '').toLowerCase();
        const excerpt = post.excerpt?.toLowerCase() || '';
        const categoryName = post.category?.name.toLowerCase() || '';
        const tagNames = post.tags?.map(tag => tag.name.toLowerCase()).join(' ') || '';
        
        return title.includes(query) || 
               content.includes(query) || 
               excerpt.includes(query) || 
               categoryName.includes(query) || 
               tagNames.includes(query);
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category?.slug === selectedCategory);
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        post.tags && post.tags.some(tag => selectedTags.includes(tag.slug))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
        case 'oldest':
          return new Date(a.published_at || a.created_at).getTime() - new Date(b.published_at || b.created_at).getTime();
        case 'reading-time':
          return calculateReadTime(a.content) - calculateReadTime(b.content);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchQuery, selectedCategory, selectedTags, sortBy]);

  // Handle tag toggle
  const toggleTag = (tagSlug: string) => {
    setSelectedTags(prev =>
      prev.includes(tagSlug)
        ? prev.filter(slug => slug !== tagSlug)
        : [...prev, tagSlug]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setSortBy('newest');
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedTags.length > 0 || sortBy !== 'newest';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center glass-card p-8 rounded-3xl">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full bg-blue-400/10 animate-pulse"></div>
            </div>
            <h3 className="text-xl font-semibold gradient-text-blue mb-2">Loading Blog</h3>
            <p className="text-gray-600">Fetching the latest articles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-3xl max-w-md mx-4 border border-red-200/50">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Connection Failed</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="text-sm text-gray-500">
            Make sure Laravel server is running on {API_BASE_URL.replace('/api', '')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative backdrop-blur-3xl bg-white/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
            <div className="text-center">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mb-8 glass-card border border-blue-200/50 hover-lift transition-smooth">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3 animate-pulse"></div>
                <span className="gradient-text-blue">Creative Technology Blog</span>
              </div>

              {/* Enhanced Title */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 fade-in-up">
                <span className="gradient-text-blue drop-shadow-sm">Blog</span>
              </h1>
              
              {/* Enhanced Subtitle */}
              <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-16 fade-in-up">
                Creative insights, tutorials, and thoughts on web development, technology, and the latest trends in software engineering
              </p>
             
              {/* Enhanced Stats with Glassmorphism */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="stagger-item glass-card p-8 rounded-3xl hover-lift group border border-white/20 shadow-large">
                  <div className="text-4xl font-bold gradient-text-blue mb-3 transition-smooth group-hover:scale-110">
                    {posts.length}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Articles</div>
                  <div className="w-16 h-1.5 bg-gradient-bg-primary rounded-full mx-auto mt-4 transition-smooth group-hover:w-20"></div>
                </div>
                <div className="stagger-item glass-card p-8 rounded-3xl hover-lift group border border-white/20 shadow-large">
                  <div className="text-4xl font-bold gradient-text-warm mb-3 transition-smooth group-hover:scale-110">
                    {categories.length}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Categories</div>
                  <div className="w-16 h-1.5 bg-gradient-bg-warm rounded-full mx-auto mt-4 transition-smooth group-hover:w-20"></div>
                </div>
                <div className="stagger-item glass-card p-8 rounded-3xl hover-lift group border border-white/20 shadow-large">
                  <div className="text-4xl font-bold gradient-text-blue mb-3 transition-smooth group-hover:scale-110">
                    {tags.length}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Tags</div>
                  <div className="w-16 h-1.5 bg-gradient-bg-cool rounded-full mx-auto mt-4 transition-smooth group-hover:w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Search & Filter Section */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-y border-white/20 shadow-large">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Compact Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-2xl mx-auto">
              <div className="glass-card rounded-2xl p-1 shadow-medium border border-white/30">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search articles, categories, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-11 pr-11 py-3 bg-transparent border-0 text-base placeholder-gray-500 focus:outline-none focus:ring-0 text-gray-900 font-medium"
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  {searchQuery && !isSearching && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors group"
                    >
                      <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Compact Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Compact Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</span>
                <div className="glass-card rounded-xl p-0.5 border border-white/30">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent border-0 px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-0 rounded-lg cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Compact Sort */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Sort</span>
                <div className="glass-card rounded-xl p-0.5 border border-white/30">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent border-0 px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-0 rounded-lg cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="reading-time">Reading Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Compact Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl transition-all duration-300 hover-lift border border-blue-200 hover:border-blue-600"
              >
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear
              </button>
            )}
          </div>

          {/* Compact Tag Filters */}
          {tags.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mr-1">Tags</span>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.slug)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 hover-lift ${
                      selectedTags.includes(tag.slug)
                        ? 'glass-card text-blue-700 border-blue-300 shadow-glow-blue scale-105'
                        : 'glass-card text-gray-700 border-white/30 hover:border-blue-200 hover:text-blue-600'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 transition-colors ${
                      selectedTags.includes(tag.slug) ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                    }`}></span>
                    <span>#{tag.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Enhanced Results Header */}
        <div className="text-center mb-12">
          <div className="glass-card inline-block px-8 py-4 rounded-3xl border border-white/30 mb-6">
            <h2 className="text-3xl font-bold gradient-text-blue">
              {searchQuery ? `Search Results` : 'Latest Articles'}
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            <span className="font-semibold text-2xl gradient-text-warm">{filteredAndSortedPosts.length}</span>
            {' '}{filteredAndSortedPosts.length === 1 ? 'article' : 'articles'} found
            {searchQuery && <span> for &ldquo;<span className="font-semibold gradient-text-blue">{searchQuery}</span>&rdquo;</span>}
          </p>
        </div>

        {/* Enhanced Posts Grid */}
        {filteredAndSortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredAndSortedPosts.map((post, index) => (
              <div key={post.id} className="stagger-item" style={{ animationDelay: `${index * 0.15}s` }}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          /* Enhanced No Results State */
          <div className="text-center py-20">
            <div className="glass-card p-12 rounded-3xl max-w-lg mx-auto border border-white/30 shadow-large">
              <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center">
                <svg className="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold gradient-text-blue mb-4">No articles found</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {searchQuery
                  ? `We couldn&apos;t find any articles matching &ldquo;${searchQuery}&rdquo;. Try adjusting your search or filters.`
                  : 'No articles match your current filters. Try adjusting your selection.'
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-8 py-4 text-sm font-semibold text-white bg-gradient-bg-primary rounded-2xl hover-lift transition-all duration-300 shadow-large hover:shadow-glow-blue"
                >
                  <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}