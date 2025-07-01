import axios from 'axios';
import { Test, Database, TestWithMetadata } from '../types';

// Detect environment and set appropriate base URL
const isDevelopment = process.env.NODE_ENV === 'development';
const isStaticDeployment =
  process.env.REACT_APP_ENV === 'production' ||
  (!isDevelopment && !process.env.REACT_APP_API_BASE_URL);

const API_URL =
  process.env.REACT_APP_API_BASE_URL || (isDevelopment ? 'http://localhost:3001' : '');
const BASE_PATH = process.env.REACT_APP_BASENAME || '/';

// Helper function to get the correct static file path
const getStaticPath = (path: string) => {
  const cleanBasePath = BASE_PATH === '/' ? '' : BASE_PATH;
  return `${cleanBasePath}${path}`;
};

/**
 * Data loader service for handling modular test database structure
 * Works in both development (with local server) and production (static files) environments
 * Now supports GitHub Pages static API deployment
 */
export class DataLoader {
  private cache: Map<string, Test> = new Map();
  private databaseCache: Database | null = null;

  /**
   * Fetch the main database index
   */
  async fetchDatabase(): Promise<Database> {
    if (this.databaseCache) {
      return this.databaseCache;
    }

    try {
      let url: string;
      if (isDevelopment) {
        url = `${API_URL}/db`;
      } else if (isStaticDeployment) {
        // For GitHub Pages static deployment, use the pre-built API endpoint
        url = getStaticPath('/api/db.json');
      } else {
        // Fallback to original data location
        url = getStaticPath('/data/db.json');
      }

      const response = await axios.get(url);
      this.databaseCache = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching database:', error);
      throw new Error('Failed to load database index');
    }
  }

  /**
   * Fetch a test by its file reference
   */
  async fetchTestByFile(filePath: string): Promise<Test> {
    if (this.cache.has(filePath)) {
      return this.cache.get(filePath)!;
    }

    try {
      let url: string;
      if (isDevelopment) {
        // Remove 'tests/' prefix if present and add it to the API URL
        const cleanPath = filePath.replace(/^tests\//, '');
        url = `${API_URL}/testfiles/${cleanPath}`;
      } else if (isStaticDeployment) {
        // For GitHub Pages, use the static API testfiles structure
        const cleanPath = filePath.replace(/^tests\//, '');
        url = getStaticPath(`/api/testfiles/${cleanPath}`);
      } else {
        // For production, use static file path
        url = getStaticPath(`/data/${filePath}`);
      }

      const response = await axios.get(url);
      const test = response.data;

      this.cache.set(filePath, test);
      return test;
    } catch (error) {
      console.error(`Error fetching test file ${filePath}:`, error);
      throw new Error(`Failed to load test from ${filePath}`);
    }
  }

  /**
   * Fetch all available tests with metadata
   * Uses optimized static endpoints when available (GitHub Pages deployment)
   */
  async fetchAllTests(): Promise<TestWithMetadata[]> {
    // Try optimized static API first (for GitHub Pages)
    if (isStaticDeployment) {
      try {
        const url = getStaticPath('/api/tests.json');
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.warn(
          'Failed to fetch from optimized static API, falling back to individual file loading:',
          error
        );
      }
    }

    // Fallback to individual file loading
    const database = await this.fetchDatabase();
    const tests: TestWithMetadata[] = [];

    for (const testRef of database.tests) {
      if (!testRef.isActive) continue;

      try {
        const test = await this.fetchTestByFile(testRef.file);
        const testWithMetadata: TestWithMetadata = {
          ...test,
          description: testRef.description,
          category: testRef.category,
          difficulty: testRef.difficulty,
          estimatedDuration: testRef.estimatedDuration,
          isActive: testRef.isActive,
        };
        tests.push(testWithMetadata);
      } catch (error) {
        console.warn(`Failed to load test ${testRef.id}:`, error);
      }
    }

    return tests;
  }

  /**
   * Fetch a specific test by ID
   * Uses optimized static endpoints when available (GitHub Pages deployment)
   */
  async fetchTestById(id: string): Promise<TestWithMetadata | null> {
    try {
      // Try optimized static API first (for GitHub Pages)
      if (isStaticDeployment) {
        try {
          const url = getStaticPath(`/api/tests-${id}.json`);
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          console.warn(
            `Failed to fetch test ${id} from optimized static API, falling back to database lookup:`,
            error
          );
        }
      }

      // Fallback to database lookup
      const database = await this.fetchDatabase();
      const testRef = database.tests.find((test) => test.id === id);

      if (!testRef) {
        console.warn(`Test with ID ${id} not found in database`);
        return null;
      }

      if (!testRef.isActive) {
        console.warn(`Test ${id} is not active`);
        return null;
      }

      const test = await this.fetchTestByFile(testRef.file);
      return {
        ...test,
        description: testRef.description,
        category: testRef.category,
        difficulty: testRef.difficulty,
        estimatedDuration: testRef.estimatedDuration,
        isActive: testRef.isActive,
      };
    } catch (error) {
      console.error(`Error fetching test with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache(): void {
    this.cache.clear();
    this.databaseCache = null;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { testsCached: number; databaseCached: boolean } {
    return {
      testsCached: this.cache.size,
      databaseCached: this.databaseCache !== null,
    };
  }
}

// Export a singleton instance
export const dataLoader = new DataLoader();
