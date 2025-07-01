import { Test, TestWithMetadata, TestGroup } from '../types';
import { dataLoader } from './dataLoader';

/**
 * API service for fetching tests
 * Now uses the modular data loader for improved performance and modularity
 */

export const fetchTests = async (): Promise<Test[]> => {
  try {
    const tests = await dataLoader.fetchAllTests();
    // Return tests without metadata for backward compatibility
    return tests.map((test) => ({
      id: test.id,
      title: test.title,
      sections: test.sections,
      passingPercentage: test.passingPercentage,
      correctMarks: test.correctMarks,
      incorrectMarks: test.incorrectMarks,
    }));
  } catch (error) {
    console.error('Error fetching tests:', error);
    return [];
  }
};

export const fetchTestById = async (id: string): Promise<Test | null> => {
  try {
    const test = await dataLoader.fetchTestById(id);
    if (!test) return null;

    // Return test without metadata for backward compatibility
    return {
      id: test.id,
      title: test.title,
      sections: test.sections,
      passingPercentage: test.passingPercentage,
      correctMarks: test.correctMarks,
      incorrectMarks: test.incorrectMarks,
    };
  } catch (error) {
    console.error(`Error fetching test with ID ${id}:`, error);
    return null;
  }
};

// New API function to fetch test groups with hierarchical structure
export const fetchTestGroups = async (): Promise<TestGroup[]> => {
  try {
    // For now, we'll group tests by their folder structure
    // This assumes tests are organized as test1/, test2/, etc.
    const testGroups: TestGroup[] = [];

    // Create test groups based on the folder structure
    for (let i = 1; i <= 5; i++) {
      const testGroup: TestGroup = {
        id: `test${i}`,
        title: `Test ${i}`,
        description: `Comprehensive test ${i} with multiple sections`,
        category: 'entrance-exam',
        difficulty: 'intermediate',
        sections: [
          {
            id: `test${i}-c-cat-section-A`,
            title: 'Section A',
            description: 'English, Logical Reasoning, and Quantitative Aptitude',
            file: `tests/test${i}/c-cat-section-A.json`,
            estimatedDuration: 60,
          },
          {
            id: `test${i}-c-cat-section-B`,
            title: 'Section B',
            description: 'Computer Fundamentals, Programming, and Data Structures',
            file: `tests/test${i}/c-cat-section-B.json`,
            estimatedDuration: 60,
          },
        ],
        isActive: true,
      };
      testGroups.push(testGroup);
    }

    return testGroups;
  } catch (error) {
    console.error('Error fetching test groups:', error);
    return [];
  }
};
