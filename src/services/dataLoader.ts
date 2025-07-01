import axios from 'axios';
import { Test, Database, TestWithMetadata } from '../types';

// Detect environment and set appropriate base URL
const isDevelopment = process.env.NODE_ENV === 'development';
const API_URL = isDevelopment ? 'http://localhost:3001' : '';

/**
 * Data loader service for handling modular test database structure
 * Works in both development (with local server) and production (static files) environments
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
      const url = isDevelopment ? `${API_URL}/db` : '/data/db.json';
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
      } else {
        // For production, use static file path
        url = `/data/${filePath}`;
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
   */
  async fetchAllTests(): Promise<TestWithMetadata[]> {
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
   */
  async fetchTestById(id: string): Promise<TestWithMetadata | null> {
    try {
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
   * Get tests by category
   */
  async fetchTestsByCategory(category: string): Promise<TestWithMetadata[]> {
    const allTests = await this.fetchAllTests();
    return allTests.filter((test) => test.category === category);
  }

  /**
   * Get tests by difficulty
   */
  async fetchTestsByDifficulty(
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<TestWithMetadata[]> {
    const allTests = await this.fetchAllTests();
    return allTests.filter((test) => test.difficulty === difficulty);
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
