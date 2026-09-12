import * as React from "react";
import { useSize } from "./use-size";
import { cn } from "../lib/utils";
import { DEFAULT_TRANSFORM_WIDTH, getImagePreviewClassName } from "../components/ui/image-helpers";

export type ResponsiveImageProps = {
  parsed: { baseUrl?: string };
  fittingType?: "fit" | "crop" | string;
  focalPoint?: string;
  quality?: number;
  className?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onSourceChange?: (src: string, className: string) => void;
};

export function useResponsiveImage(
  {
    parsed,
    fittingType,
    focalPoint,
    quality,
    className,
    onLoad,
    onSourceChange,
  }: ResponsiveImageProps,
  parentRef?: React.Ref<HTMLImageElement | null>
) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const size = useSize(wrapperRef);
  const [loaded, setLoaded] = React.useState(false);

  React.useImperativeHandle(parentRef, () => imgRef.current as HTMLImageElement);

  React.useEffect(() => {
    setLoaded(false);
  }, [parsed?.baseUrl]);

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const replace = (event: Event) => {
      const customEvent = event as CustomEvent<{ src: string }>;
      onSourceChange?.(
        customEvent.detail.src,
        getImagePreviewClassName(className, wrapper.className, cn("inline-block relative", className))
      );
    };
    wrapper.addEventListener("base44:image-replace", replace);
    return () => wrapper.removeEventListener("base44:image-replace", replace);
  }, [className, onSourceChange]);

  const crop = fittingType !== "fit";
  // Wait for useSize's pre-paint measurement before requesting a transform.
  const options = size && {
    width: size.width || DEFAULT_TRANSFORM_WIDTH,
    height: size.height || undefined,
    crop,
    focalPoint: crop ? focalPoint : undefined,
    quality,
  };

  return {
    wrapperRef,
    imgRef,
    loaded,
    options,
    handleLoad: (event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      onLoad?.(event);
    },
  };
}
