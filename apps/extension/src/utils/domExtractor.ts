import { ExtractionPayload, SourceType, HeadingItem, LinkItem, CodeBlockItem } from '../types/extension';

export function classifyPageType(url: string, documentTitle: string): SourceType {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('github.com')) {
    return 'GITHUB';
  }
  if (lowerUrl.includes('figma.com')) {
    return 'FIGMA';
  }
  if (
    lowerUrl.includes('docs.') ||
    lowerUrl.includes('/docs/') ||
    lowerUrl.includes('readthedocs.io') ||
    lowerUrl.includes('docusaurus') ||
    lowerUrl.includes('gitbook')
  ) {
    return 'DOCUMENTATION';
  }
  if (
    lowerUrl.includes('/blog/') ||
    lowerUrl.includes('medium.com') ||
    lowerUrl.includes('dev.to') ||
    lowerUrl.includes('hashnode.')
  ) {
    return 'BLOG_ARTICLE';
  }
  if (
    lowerUrl.includes('/product/') ||
    lowerUrl.includes('/pricing') ||
    lowerUrl.includes('/features')
  ) {
    return 'PRODUCT_PAGE';
  }
  return 'WEBSITE';
}

export function extractPageContent(selectedTextOnly = false): ExtractionPayload {
  const url = window.location.href;
  const pageTitle = document.title || 'Untitled Webpage';

  // 1. Extract Meta Description
  const metaDescElement = document.querySelector('meta[name="description"]') ||
                          document.querySelector('meta[property="og:description"]');
  const metaDescription = metaDescElement ? metaDescElement.getAttribute('content') || '' : '';

  // 2. Extract Selected Text if available
  const selection = window.getSelection()?.toString().trim() || '';

  if (selectedTextOnly && selection) {
    return {
      url,
      pageTitle,
      metaDescription,
      headings: [],
      mainReadableText: selection,
      relevantLinks: [],
      codeBlocks: [],
      selectedText: selection,
      sourceType: classifyPageType(url, pageTitle),
      timestamp: new Date().toISOString(),
      metadata: { capturedSelectionOnly: true }
    };
  }

  // 3. Clone document body for noise stripping
  const documentClone = document.cloneNode(true) as Document;

  // Remove noise elements: nav, footer, sidebar, ads, scripts, styles, cookie banners
  const selectorsToRemove = [
    'nav', 'footer', 'aside', 'iframe', 'script', 'style', 'noscript',
    '.nav', '.navbar', '.footer', '.sidebar', '.ad', '.ads', '.advertisement',
    '.cookie-banner', '#cookie-notice', '.cookie-consent', '.consent-banner',
    '[role="banner"]', '[role="navigation"]', '[aria-label="cookie consent"]'
  ];

  selectorsToRemove.forEach(selector => {
    documentClone.querySelectorAll(selector).forEach(el => el.remove());
  });

  // 4. Extract Headings (h1..h6)
  const headings: HeadingItem[] = [];
  documentClone.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
    const text = h.textContent?.trim();
    if (text && text.length > 2) {
      const level = parseInt(h.tagName.substring(1), 10);
      headings.push({ level, text });
    }
  });

  // 5. Extract Code Blocks
  const codeBlocks: CodeBlockItem[] = [];
  documentClone.querySelectorAll('pre, code').forEach(codeEl => {
    const codeText = codeEl.textContent?.trim();
    if (codeText && codeText.length > 10) {
      const langClass = Array.from(codeEl.classList).find(c => c.startsWith('language-') || c.startsWith('lang-'));
      const language = langClass ? langClass.replace(/^(language-|lang-)/, '') : undefined;
      codeBlocks.push({ language, code: codeText.substring(0, 3000) });
    }
  });

  // 6. Extract Relevant Links (limit to top 15 clean links)
  const relevantLinks: LinkItem[] = [];
  const linkElements = documentClone.querySelectorAll('a[href]');
  linkElements.forEach(a => {
    const text = a.textContent?.trim();
    const href = (a as HTMLAnchorElement).href;
    if (text && text.length > 3 && href && href.startsWith('http') && relevantLinks.length < 15) {
      if (!relevantLinks.some(l => l.href === href)) {
        relevantLinks.push({ text, href });
      }
    }
  });

  // 7. Extract Clean Main Readable Text (Capped at 25,000 chars)
  let rawText = documentClone.body?.innerText || documentClone.body?.textContent || '';
  // Clean whitespace
  let cleanText = rawText.replace(/\s+/g, ' ').trim();
  if (cleanText.length > 25000) {
    cleanText = cleanText.substring(0, 25000) + '\n\n[...Content clipped to 25,000 characters for token efficiency]';
  }

  const sourceType = classifyPageType(url, pageTitle);

  return {
    url,
    pageTitle,
    metaDescription,
    headings: headings.slice(0, 20),
    mainReadableText: cleanText,
    relevantLinks,
    codeBlocks: codeBlocks.slice(0, 10),
    selectedText: selection || undefined,
    sourceType,
    timestamp: new Date().toISOString(),
    metadata: {
      domain: new URL(url).hostname,
      characterCount: cleanText.length,
      headingCount: headings.length,
      codeBlockCount: codeBlocks.length
    }
  };
}
