import { useEffect, useRef, useState } from "react";
import logo163 from "../../../assets/contact/163.svg";
import "./contact.css";

const CONTACT_EMAIL = "easynotch@163.com";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(CONTACT_EMAIL);
    } catch {
      const input = document.createElement("textarea");
      input.value = CONTACT_EMAIL;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    setCopied(true);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2_000);
  };

  return (
    <section className="contact-section" aria-labelledby="contact-title">
      <h2 id="contact-title">如有反馈意见，欢迎联系开发者</h2>
      <button className="contact-section__email" type="button" onClick={handleCopy}>
        <img className="contact-section__163" src={logo163} alt="" aria-hidden="true" />
        <span>easynotch@163.com</span>
      </button>
      {copied && <div className="contact-section__toast" role="status">复制成功</div>}
    </section>
  );
}
