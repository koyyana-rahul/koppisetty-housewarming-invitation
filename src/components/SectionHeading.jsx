export default function SectionHeading({
  label,
  title,
  titleTe,
  intro,
  introTe,
  align = "center",
  className = "",
}) {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`${alignment} ${className}`}>
      {label ? <span className="eyebrow">{label}</span> : null}
      {titleTe ? <h2 className="section-title te mt-3">{titleTe}</h2> : null}
      {title ? <h3 className="section-title mt-3">{title}</h3> : null}
      {intro ? <p className="lede mt-4">{intro}</p> : null}
      {introTe ? <p className="lede te te-sm mt-2">{introTe}</p> : null}
    </div>
  );
}