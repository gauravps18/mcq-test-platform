export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  codeSnippet?: string; // Optional code snippet for programming questions
  options: Option[];
  correctOptionId: string;
  type: QuestionType; // Required question type for categorization
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface Test {
  id: string;
  title: string;
  sections: Section[];
  passingPercentage: number;
  correctMarks: number;
  incorrectMarks: number;
}

export enum QuestionType {
  // English/Vocabulary (from test1 section A)
  VOCABULARY_SYNONYM = 'vocabulary_synonym',
  VOCABULARY_ANTONYM = 'vocabulary_antonym',
  IDIOM = 'idiom',
  FILL_IN_THE_BLANKS = 'fill_in_the_blanks',

  // Quantitative Aptitude/Mathematics (from test1 section A)
  MATHEMATICAL = 'mathematical',
  WORD_PROBLEM = 'word_problem',
  PROBABILITY = 'probability',
  GEOMETRY_MENSURATION = 'geometry_mensuration',
  SERIES_COMPLETION = 'series_completion',

  // Reasoning (from test1 section A)
  NUMBER_SERIES = 'number_series',
  ALPHABETIC_SERIES = 'alphabetic_series',
  ODD_ONE_OUT = 'odd_one_out',
  ANALOGY = 'analogy',
  CODING_DECODING = 'coding_decoding',
  BLOOD_RELATIONS = 'blood_relations',
  SEATING_ARRANGEMENT = 'seating_arrangement',

  // Computer Science/Technical (from test section B files)
  BASIC_CONCEPTS = 'basic_concepts',
  OPERATING_SYSTEMS = 'operating_systems',
  MEMORY = 'memory',
  NUMBER_SYSTEMS = 'number_systems',
  NETWORKING = 'networking',
  HARDWARE = 'hardware',
  NETWORKING_SECURITY = 'networking_security',
  COMPUTER_GENERATIONS = 'computer_generations',
  SOFTWARE_TYPES = 'software_types',
  CODE_OUTPUT = 'code_output',
  SYNTAX_RULES = 'syntax_rules',
  POINTERS = 'pointers',
  MEMORY_MANAGEMENT = 'memory_management',
  OPERATORS = 'operators',
  CONTROL_FLOW = 'control_flow',
  DATA_TYPES = 'data_types',
  STORAGE_CLASSES = 'storage_classes',
  FUNCTIONS = 'functions',

  // Keep for backward compatibility and future use
  GRAMMAR = 'grammar',
  COMPREHENSION = 'comprehension',
  ARITHMETIC = 'arithmetic',
  ALGEBRA = 'algebra',
  GEOMETRY = 'geometry',
  DATA_INTERPRETATION = 'data_interpretation',
  LOGICAL_REASONING = 'logical_reasoning',
  DEBUGGING = 'debugging',
  ALGORITHM = 'algorithm',
  DATA_STRUCTURES = 'data_structures',
  GENERAL_KNOWLEDGE = 'general_knowledge',
  CURRENT_AFFAIRS = 'current_affairs',
  SCIENCE = 'science',
  HISTORY = 'history',
  GEOGRAPHY = 'geography',
  OTHER = 'other',
}

// Extended Test interface with additional metadata
export interface TestWithMetadata extends Test {
  description?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number;
  isActive?: boolean;
}
