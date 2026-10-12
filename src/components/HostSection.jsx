import { Om, Kalash } from "./Motifs";
import SectionHeading from "./SectionHeading";

export default function HostSection({ family }) {
  const couple = family.hosts.find((group) => group.kind === "couple");
  const sons = family.hosts.find((group) => group.kind === "sons");

  /* The Telugu mirrors the Latin line: one line, both names, so the two
     scripts read as the same single unit rather than as two entries. */
  const coupleTe = couple?.people.map((person) => person.nameTe).filter(Boolean).join(" & ");

  /* Column counts follow the number of sons: never a fixed four, which
     left half the row empty for a two-child family on a desktop. A
     single son is never left stranded in the left column.

     Only the wide count is handed to CSS. The narrow count is derived
     there, so the very small screens that need one-per-row can still
     override it — an inline custom property here would outrank any
     media query. */
  const sonCount = sons?.people.length ?? 0;
  const colsWide = Math.min(Math.max(sonCount, 1), 4);

  return (
    <section
      id="hosts"
      className="section-shell py-16 sm:py-20 lg:py-28"
      aria-label="Our hosts"
    >
      <SectionHeading
        label={family.sectionLabel}
        title={family.heading}
        titleTe={family.headingTe}
        intro={family.intro}
        introTe={family.introTe}
        className="reveal"
      />

      {/* Parents share one card and one name line. Stacking them as two
          blocks with a rule between read as two separate people, which is
          wrong for a couple — the names belong together. */}
      {couple ? (
        <div className="hosts-couple mt-10 reveal">
          <article className="paper-card host-card host-card-couple">
            <Kalash className="host-ornament" aria-hidden="true" />
            {/* The surname is shared, so it is set once in bold above
                the pair rather than repeated inside both names. */}
            {couple.surname ? (
              <p className="host-surname">{couple.surname}</p>
            ) : null}
            <h3 className="host-name host-name-couple">
              {couple.people.map((person, index) => (
                <span className="host-name-fragment" key={person.name}>
                  {index > 0 ? (
                    <span className="host-amp" aria-hidden="true">
                      &amp;
                    </span>
                  ) : null}
                  <span className="host-name-part">{person.name}</span>
                </span>
              ))}
            </h3>
            {couple.surnameTe ? (
              <p className="te te-sm mt-2 host-surname-te">{couple.surnameTe}</p>
            ) : null}
            {coupleTe ? (
              <p className="te te-sm mt-1 host-name-couple-te">{coupleTe}</p>
            ) : null}
            {couple.sub ? <p className="host-sub">{couple.sub}</p> : null}
          </article>
        </div>
      ) : null}

      {/* Sons are named individually, below the parents. */}
      {sons ? (
        <div className="hosts-sons">
          {sons.label ? (
            <p className="hosts-sons-label reveal">{sons.label}</p>
          ) : null}
          <div
            className="hosts-sons-grid"
            style={{ "--cols-wide": colsWide }}
          >
            {sons.people.map((person, index) => (
              <article
                className={`paper-card host-card host-card-son reveal reveal-d${Math.min(index + 1, 3)}`}
                key={person.name}
              >
                <Om className="host-ornament host-ornament-sm" aria-hidden="true" />
                <h3 className="host-name host-name-son">{person.name}</h3>
                {person.nameTe ? (
                  <p className="te te-sm mt-1">{person.nameTe}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}

      <div className="text-center reveal reveal-d3">
        <p className="hosts-signoff">{family.signoff}</p>
        {family.signoffTe ? (
          <p className="te mt-1">{family.signoffTe}</p>
        ) : null}
        <p className="hosts-family">{family.familyName}</p>
        {family.familyNameTe ? (
          <p className="te mt-1">{family.familyNameTe}</p>
        ) : null}
      </div>
    </section>
  );
}