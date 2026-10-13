import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return undefined;
    const previous = document.title;
    document.title = title.includes('Educator Connect') ? title : `${title} — Educator Connect`;
    return () => { document.title = previous; };
  }, [title]);
}
