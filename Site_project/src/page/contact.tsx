"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  Send,
} from "lucide-react";
import { contactContent } from "@/app/contact/content";
import { contactStyles } from "@/app/contact/style";
import { apiSubmitContact } from "@/lib/api";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    inquiryType: contactContent.form.fields.inquiryTypes[0] || "",
    message: "",
  });

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiSubmitContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        inquiry_type: formData.inquiryType,
        message: formData.message,
      });
    } catch (err) {
      console.warn("Contact submission backend note:", err);
    } finally {
      setIsSubmitting(false);
    }

    const text = encodeURIComponent(
      `Hello Woody Home! I would like to inquire:\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Inquiry:* ${formData.inquiryType}\n*Message:* ${formData.message}`
    );
    window.open(`https://wa.me/923428762481?text=${text}`, "_blank");
    setSubmitted(true);
  };


  return (
    <div className="flex flex-col w-full">
      {/* ═══ Page Header ═══ */}
      <section className={contactStyles.header.wrapper}>
        <div className={contactStyles.header.container}>
          <h1
            className={contactStyles.header.title}
            style={{
              color: "#111111",
              fontSize: "44px",
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1.2,
            }}
          >
            {contactContent.title}
          </h1>
        </div>
      </section>

      {/* Main Form & Contact Channels Section */}
      <section className={contactStyles.section}>
        <div className={contactStyles.container}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <div className={contactStyles.formWrapper}>
                <div className={contactStyles.formHeader}>
                  <span className={contactStyles.eyebrow}>
                    {contactContent.form.eyebrow}
                  </span>
                  <h2 className={contactStyles.formTitle}>
                    {contactContent.form.title}
                  </h2>
                  <p className={contactStyles.formSubtitle}>
                    {contactContent.form.subtitle}
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-[#111111]">
                      Inquiry Received
                    </h3>
                    <p className="text-sm text-neutral-600 max-w-md mx-auto">
                      Thank you! Our master craft team will review your details and respond promptly via WhatsApp or email.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-bold text-[#C9A84C] hover:underline"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={contactStyles.label}>
                          {contactContent.form.fields.fullName} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="e.g. Tariq Mehmood"
                          className={contactStyles.input}
                        />
                      </div>

                      <div>
                        <label className={contactStyles.label}>
                          {contactContent.form.fields.phone} *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="e.g. +92 300 1234567"
                          className={contactStyles.input}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={contactStyles.label}>
                        {contactContent.form.fields.email}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="yourname@example.com"
                        className={contactStyles.input}
                      />
                    </div>

                    <div>
                      <label className={contactStyles.label}>
                        {contactContent.form.fields.inquiryType}
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) =>
                          setFormData({ ...formData, inquiryType: e.target.value })
                        }
                        className={contactStyles.select}
                      >
                        {contactContent.form.fields.inquiryTypes.map((t, idx) => (
                          <option key={idx} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={contactStyles.label}>
                        {contactContent.form.fields.message} *
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder={contactContent.form.fields.placeholderMessage}
                        className={contactStyles.textarea}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="submit"
                        className={contactStyles.btnWhatsApp}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{contactContent.form.fields.submitWhatsAppButton}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSubmitted(true)}
                        className={contactStyles.btnSubmit}
                      >
                        <Send className="w-4 h-4" />
                        <span>{contactContent.form.fields.submitButton}</span>
                      </button>
                    </div>

                    <p className="text-xs text-center text-neutral-400">
                      {contactContent.form.privacyNotice}
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Channels */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-[#111111] to-[#242424] text-white rounded-3xl p-8 shadow-xl border border-[#C9A84C]/30 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] block mb-2">
                  Direct WhatsApp Support
                </span>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-white mb-2">
                  Order Inquiries &amp; Custom Gifts
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                  Send your reference photos, name engraving requests, or wholesale inquiries directly to our Chiniot artisans for instant quotes.
                </p>
                <a
                  href="https://wa.me/923326457322?text=Hi%20Woody%20Home!%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full font-bold text-sm text-[#111111] bg-[#C9A84C] hover:bg-[#e8c96b] transition-all flex items-center justify-center gap-2 shadow-md no-underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp (+92 332 6457322)</span>
                </a>
              </div>

              {contactContent.channels.map((chan, idx) => (
                <a
                  key={idx}
                  href={chan.href}
                  target={chan.href.startsWith("http") ? "_blank" : undefined}
                  rel={chan.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={chan.highlight ? contactStyles.channelCardHighlight : contactStyles.channelCard}
                >
                  <div className={chan.highlight ? contactStyles.channelIconHighlight : contactStyles.channelIcon}>
                    {chan.iconName === "Phone" && <Phone className="w-5 h-5" />}
                    {chan.iconName === "Mail" && <Mail className="w-5 h-5" />}
                    {chan.iconName === "MapPin" && <MapPin className="w-5 h-5" />}
                    {chan.iconName === "Clock" && <Clock className="w-5 h-5" />}
                    {chan.iconName === "MessageCircle" && <MessageCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                      {chan.title}
                    </h4>
                    <div className="font-bold text-base text-inherit">
                      {chan.detail}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{chan.subtext}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Custom Banner */}
          <div className={contactStyles.customBannerWrap}>
            <h2 className={contactStyles.customBannerTitle}>
              Looking for a Bespoke Custom Creation?
            </h2>
            <p className={contactStyles.customBannerDesc}>
              We specialize in custom carved animal lamps, corporate trophy clocks, engraved executive desk sets, and oversized wall decor crafted to your exact specifications.
            </p>
            <a
              href="https://wa.me/923326457322?text=Hi%20Woody%20Home!%20I%20want%20a%20bespoke%20custom%20design."
              target="_blank"
              rel="noopener noreferrer"
              className={contactStyles.customBannerBtn}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Request Custom Design</span>
            </a>
          </div>

          {/* FAQ Section */}
          {contactContent.faqs && contactContent.faqs.length > 0 && (
            <div className={contactStyles.faqSection}>
              <div className="text-center mb-10">
                <span className={contactStyles.eyebrow}>Frequently Asked</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)] text-[#111111]">
                  Contact &amp; Custom Order Questions
                </h2>
              </div>

              <div>
                {contactContent.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className={contactStyles.faqItem}>
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        type="button"
                        className={contactStyles.faqQuestion}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#C9A84C] shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className={contactStyles.faqAnswer}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
