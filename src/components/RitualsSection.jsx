import {
  Diya,
  Kalash,
  KumkumBowl,
  LeafSprig,
  Lotus,
  Mandala,
  Om,
} from "./Motifs";
import SectionHeading from "./SectionHeading";

const RITUAL_ICONS = {
  kalash: Kalash,
  toran: LeafSprig,
  rangoli: Lotus,
  diya: Diya,
  kumkum: KumkumBowl,
  vastu: Om,
};

export default function RitualsSection({ rituals }) {
  return (
    <section
      id="rituals"
      className="section-shell py-16 sm:py-20 lg:py-28"
      aria-label="Rituals of the ceremony"
    >
      <Mandala
        className="pointer-events-none absolute left-1/2 top-8 -z-10 w-[420px] -translate-x-1/2 text-gold opacity-20"
        petals={14}
        aria-hidden="true"
      />

      <SectionHeading
        label={rituals.sectionLabel}
        title={rituals.title}
        titleTe={rituals.titleTe}
        intro={rituals.intro}
        introTe={rituals.introTe}
        className="reveal"
      />

      <div className="rituals-grid">
        {rituals.cards.map((card, index) => {
          const Icon = RITUAL_ICONS[card.icon] ?? Mandala;
          return (
            <article
              className={`paper-card ritual-card reveal reveal-d${(index % 3) + 1}`}
              key={card.title}
            >
              <span className="ritual-icon">
                <Icon className="ritual-icon-svg" aria-hidden="true" />
              </span>
              <h3 className="ritual-title">{card.title}</h3>
              <p className="ritual-desc">{card.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}