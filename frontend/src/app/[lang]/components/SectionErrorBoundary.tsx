"use client";

import React from "react";

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

export default class SectionErrorBoundary extends React.Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[SectionErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="py-12 text-center">
          <p className="text-red-600">This section failed to load.</p>
        </section>
      );
    }
    return this.props.children;
  }
}