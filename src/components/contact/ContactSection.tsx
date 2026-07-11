import { useState } from "react";
import { SITE_COPY } from "../../config/site";
import { Toast } from "../ui/Toast";
import "./contact.css";

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Continue with the legacy browser fallback.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}

export function ContactSection() {
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  const handleCopy = async () => {
    const copied = await copyText(SITE_COPY.contactEmail);
    setToast(copied
      ? { message: "邮箱复制成功", tone: "success" }
      : { message: "复制失败，请手动复制", tone: "error" });
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-section__content">
        <span className="section-kicker">CONTACT</span>
        <h2 id="contact-title">让顶部这一小块空间，<br />替你多做一点事。</h2>
        <p>有任何建议、反馈或合作想法，欢迎联系我们。</p>
        <button className="contact-email" type="button" onClick={handleCopy}>
          <span>{SITE_COPY.contactEmail}</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
    </section>
  );
}

