import { Kalash, Mandala, Toran } from "./Motifs";

export default function HeroSection({ hero, familyName, onCta }) {
  return (
    <section id="home" aria-label="Welcome">
      <Mandala className="hero-mandala" petals={20} />
      <Toran className="hero-toran" />
      <div className="hero-glow" />

      <div className="hero-card">
        <div className="hero-frame" />

        <p className="invocation">{hero.invocation}</p>
        {hero.invocationTe ? (
          <p className="invocation te mt-1">{hero.invocationTe}</p>
        ) : null}

        <Kalash className="hero-kalash" />

        <p className="hero-blessing">{hero.blessing}</p>
        {hero.blessingTe ? (
          <p className="hero-blessing te te-sm mt-1">{hero.blessingTe}</p>
        ) : null}

        <span className="hero-eyebrow">{hero.eyebrow}</span>
        {hero.eyebrowTe ? (
          <span className="hero-eyebrow te te-sm block mt-1">
            {hero.eyebrowTe}
          </span>
        ) : null}

        <h1 className="hero-headline">
          {hero.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        {hero.headlineTe ? (
          <p className="hero-te">
            {hero.headlineTe.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        ) : null}

        <div className="ornament-rule hero-divider">
          <span>❀</span>
        </div>

        <p className="hero-lede lede">{hero.lede}</p>
        {hero.ledeTe ? <p className="hero-te-sm lede">{hero.ledeTe}</p> : null}

        <span className="hero-family">{familyName}</span>
      </div>

      <button type="button" className="scroll-cue" onClick={onCta}>
        <span>Scroll</span>
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </section>
  );
}