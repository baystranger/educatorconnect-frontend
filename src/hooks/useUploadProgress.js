import { useCallback, useEffect, useRef, useState } from 'react';
import { useUnsavedChanges } from '../context/UnsavedChangesContext.jsx';

/**
 * Tracks one upload at a time: progress for <UploadProgress>, a cancel() for its button,
 * and a leave-page warning while bytes are still being sent.
 *
 *   const uploader = useUploadProgress();
 *   await uploader.run('intro.mp4', (options) => uploadProfileMedia('video', file, options));
 */
export function useUploadProgress() {
  const [progress, setProgress] = useState(null); // { label, loaded, total, percent } | null
  const controller = useRef(null);

  const cancel = useCallback(() => controller.current?.abort(), []);
  useEffect(() => cancel, [cancel]);

  const run = useCallback(async (label, task) => {
    controller.current = new AbortController();
    setProgress({ label, loaded: 0, total: 0, percent: 0 });
    try {
      return await task({
        signal: controller.current.signal,
        onProgress: (next) => setProgress({ label, ...next }),
      });
    } finally {
      controller.current = null;
      setProgress(null);
    }
  }, []);

  useUnsavedChanges(Boolean(progress), {
    uploading: true,
    message: 'A file is still uploading. If you leave now the upload will be cancelled.',
    onDiscard: cancel,
  });

  return { progress, run, cancel, busy: Boolean(progress) };
}
