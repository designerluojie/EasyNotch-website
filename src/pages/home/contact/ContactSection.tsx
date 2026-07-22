import { useEffect, useRef, useState } from "react";
import logo163 from "../../../assets/contact/163.svg";
import diffuseEllipse from "../../../assets/figma/ellipse-10.svg";
import "./contact.css";

const CONTACT_EMAIL = "easynotch@163.com";
type CopyStatus = "success" | "failure" | null;

function copyWithLegacyCommand() {
  const input = document.createElement("textarea");
  input.value = CONTACT_EMAIL;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  input.style.pointerEvents = "none";
  document.body.appendChild(input);

  try {
    input.focus();
    input.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    input.remove();
  }
}

export function ContactSection() {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  const handleCopy = async () => {
    let didCopy = false;

    try {
      if (typeof navigator.clipboard?.writeText === "function") {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        didCopy = true;
      } else {
        didCopy = copyWithLegacyCommand();
      }
    } catch {
      didCopy = copyWithLegacyCommand();
    }

    setCopyStatus(didCopy ? "success" : "failure");
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopyStatus(null), 2_000);
  };

  return (
    <section className="contact-section" aria-labelledby="contact-title">
      <img
        className="contact-section__diffuse"
        src={diffuseEllipse}
        alt=""
        aria-hidden="true"
        data-testid="contact-diffuse"
      />
      <h2 id="contact-title">
        如有反馈意见<span className="contact-section__desktop-comma">，</span><br className="contact-section__mobile-break" />欢迎联系开发者
      </h2>
      <button className="contact-section__email" type="button" onClick={handleCopy}>
        <img className="contact-section__163" src={logo163} alt="" aria-hidden="true" />
        <span>easynotch@163.com</span>
      </button>
      <div className="contact-section__legal">
        <span>© 2026 EasyNotch. All rights reserved.</span>
        <a href="/privacy/">隐私政策</a>
      </div>
      {copyStatus && (
        <div
          className={`contact-section__toast contact-section__toast--${copyStatus}`}
          role={copyStatus === "failure" ? "alert" : "status"}
        >
          {copyStatus === "success" ? "复制成功" : "复制失败，请手动复制邮箱"}
        </div>
      )}
    </section>
  );
}
