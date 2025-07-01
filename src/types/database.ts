// Import Test type from test.ts
import type { Test } from './test';

export interface TestReference {
  id: string;
  title: string;
  description: string;
  file: string; // Path to the test file relative to data directory
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // Duration in minutes
  isActive: boolean;
}

export interface DatabaseMetadata {
  version: string;
  lastUpdated: string;
  totalTests: number;
  categories: string[];
  difficulties: string[];
}

export interface Database {
  tests: TestReference[];
  metadata: DatabaseMetadata;
}

export interface TestSection {
  id: string;
  title: string;
  description: string;
  file: string;
  estimatedDuration: number;
}

export interface TestGroup {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sections: TestSection[];
  isActive: boolean;
}
