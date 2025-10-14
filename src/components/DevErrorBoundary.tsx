"use client";
import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
  errorInfo: any;
}

export class DevErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("DevErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  🚨 Geliştirici Hatası - Beyaz Ekran Çözümü
                </h3>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <p><strong>Beyaz ekran yerine bu hata görünüyor - bu iyi bir şey!</strong></p>
              <p>Aşağıdaki hata detaylarını inceleyerek sorunu çözebiliriz.</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Hata Mesajı:</h4>
                <pre className="p-3 bg-red-100 rounded text-sm font-mono text-red-800 overflow-auto whitespace-pre-wrap">
                  {String(this.state.error?.message || this.state.error)}
                </pre>
              </div>

              {this.state.error?.stack && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Stack Trace:</h4>
                  <pre className="p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto whitespace-pre-wrap max-h-40">
                    {this.state.error.stack}
                  </pre>
                </div>
              )}

              {this.state.errorInfo?.componentStack && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Component Stack:</h4>
                  <pre className="p-3 bg-blue-100 rounded text-xs font-mono text-blue-800 overflow-auto whitespace-pre-wrap max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                🔄 Sayfayı Yenile
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                🔄 Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DevErrorBoundary;



