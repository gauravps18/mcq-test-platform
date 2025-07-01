import React from 'react';
import { Section } from '../types';

interface SectionTabsProps {
  sections: Section[];
  currentSectionIndex: number;
  onSectionChange: (index: number) => void;
}

const SectionTabs: React.FC<SectionTabsProps> = ({
  sections,
  currentSectionIndex,
  onSectionChange,
}) => {
  return (
    <div className="mb-4">
      <ul className="nav nav-tabs">
        {sections.map((section, index) => (
          <li className="nav-item" key={section.id}>
            <button
              className={`nav-link ${currentSectionIndex === index ? 'active' : ''}`}
              onClick={() => onSectionChange(index)}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionTabs;
