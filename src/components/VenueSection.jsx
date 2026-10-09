import { LocationIcon, MapPinIcon } from "./Motifs";

function buildShareText(familyName, ceremony, venue) {
  /* schedule[0] is the ceremony itself, already stated on the first line */
  const programme = ceremony.schedule
    .slice(1)
    .map((item) => `${item.titleTe} — ${item.day}, ${item.time}`)
    .join("\n");

  return [
    `🪔 *${familyName} — ${ceremony.nameTe} ${ceremony.sanskrit}*`,
    "",
    `${ceremony.nameTe}: ${ceremony.date}, ${ceremony.time}`,
    `${ceremony.name}: ${ceremony.date}, ${ceremony.time}`,
    programme,
    "",
    `${venue.address.join(", ")}.`,
    "",
    venue.mapUrl,
  ].join("\n");
}

export default function VenueSection({ venue, ceremony, familyName }) {
  const shareHref = `https://wa.me/?text=${encodeURIComponent(
    buildShareText(familyName, ceremony, venue),
  )}`;

  return (
    <section
      id="venue"
      className="section-shell py-16 sm:py-20 lg:py-28"
      aria-label="Venue"
    >
      <article className="paper-card venue-card reveal">
        <span className="venue-eyebrow">{venue.eyebrow}</span>
        {venue.eyebrowTe ? (
          <p className="te te-sm mt-1">{venue.eyebrowTe}</p>
        ) : null}

        <h2 className="venue-name">{venue.name}</h2>
        {venue.nameTe ? (
          <p className="te te-heading mt-1">{venue.nameTe}</p>
        ) : null}

        <p className="venue-address">
          <LocationIcon />
          <span>
            {venue.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        </p>

        {venue.addressTe ? (
          <p className="venue-address-te te te-sm">
            {venue.addressTe.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        ) : null}

        {venue.landmark ? (
          <p className="venue-landmark">{venue.landmark}</p>
        ) : null}

        <iframe
          className="venue-map"
          title={`${venue.name} on Google Maps`}
          src={venue.mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />

        <div className="venue-actions">
          <a
            className="btn-primary"
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPinIcon />
            Get Directions
          </a>
          <a
            className="btn-ghost"
            href={shareHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share Invitation
          </a>
        </div>
      </article>
    </section>
  );
}