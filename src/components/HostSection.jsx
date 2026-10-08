import { Om, Kalash } from "./Motifs";
import SectionHeading from "./SectionHeading";

export default function HostSection({ family }) {
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
        intro={family.intro[0]}
        introTe={family.introTe}
        className="reveal"
      />

      <div className="hosts-grid mt-10">
        {family.hosts.map((host, index) => (
          <article
            className={`paper-card host-card reveal reveal-d${index + 1}`}
            key={host.name}
          >
            {index === 0 ? (
              <Kalash className="host-ornament" aria-hidden="true" />
            ) : (
              <Om className="host-ornament" aria-hidden="true" />
            )}
            <h3 className="host-name">{host.name}</h3>
            {host.nameTe ? (
              <p className="te te-sm mt-1">{host.nameTe}</p>
            ) : null}
            <p className="host-sub">{host.sub}</p>
          </article>
        ))}
      </div>

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