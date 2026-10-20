/** Upload limits. Keep in step with config/platform.php `uploads` on the API. */
export const VIDEO_MAX_MB = 25;
export const VIDEO_MAX_BYTES = VIDEO_MAX_MB * 1024 * 1024;

/** The error to show for a video that is too large, or null when it fits. */
export function videoSizeError(file) {
  if (!file || file.size <= VIDEO_MAX_BYTES) return null;
  return `This video is ${(file.size / 1024 / 1024).toFixed(1)} MB. Videos must be ${VIDEO_MAX_MB} MB or smaller — trim it or record a shorter one.`;
}
