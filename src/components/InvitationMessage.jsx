import { Toran } from "./Motifs";
import SectionHeading from "./SectionHeading";

export default function InvitationMessage({ message }) {
  return (
    <section
      id="invitation"
      className="section-shell py-16 sm:py-20 lg:py-28"
      aria-label="The invitation"
    >
      <Toran
        className="mx-auto mb-8 w-[min(420px,88%)] text-leaf opacity-40"
        aria-hidden="true"
      />

      <SectionHeading
        label={message.sectionLabel}
        title={message.heading}
        titleTe={message.headingTe}
        className="reveal"
      />

      <article className="paper-card message-card reveal reveal-d1 mt-8">
        <div className="message-dropcap" aria-hidden="true">
          {message.dropcap}
        </div>

        <div className="message-body">
          {message.paragraphsTe?.map((paragraph) => (
            <p key={paragraph.slice(0, 20)} className="te">
              {paragraph}
            </p>
          ))}
          {message.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className={message.paragraphsTe?.length ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="ornament-rule mt-7">
          <span>❀</span>
        </div>

        <p className="message-closing">{message.closingLine}</p>
      </article>
    </section>
  );
}