import { getOptimizedImageUrl } from "../imageUtils";

function ListingsSection({
  title,
  listings,
  label,
  viewAllText,
  onViewAll,
  perNightLabel,
  onSelectListing,
  favoriteListingIds = [],
  onToggleFavorite
}) {
  const formatPrice = (rawPrice) => {
    const [amount] = rawPrice.split("/");
    return perNightLabel ? `${amount}/${perNightLabel}` : amount;
  };

  return (
    <section id="listings" className="listings">
      {label && <span className="sectionLabel">{label}</span>}

      {(viewAllText && onViewAll) ? (
        <div className="sectionHeader">
          <div>
            <h2 className="sectionTitle light">{title}</h2>
          </div>
          <a
            href="#"
            className="viewAllLink green"
            onClick={(event) => {
              event.preventDefault();
              onViewAll();
            }}
          >
            {viewAllText}
          </a>
        </div>
      ) : (
        <h2 className="sectionTitle light">{title}</h2>
      )}

      <div className="listingsGrid">
        {listings.map((listing, index) => (
          <article
            key={listing.id}
            className="listingCard"
            role="button"
            tabIndex={0}
            onClick={() => onSelectListing?.(listing.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectListing?.(listing.id);
              }
            }}
          >
            <div className="listingImage">
              <img
                src={getOptimizedImageUrl(listing.image, { width: 620, height: 410, quality: 66 })}
                srcSet={[
                  `${getOptimizedImageUrl(listing.image, { width: 360, height: 240, quality: 62 })} 360w`,
                  `${getOptimizedImageUrl(listing.image, { width: 620, height: 410, quality: 66 })} 620w`
                ].join(", ")}
                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={listing.title}
                loading={index < 4 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index < 2 ? "high" : "auto"}
              />
              <button
                className={`favoriteBtn ${favoriteListingIds.includes(listing.id) ? "active" : ""}`}
                type="button"
                aria-label="Guardar alojamiento"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleFavorite?.(listing.id);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="white" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            <div className="listingContent">
              <h4>{listing.title}</h4>
              <p className="listingLocation">{listing.location}</p>
              <div className="listingFooter">
                <span className="listingPrice">{formatPrice(listing.price)}</span>
                <span className="listingRating">★ {listing.rating}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ListingsSection;
