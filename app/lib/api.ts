// app/lib/api.ts - OPTIMIZED VERSION

// Types
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  tags?: Tag[];
  author?: {
    name: string;
    email: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

// OPTIMIZED: Configuration constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// OPTIMIZED: In-memory cache with proper TypeScript generics
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class APICache {
  private readonly cache = new Map<string, CacheItem<unknown>>();

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if cache is expired
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    // FIXED: Properly cast the unknown type to T
    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new APICache();

// OPTIMIZED: Retry utility
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryFetch<T>(
  fetchFn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await fetchFn();
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      await sleep(RETRY_DELAY);
      return retryFetch(fetchFn, retries - 1);
    }
    throw error;
  }
}

function shouldRetry(error: unknown): boolean {
  const err = error as Error;
  if (err instanceof TypeError && err.message.includes('fetch')) {
    return true;
  }
  if (err.message?.includes('500') || err.message?.includes('502') || err.message?.includes('503')) {
    return true;
  }
  return false;
}

class BlogAPI {
  // OPTIMIZED: Enhanced fetch with caching, retries, and timeout
  private async fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit = {},
    useCache: boolean = true
  ): Promise<T> {
    const cacheKey = `${url}:${JSON.stringify(options)}`;

    // Check cache first
    if (useCache) {
      const cachedData = cache.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const fetchFn = async (): Promise<T> => {
      // OPTIMIZED: Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
          },
          cache: 'no-store',
          signal: controller.signal,
          ...options,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Cache successful responses
        if (useCache && response.ok) {
          cache.set(cacheKey, data);
        }

        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    try {
      return await retryFetch(fetchFn);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Health check - no cache
  async checkHealth(): Promise<HealthResponse> {
    return this.fetchWithErrorHandling<HealthResponse>(`${API_BASE_URL}/health`, {}, false);
  }

  // Posts endpoints
  async getAllPosts(): Promise<ApiResponse<BlogPost[]>> {
    return this.fetchWithErrorHandling<ApiResponse<BlogPost[]>>(`${API_BASE_URL}/v1/posts`);
  }

  async getPostById(id: number): Promise<ApiResponse<BlogPost>> {
    return this.fetchWithErrorHandling<ApiResponse<BlogPost>>(`${API_BASE_URL}/v1/posts/${id}`);
  }

  async getPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    return this.fetchWithErrorHandling<ApiResponse<BlogPost>>(`${API_BASE_URL}/v1/posts/slug/${slug}`);
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    return this.fetchWithErrorHandling<ApiResponse<Category>>(`${API_BASE_URL}/v1/categories/slug/${slug}`);
  }

  async getPostsByCategorySlug(slug: string): Promise<ApiResponse<BlogPost[]>> {
    return this.fetchWithErrorHandling<ApiResponse<BlogPost[]>>(`${API_BASE_URL}/v1/categories/${slug}/posts`);
  }

  async getTagBySlug(slug: string): Promise<ApiResponse<Tag>> {
    return this.fetchWithErrorHandling<ApiResponse<Tag>>(`${API_BASE_URL}/v1/tags/slug/${slug}`);
  }

  async getPostsByTagSlug(slug: string): Promise<ApiResponse<BlogPost[]>> {
    return this.fetchWithErrorHandling<ApiResponse<BlogPost[]>>(`${API_BASE_URL}/v1/tags/${slug}/posts`);
  }

  // Categories endpoints
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    return this.fetchWithErrorHandling<ApiResponse<Category[]>>(`${API_BASE_URL}/v1/categories`);
  }

  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    return this.fetchWithErrorHandling<ApiResponse<Category>>(`${API_BASE_URL}/v1/categories/${id}`);
  }

  async getPostsByCategory(categoryId: number): Promise<ApiResponse<BlogPost[]>> {
    return this.fetchWithErrorHandling<ApiResponse<BlogPost[]>>(`${API_BASE_URL}/v1/posts?category=${categoryId}`);
  }

  // Tags endpoints
  async getAllTags(): Promise<ApiResponse<Tag[]>> {
    return this.fetchWithErrorHandling<ApiResponse<Tag[]>>(`${API_BASE_URL}/v1/tags`);
  }

  async getTagById(id: number): Promise<ApiResponse<Tag>> {
    return this.fetchWithErrorHandling<ApiResponse<Tag>>(`${API_BASE_URL}/v1/tags/${id}`);
  }

  async getPostsByTag(tagId: number): Promise<ApiResponse<BlogPost[]>> {
    return this.fetchWithErrorHandling<ApiResponse<BlogPost[]>>(`${API_BASE_URL}/v1/posts?tag=${tagId}`);
  }

  // Search functionality - no cache for real-time results
  async searchPosts(query: string): Promise<ApiResponse<BlogPost[]>> {
    return this.fetchWithErrorHandling<ApiResponse<BlogPost[]>>(
      `${API_BASE_URL}/v1/posts?search=${encodeURIComponent(query)}`,
      {},
      false
    );
  }

  // OPTIMIZED: Cache management
  clearCache(): void {
    cache.clear();
  }

  // OPTIMIZED: Batch requests
  async batchRequest<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    try {
      return await Promise.all(requests.map(req => req()));
    } catch (error) {
      console.error('Batch request error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const blogAPI = new BlogAPI();

// Export individual methods for convenience
export const checkHealth = () => blogAPI.checkHealth();
export const getAllPosts = () => blogAPI.getAllPosts();
export const getPostById = (id: number) => blogAPI.getPostById(id);
export const getPostBySlug = (slug: string) => blogAPI.getPostBySlug(slug);
export const getAllCategories = () => blogAPI.getAllCategories();
export const getCategoryById = (id: number) => blogAPI.getCategoryById(id);
export const getPostsByCategory = (categoryId: number) => blogAPI.getPostsByCategory(categoryId);
export const getAllTags = () => blogAPI.getAllTags();
export const getTagById = (id: number) => blogAPI.getTagById(id);
export const getPostsByTag = (tagId: number) => blogAPI.getPostsByTag(tagId);
export const searchPosts = (query: string) => blogAPI.searchPosts(query);
export const getCategoryBySlug = (slug: string) => blogAPI.getCategoryBySlug(slug);
export const getPostsByCategorySlug = (slug: string) => blogAPI.getPostsByCategorySlug(slug);
export const getTagBySlug = (slug: string) => blogAPI.getTagBySlug(slug);
export const getPostsByTagSlug = (slug: string) => blogAPI.getPostsByTagSlug(slug);

// OPTIMIZED: Utility exports
export const clearAPICache = () => blogAPI.clearCache();
export const batchAPIRequest = <T>(requests: Array<() => Promise<T>>) => blogAPI.batchRequest(requests);

// Export default
export default blogAPI;