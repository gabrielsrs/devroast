# Specs Guide

This directory contains feature specifications that guide implementation.

## Spec File Naming

Use descriptive names: `<feature>-spec.md` or `<feature>-implementation.md`

## Spec Structure

Every spec should follow this pattern:

### 1. Overview
Brief description of what the feature is and why it's needed.

### 2. Research/Analysis
- Technology alternatives researched
- Pros/cons comparison
- Recommendations based on existing tech stack

### 3. Implementation Requirements
- Feature list (checkboxes for tracking)
- Technical requirements
- Component structure

### 4. Technical Implementation Details
- File structure recommendations
- Code samples
- API endpoints (if applicable)
- Database schema (if applicable)

### 5. TODO Section
Checkboxes to track implementation progress:
```markdown
### TODO

- [ ] Task 1
- [x] Completed task
```

## Creating a New Spec

1. Create a new `.md` file in `specs/`
2. Follow the structure above
3. Add research findings before implementation
4. Update checkboxes as work progresses
5. Document decisions and their rationale

## Spec Status

Mark specs as:
- **Draft**: Initial research phase
- **In Progress**: Actively being implemented
- **Complete**: Fully implemented
