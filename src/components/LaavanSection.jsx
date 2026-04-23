function LaavanSection({ laavan }) {
  if (!laavan) return null;

  return (
    <section id="laavan-section" className="tc">
      <div className="reveal">
        <span className="sec-label">{laavan.sectionLabel}</span>
        <h2 className="sec-heading">{laavan.title}</h2>
        <p className="laavan-intro">{laavan.intro}</p>
      </div>

      {laavan.cards?.length ? (
        <div className="laavan-grid reveal">
          {laavan.cards.map((card, index) => (
            <article className="laavan-card" key={`${card.title}-${index}`}>
              <span className="laavan-num">{card.number ?? index + 1}</span>
              <span className="laavan-title">{card.title}</span>
              <p className="laavan-desc">{card.description}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default LaavanSection;
