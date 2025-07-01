import { Test, TestGroup } from '../types';
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
    // Fetch the database to get test references
    const database = await dataLoader.fetchDatabase();
    
    // Group tests by their test number (test1, test2, etc.)
    const testGroups: TestGroup[] = [];
    const groupMap = new Map<string, TestGroup>();

    // Process each test reference from the database
    database.tests.forEach((testRef) => {
      // Extract test group identifier (e.g., "test1" from "test1-c-cat-section-A")
      const groupId = testRef.id.split('-')[0]; // Gets "test1", "test2", etc.
      
      // Create test group if it doesn't exist
      if (!groupMap.has(groupId)) {
        const testNumber = groupId.replace('test', '');
        const groupTitle = `Test ${testNumber}`;
        const groupDescription = `Comprehensive test ${testNumber} with multiple sections`;
        
        groupMap.set(groupId, {
          id: groupId,
          title: groupTitle,
          description: groupDescription,
          category: testRef.category,
          difficulty: testRef.difficulty,
          sections: [],
          isActive: testRef.isActive,
        });
      }

      // Add section to the test group
      const testGroup = groupMap.get(groupId)!;
      const sectionTitle = testRef.id.includes('section-A') ? 'Section A' : 'Section B';
      
      testGroup.sections.push({
        id: testRef.id,
        title: sectionTitle,
        description: testRef.description,
        file: testRef.file,
        estimatedDuration: testRef.estimatedDuration,
      });
    });

    // Convert map values to array and sort by test number
    testGroups.push(...Array.from(groupMap.values()));
    testGroups.sort((a, b) => {
      const aNum = parseInt(a.id.replace('test', ''));
      const bNum = parseInt(b.id.replace('test', ''));
      return aNum - bNum;
    });

    return testGroups;
  } catch (error) {
    console.error('Error fetching test groups:', error);
    return [];
  }
};
