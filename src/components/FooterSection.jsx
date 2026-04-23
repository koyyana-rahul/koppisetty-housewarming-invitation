function FooterSection({ footer }) {
  return (
    <section id="footer-section">
      <div className="tc reveal">
        <span
          style={{
            fontSize: "2.2rem",
            display: "block",
            marginBottom: "1rem",
            opacity: 0.75,
          }}
        >
          {footer.symbol}
        </span>

        <p className="footer-msg">
          {footer.message.split("\n").map((line, idx) => (
            <span key={`${line}-${idx}`}>
              {line}
              <br />
            </span>
          ))}
        </p>

        <span className="footer-name">{footer.couple}</span>

        <div className="footer-credit" style={{ marginTop: "3.5rem" }}>
          {footer.creditPrefix}{" "}
          <span style={{ color: "#e74c3c" }}>{footer.creditHeart}</span>{" "}
          {footer.creditBy}{" "}
          {footer.creditLink ? (
            <a href={footer.creditLink} target="_blank" rel="noreferrer">
              {footer.creditText}
            </a>
          ) : (
            footer.creditText
          )}
        </div>
      </div>
    </section>
  );
}

export default FooterSection;
