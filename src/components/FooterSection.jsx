import { Diya, Mandala } from "./Motifs";

export default function FooterSection({
  footer,
  familyName,
  familyNameTe,
  sanskrit,
}) {
  return (
    <footer id="footer" aria-label="Closing blessings">
      <div className="footer-inner text-center reveal">
        <Mandala className="footer-mandala" petals={18} />

        <Diya className="footer-diya" />

        <p className="footer-msg">{footer.message}</p>
        {footer.messageTe ? (
          <p className="footer-msg te mt-2">{footer.messageTe}</p>
        ) : null}

        <p className="footer-signoff">{footer.signoff}</p>
        {footer.signoffTe ? (
          <p className="footer-signoff te">{footer.signoffTe}</p>
        ) : null}

        <span className="footer-name">{familyName}</span>
        {familyNameTe ? (
          <span className="footer-name-te">{familyNameTe}</span>
        ) : null}

        <p className="footer-sanskrit">{sanskrit}</p>

        <p className="footer-credit">
          {footer.creditPrefix} <span className="icon">{footer.creditIcon}</span>{" "}
          {footer.creditText}
        </p>
      </div>
    </footer>
  );
}