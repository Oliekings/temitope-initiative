import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = this.state.error?.message || 'An unexpected error occurred.';
      
      try {
        // Try to parse if it's our custom Firestore error JSON
        const parsedError = JSON.parse(errorMessage);
        if (parsedError.error) {
          errorMessage = `Database Error: ${parsedError.error}`;
        }
      } catch (e) {
        // Not JSON, use as is
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-soft-smoke p-4">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full border-t-4 border-vibrant-red">
            <h2 className="text-2xl font-serif text-royal-blue mb-4">Oops! Something went wrong.</h2>
            <p className="text-gray-600 mb-4">We encountered an error while loading this page.</p>
            <div className="bg-gray-100 p-4 rounded text-sm text-red-600 font-mono break-words">
              {errorMessage}
            </div>
            <button
              className="mt-6 px-6 py-2 bg-royal-blue text-white rounded-full hover:bg-blue-800 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
