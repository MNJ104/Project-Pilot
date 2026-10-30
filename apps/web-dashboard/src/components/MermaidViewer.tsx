import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0f172a',
    primaryColor: '#0284c7',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#38bdf8',
    lineColor: '#64748b',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
  },
  securityLevel: 'loose',
});

interface MermaidViewerProps {
  chart: string;
  className?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!chart || !chart.trim()) {
        setSvgContent('');
        return;
      }

      const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
      try {
        setRenderError(null);
        const { svg } = await mermaid.render(id, chart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setRenderError(err?.message || 'Failed to render Mermaid diagram');
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (renderError) {
    return (
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 text-xs font-mono text-amber-300 overflow-x-auto">
        <div className="text-amber-400 font-bold mb-2">Diagram Syntax Preview:</div>
        <pre>{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-x-auto flex justify-center items-center p-4 bg-slate-950/60 rounded-xl border border-slate-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

