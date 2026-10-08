import {
  CalendarIcon,
  ClockIcon,
  Diya,
  HouseIcon,
  LocationIcon,
  Om,
} from "./Motifs";
import SectionHeading from "./SectionHeading";

const ICONS = {
  house: HouseIcon,
  calendar: CalendarIcon,
  clock: ClockIcon,
  location: LocationIcon,
  om: Om,
  diya: Diya,
};

export default function EventDetails({ ceremony }) {
  return (
    <section
      id="ceremony"
      className="section-shell py-16 sm:py-20 lg:py-28"
      aria-label="Ceremony details"
    >
      <SectionHeading label={ceremony.sectionLabel} className="reveal" />

      <article className="paper-card event-card reveal reveal-d1 mt-8">
        <h3 className="event-name">{ceremony.name}</h3>
        {ceremony.nameTe ? (
          <p className="te te-heading mt-1">{ceremony.nameTe}</p>
        ) : null}
        <p className="event-subtitle">{ceremony.subtitle}</p>
        {ceremony.subtitleTe ? (
          <p className="te te-sm mt-1">{ceremony.subtitleTe}</p>
        ) : null}

        <div className="event-facts">
          {ceremony.facts.map((fact) => {
            const Icon = ICONS[fact.icon] ?? HouseIcon;
            return (
              <div className="event-fact" key={fact.label}>
                <span className="event-fact-icon">
                  <Icon />
                </span>
                <span>
                  <span className="event-fact-label">{fact.label}</span>
                  <span className="event-fact-value">{fact.value}</span>
                </span>
              </div>
            );
          })}
        </div>

        <p className="event-muhurat">
          <ClockIcon />
          {ceremony.muhurat}
        </p>
      </article>

      {ceremony.also?.length ? (
        <div className="also-grid mt-6">
          {ceremony.also.map((item) => {
            const Icon = ICONS[item.icon] ?? Om;
            return (
              <article
                className="paper-card also-card reveal reveal-d2"
                key={item.title}
              >
                <span className="ritual-icon">
                  <Icon className="ritual-icon-svg" aria-hidden="true" />
                </span>
                <h3 className="also-title">{item.title}</h3>
                {item.titleTe ? <p className="te te-sm">{item.titleTe}</p> : null}
                <p className="also-when">
                  {item.date} · {item.time}
                </p>
                {item.note ? <p className="also-note">{item.note}</p> : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}