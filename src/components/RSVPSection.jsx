import { useState } from "react";

function RSVPSection({ rsvp, coupleLabel }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("2");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(() =>
    (rsvp.events ?? [])
      .filter((event) => event.checked)
      .map((event) => event.value),
  );
  const [submitted, setSubmitted] = useState(false);

  const toggleEvent = (value) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const submitRSVP = () => {
    if (!name.trim()) {
      alert("Please enter your name to Rsvp.");
      return;
    }

    const waText = encodeURIComponent(
      `✨ Rsvp — ${coupleLabel}'s Wedding\n\n` +
        `Name: ${name}\nPhone: ${phone || "—"}\nGuests: ${guests}\n` +
        `Attending: ${selected.join(", ") || "—"}\n` +
        (message ? `Message: ${message}` : ""),
    );

    try {
      window.open(
        `https://wa.me/${rsvp.whatsappNumber}?text=${waText}`,
        "_blank",
      );
    } catch {
      // noop
    }

    setSubmitted(true);
  };

  return (
    <section id="rsvp-section" className="tc reveal">
      <span className="sec-label">Join the Celebration</span>
      <h2 className="sec-heading">{rsvp.title}</h2>
      <p
        style={{
          fontStyle: "italic",
          color: "var(--text-mid)",
          fontSize: "1.05rem",
          marginBottom: ".25rem",
        }}
      >
        Kindly respond by {rsvp.deadline}
      </p>

      <div className="rsvp-wrap">
        {!submitted ? (
          <div id="rsvp-form-inner">
            <div className="rsvp-field">
              <label>Your Full Name</label>
              <input
                type="text"
                id="rsvp-name"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="rsvp-field">
              <label>Phone / WhatsApp Number</label>
              <input
                type="tel"
                id="rsvp-phone"
                placeholder="+1 (xxx) xxx-xxxx"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>

            <div className="rsvp-field">
              <label>Number of Guests</label>
              <select
                id="rsvp-guests"
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
              >
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
                <option value="5+">5 or more guests</option>
              </select>
            </div>

            <div className="rsvp-field">
              <label>Events You Will Join</label>
              <div className="evt-checks">
                {(rsvp.events ?? []).map((event) => (
                  <label className="evt-chk" key={event.value}>
                    <input
                      type="checkbox"
                      value={event.value}
                      checked={selected.includes(event.value)}
                      onChange={() => toggleEvent(event.value)}
                    />
                    {event.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="rsvp-field" style={{ marginTop: "1rem" }}>
              <label>Message & Blessings (Optional)</label>
              <textarea
                id="rsvp-msg"
                rows="3"
                placeholder="Send your heartfelt wishes to the couple…"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>

            <button className="rsvp-btn" onClick={submitRSVP}>
              Confirm Rsvp →
            </button>

            <div className="rsvp-divider">— Contact Details —</div>
            <div className="contact-plain">
              {(rsvp.contacts ?? []).map((contact) => (
                <span key={contact.label}>
                  <strong>{contact.label}:</strong> {contact.value}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div id="rsvp-success" style={{ display: "block" }}>
            <span className="success-icon">🌸</span>
            <span className="success-title">{rsvp.success?.title}</span>
            <p className="success-msg">{rsvp.success?.message}</p>
            <div style={{ marginTop: "2.5rem" }}>
              <div className="contact-plain">
                {(rsvp.success?.contacts ?? []).map((contact) => (
                  <span key={contact.label}>
                    <strong>{contact.label}:</strong> {contact.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default RSVPSection;
