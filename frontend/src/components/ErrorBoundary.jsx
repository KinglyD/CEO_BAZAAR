import { Component } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-12 border border-white/10 max-w-md w-full text-center">
            <div className="p-4 bg-red-500/20 rounded-full w-fit mx-auto mb-6">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-400" />
            </div>
            
            <h1 className="font-clash font-bold text-3xl mb-2">Oops! Something went wrong</h1>
            <p className="text-graytext mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6 p-4 bg-white/5 rounded-md">
                <summary className="cursor-pointer text-sm font-semibold mb-2">Error Details</summary>
                <p className="text-xs text-red-400 font-mono overflow-auto">
                  {this.state.error.toString()}
                </p>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-gold hover:bg-gold/90 text-black font-semibold rounded-md transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
