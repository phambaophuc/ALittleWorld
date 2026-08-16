import * as React from "react";
import { useSize } from "@/hooks/use-size";
import { cn } from "@/lib/utils";
import {
  buildSrcSet,
  buildTransformUrl,
  DEFAULT_TRANSFORM_WIDTH,
  getOriginalImageUrl,
  IMAGE_LOAD_MODE,
  nextImageLoadMode,
  parseWixMediaUrl,
  type ParsedWixMediaUrl,
  type FocalPoint,
} from "./image-helpers";

const FALLBACK_IMAGE_URL =
  "https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png";

interface ImageWrapperProps {
  aspectRatio?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ImageWrapper = React.forwardRef<HTMLSpanElement, ImageWrapperProps>(
  ({ aspectRatio, className, style, children }, ref) => (
    <span
      ref={ref}
      className={cn("inline-block relative", className)}
      style={{ aspectRatio, ...style }}
    >
      {children}
    </span>
  )
);

ImageWrapper.displayName = "ImageWrapper";

interface ResponsiveImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  parsed: ParsedWixMediaUrl;
  fittingType: "fill" | "fit";
  focalPoint?: FocalPoint;
  quality: number;
  aspectRatio?: string;
}

const ResponsiveImage = React.forwardRef<
  HTMLImageElement,
  ResponsiveImageProps
>(
  (
    {
      parsed,
      fittingType,
      focalPoint,
      quality,
      className,
      style,
      aspectRatio,
      onLoad,
      ...props
    },
    parentRef
  ) => {
    const wrapperRef = React.useRef<HTMLSpanElement>(null);
    const imgRef = React.useRef<HTMLImageElement>(null);
    const size = useSize(wrapperRef);
    const [loaded, setLoaded] = React.useState(false);

    React.useImperativeHandle(parentRef, () => imgRef.current as HTMLImageElement);

    React.useEffect(() => {
      setLoaded(false);
    }, [parsed.baseUrl]);

    const crop = fittingType !== "fit";

    const options = size
      ? {
          width: size.width || DEFAULT_TRANSFORM_WIDTH,
          height: size.height ? size.height : undefined,
          crop,
          focalPoint: crop ? focalPoint : undefined,
          quality,
        }
      : null;

    return (
      <ImageWrapper
        ref={wrapperRef}
        aspectRatio={aspectRatio}
        className={className}
        style={style}
      >
        {options && !loaded && (
          <img
            src={buildTransformUrl(parsed, {
              ...options,
              width: 20,
              height: options.height
                ? Math.max(
                    1,
                    Math.round((20 * options.height) / options.width)
                  )
                : undefined,
              quality: 20,
            })}
            alt=""
            aria-hidden="true"
            className="w-full h-full inset-0 absolute"
            style={{
              objectFit:
                fittingType === "fit" ? "contain" : "cover",
              filter: "blur(10px)",
              transform: "scale(1.1)",
            }}
          />
        )}

        {options && (
          <img
            ref={imgRef}
            src={buildTransformUrl(parsed, options)}
            srcSet={buildSrcSet(parsed, options)}
            loading="lazy"
            className={cn(
              "w-full h-full inset-0 absolute",
              fittingType === "fit"
                ? "object-contain"
                : "object-cover"
            )}
            onLoad={(e) => {
              setLoaded(true);
              onLoad?.(e);
            }}
            {...props}
          />
        )}
      </ImageWrapper>
    );
  }
);

ResponsiveImage.displayName = "ResponsiveImage";

interface ImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fittingType?: "fill" | "fit";
  originWidth?: number;
  originHeight?: number;
  focalPointX?: number;
  focalPointY?: number;
  quality?: number;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      fittingType = "fill",
      originWidth,
      originHeight,
      focalPointX,
      focalPointY,
      quality = 90,
      onError,
      ...props
    },
    ref
  ) => {
    const parsedSource =
      src && src !== FALLBACK_IMAGE_URL
        ? parseWixMediaUrl(src)
        : null;

    const initialMode = parsedSource
      ? IMAGE_LOAD_MODE.OPTIMIZED
      : IMAGE_LOAD_MODE.ORIGINAL;

    const [loadState, setLoadState] = React.useState<{
      src?: string;
      mode: typeof IMAGE_LOAD_MODE[keyof typeof IMAGE_LOAD_MODE];
    }>({
      src,
      mode: initialMode,
    });

    const mode =
      loadState.src === src ? loadState.mode : initialMode;

    React.useEffect(() => {
      setLoadState({
        src,
        mode: initialMode,
      });
    }, [src, initialMode]);

    const handleError = (
      event: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
      if (mode === IMAGE_LOAD_MODE.FALLBACK) {
        return;
      }

      const nextMode = nextImageLoadMode(mode);

      setLoadState({
        src,
        mode: nextMode,
      });

      if (nextMode === IMAGE_LOAD_MODE.FALLBACK) {
        onError?.(event);
      }
    };

    const imageProps: React.ImgHTMLAttributes<HTMLImageElement> = {
      ...props,
      onError: handleError,
    };

    if (!src) {
      return (
        <img
          ref={ref}
          src={FALLBACK_IMAGE_URL}
          {...imageProps}
          data-empty-image
        />
      );
    }

    const parsed =
      mode === IMAGE_LOAD_MODE.OPTIMIZED
        ? parsedSource
        : null;

    if (!parsed) {
      const isErrorMode =
        mode === IMAGE_LOAD_MODE.FALLBACK;

      const imageSrc = isErrorMode
        ? FALLBACK_IMAGE_URL
        : getOriginalImageUrl(src, parsedSource);

      return (
        <img
          ref={ref}
          src={imageSrc}
          {...imageProps}
          data-error-image={
            isErrorMode || undefined
          }
        />
      );
    }

    const focalPoint =
      typeof focalPointX === "number" &&
      typeof focalPointY === "number"
        ? {
            x: focalPointX,
            y: focalPointY,
          }
        : undefined;

    const aspectRatio =
      originWidth && originHeight
        ? `${originWidth} / ${originHeight}`
        : undefined;

    return (
      <ResponsiveImage
        ref={ref}
        parsed={parsed}
        fittingType={fittingType}
        focalPoint={focalPoint}
        quality={quality}
        aspectRatio={aspectRatio}
        {...imageProps}
      />
    );
  }
);

Image.displayName = "Image";

export { Image };