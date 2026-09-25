import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';

type GalleryImage = NonNullable<ProductVariantFragment['image']>;

export function ProductGallery({
  images,
  selectedVariantImage,
}: {
  images: GalleryImage[];
  selectedVariantImage?: ProductVariantFragment['image'];
}) {
  // Show the selected variant's image first, then the rest of the product's photos.
  const orderedImages = selectedVariantImage
    ? [
        selectedVariantImage,
        ...images.filter((image) => image.id !== selectedVariantImage.id),
      ]
    : images;

  const [index, setIndex] = useState(0);
  const activeIndex = Math.min(index, Math.max(orderedImages.length - 1, 0));
  const activeImage = orderedImages[activeIndex];

  if (!activeImage) {
    return <div className="product-image" />;
  }

  const showArrows = orderedImages.length > 1;

  function goPrev() {
    setIndex((current) => (current - 1 + orderedImages.length) % orderedImages.length);
  }

  function goNext() {
    setIndex((current) => (current + 1) % orderedImages.length);
  }

  return (
    <div className="product-image">
      <div className="product-gallery">
        {showArrows && (
          <button
            type="button"
            className="product-gallery-arrow product-gallery-arrow-prev"
            onClick={goPrev}
            aria-label="Previous photo"
          >
            &#8249;
          </button>
        )}
        <Image
          alt={activeImage.altText || 'Product Image'}
          aspectRatio="1/1"
          data={activeImage}
          key={activeImage.id}
          sizes="(min-width: 45em) 50vw, 100vw"
        />
        {showArrows && (
          <button
            type="button"
            className="product-gallery-arrow product-gallery-arrow-next"
            onClick={goNext}
            aria-label="Next photo"
          >
            &#8250;
          </button>
        )}
      </div>
      {showArrows && (
        <div className="product-gallery-dots">
          {orderedImages.map((image, i) => (
            <button
              type="button"
              key={image.id}
              className={
                i === activeIndex
                  ? 'product-gallery-dot product-gallery-dot-active'
                  : 'product-gallery-dot'
              }
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
