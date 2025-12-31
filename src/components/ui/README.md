# UI Component Architecture

## The `/src/components/ui` Directory

This directory is reserved **exclusively** for "primitive" UI components.

### Core Principles

1.  **Headless & Accessible**: These components are typically wrappers around accessible primitives (like Radix UI or simple HTML elements) styled with Tailwind CSS.
2.  **Copy-Pasteable**: Following the *shadcn/ui* philosophy, these components are designed to be copy-pasted into your project and owned by you. They are not an external library dependency.
3.  **Composition First**: Complex UIs should be built by composing these small, focused primitives.
4.  **No Business Logic**: These components should remain pure and ignorant of your application's specific business data or state. They expect props.

### Usage

- **DO** import these components into your feature pages or more complex "smart" components.
- **DO NOT** add business logic (API calls, complex state management related to app data) inside these components.
- **DO NOT** modify these files unless you are checking in a design system update that applies globally.

### folder Structure

- `ui/`: Primitives (Button, Input, Card, etc.)
- `../`: Feature-specific components (e.g., `ChatWindow`, `UserProfile`) should live outside `ui/` or collocated with pages.
