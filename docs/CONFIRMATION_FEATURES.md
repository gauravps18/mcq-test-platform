# Confirmation Features Documentation

This document describes the confirmation dialogs implemented in the MCQ Test Platform to prevent accidental data loss and improve user experience.

## Features

### 1. Page Refresh Protection

**Trigger**: When a user tries to refresh the page (Ctrl+R/Cmd+R) or navigate away while a test is active.

**Behavior**:

- Shows a browser-native confirmation dialog
- Message: "Are you sure you want to leave? Your test progress will be lost."
- Only active during test sessions (when `isTestActive` is true)
- Automatically disabled when test is submitted or timer expires

**Implementation**:

- Uses the `beforeunload` event listener
- Attached when test starts, removed when test ends
- Compatible with all modern browsers

### 2. Test Submission Confirmation

**Trigger**: When a user clicks any "Submit Test" button.

**Behavior**:

- Shows a custom modal dialog (not browser-native)
- Title: "Submit Test"
- Message: "Are you sure you want to submit the test? You will not be able to change your answers after submission."
- Two options:
  - "Submit Test" (warning button) - proceeds with submission
  - "Continue Test" (secondary button) - cancels and returns to test

**Implementation**:

- Custom React component `ConfirmationModal`
- Bootstrap-styled modal
- Configurable text and styling
- Prevents accidental submissions

## Technical Details

### Components

1. **ConfirmationModal** (`src/components/ConfirmationModal.tsx`)

   - Reusable modal component
   - Supports different variants (warning, danger, info)
   - Bootstrap 5 styling
   - Customizable text and button labels

2. **TestPage Updates** (`src/pages/TestPage.tsx`)
   - Added `isTestActive` state management
   - Added `beforeunload` event handling
   - Added modal state management
   - Updated submit handlers

### State Management

- `isTestActive`: Boolean flag indicating if test is currently active
- `showSubmitConfirmation`: Boolean flag for modal visibility
- Proper cleanup of event listeners on component unmount

### Browser Compatibility

- Page refresh protection works on all modern browsers
- Custom modal works universally (not dependent on browser dialogs)
- Graceful degradation for older browsers

## Usage

The confirmation features are automatically active when:

1. A test is loaded and timer is running
2. User attempts to submit test

No additional configuration required - features are built into the test flow.

## Future Enhancements

Potential improvements:

- Add confirmation for section switching when answers are unsaved
- Add auto-save functionality to reduce data loss risk
- Add more sophisticated progress protection
- Add confirmation for question navigation in certain conditions
