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
    <div className="section-tabs-vertical">
      <div className="section-tabs-header">
        <h6 className="tabs-title">Test Sections</h6>
        <div className="tabs-subtitle">{sections.length} sections available</div>
      </div>

      <div className="section-tabs-list">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`section-tab-item ${currentSectionIndex === index ? 'active' : ''}`}
            onClick={() => onSectionChange(index)}
          >
            <div className="tab-number">{index + 1}</div>
            <div className="tab-content">
              <div className="tab-title">{section.title}</div>
              <div className="tab-meta">
                <span className="tab-questions">{section.questions?.length || 0} questions</span>
              </div>
            </div>
            <div className="tab-indicator">
              {currentSectionIndex === index && <span className="active-indicator">◉</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectionTabs;
