"use client";

import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function HireMeModal({ onClose }) {
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Abdul Wahid",
          from_email: form.email,
          to_email: "cs.abdulwahid@gmail.com",
          message: `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setStatus("sent");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error(error);
          setStatus("error");
        }
      );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="modal-close"
        >
          ×
        </button>

        <div className="eyebrow mono">LET&apos;S WORK TOGETHER</div>
        <h3 className="modal-heading">Hire Me.</h3>
        <p className="modal-sub">
          Tell me a bit about your project and I&apos;ll get back to you at{" "}
          <span style={{ color: "var(--ink)" }}>cs.abdulwahid@gmail.com</span>{" "}
          as soon as possible.
        </p>

        {status === "sent" ? (
          <p className="modal-success mono">
            Message sent — I&apos;ll get back to you soon.
          </p>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="modal-form">
            <label className="modal-field">
              <span>Your Name</span>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="What's your good name?"
              />
            </label>
            <label className="modal-field">
              <span>Your Email</span>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </label>
            <label className="modal-field">
              <span>Your Message</span>
              <textarea
                rows={5}
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                placeholder="What do you want to say?"
              />
            </label>

            <button type="submit" className="btn btn-primary mono" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            {status === "error" && (
              <p className="modal-error mono">
                Something went wrong — please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
