interface ReadmePreviewProps {
  content: string;
}

export const ReadmePreview = ({ content }: ReadmePreviewProps) => {
  if (!content) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-lg font-medium mb-2">No README Generated Yet</h3>
        <p>Fill out the form and click "Generate README" to see your professional documentation.</p>
      </div>
    );
  }

  // Simple markdown-like rendering for preview
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="text-3xl font-bold mt-6 mb-4 text-foreground">
              {line.replace('# ', '')}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-semibold mt-5 mb-3 text-foreground">
              {line.replace('## ', '')}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-medium mt-4 mb-2 text-foreground">
              {line.replace('### ', '')}
            </h3>
          );
        }

        // Code blocks
        if (line.startsWith('```')) {
          return <div key={index} className="my-2" />; // Handle code blocks separately
        }

        // Lists
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 text-foreground">
              {line.replace('- ', '')}
            </li>
          );
        }

        // Badges/Links (simplified)
        if (line.includes('[![')) {
          return (
            <div key={index} className="flex gap-2 my-2">
              <span className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                Badge
              </span>
            </div>
          );
        }

        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }

        // Regular paragraphs
        return (
          <p key={index} className="mb-2 text-foreground leading-relaxed">
            {line}
          </p>
        );
      });
  };

  return (
    <div className="bg-card border border-code-border rounded-lg">
      {/* Preview Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-code-bg border-b border-code-border rounded-t-lg">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <span className="ml-2 text-sm text-muted-foreground font-mono">README.md</span>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          {renderMarkdown(content)}
        </div>
      </div>

      {/* Raw View Toggle */}
      <details className="border-t border-code-border">
        <summary className="px-4 py-2 bg-code-bg text-sm text-muted-foreground cursor-pointer hover:bg-muted">
          View Raw Markdown
        </summary>
        <pre className="p-4 bg-code-bg text-sm text-foreground font-mono whitespace-pre-wrap overflow-x-auto">
          {content}
        </pre>
      </details>
    </div>
  );
};