import React, { useEffect, useState } from 'react';

interface GitHubStarButtonProps {
  className?: string;
  showCount?: boolean;
  large?: boolean;
}

const GitHubStarButton: React.FC<GitHubStarButtonProps> = ({ 
  className = '', 
  showCount = true,
  large = false 
}) => {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch GitHub stars count
    fetch('https://api.github.com/repos/gunta/PRiority')
      .then(res => res.json())
      .then(data => {
        setStars(data.stargazers_count || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch GitHub stars:', err);
        setLoading(false);
      });
  }, []);

  const formatStars = (count: number): string => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  return (
    <a
      href="https://github.com/gunta/PRiority"
      target="_blank"
      rel="noopener noreferrer"
      className={`github-star-button inline-flex items-center gap-2 ${
        large ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
      } bg-gray-900/80 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl transition-all duration-200 group font-semibold ${className}`}
    >
      <svg 
        className={`${large ? 'w-5 h-5' : 'w-4 h-4'} group-hover:text-yellow-400 transition-colors`}
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
      <span className="font-medium">Star</span>
      {showCount && (
        <>
          <div className="w-px h-4 bg-gray-700 group-hover:bg-gray-600"></div>
          <span className={`font-semibold ${loading ? 'animate-pulse' : ''}`}>
            {loading ? '...' : stars !== null ? formatStars(stars) : '0'}
          </span>
        </>
      )}
    </a>
  );
};

export default GitHubStarButton;