export const DEFAULT_TRANSFORM_WIDTH = 1200;

export function getImagePreviewClassName(
  className?: string,
  wrapperClassName?: string,
  fallback?: string
) {
  return className || wrapperClassName || fallback || "";
}
