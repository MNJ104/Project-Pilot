import { extractPageContent } from '../utils/domExtractor';
import { ExtensionMessage } from '../types/extension';

console.log('[Project Pilot] Content script injected and active.');

chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  if (message.type === 'ANALYZE_PAGE') {
    try {
      const payload = extractPageContent(false);
      sendResponse({ success: true, data: payload });
    } catch (error: any) {
      sendResponse({ success: false, error: error.message || 'Failed to extract page content.' });
    }
    return true;
  }

  if (message.type === 'CAPTURE_SELECTION') {
    try {
      const payload = extractPageContent(true);
      if (!payload.selectedText) {
        sendResponse({ success: false, error: 'No text is currently selected on this page.' });
      } else {
        sendResponse({ success: true, data: payload });
      }
    } catch (error: any) {
      sendResponse({ success: false, error: error.message || 'Failed to capture text selection.' });
    }
    return true;
  }
});
