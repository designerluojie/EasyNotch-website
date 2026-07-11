import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FAQ_ITEMS } from "./faqData";
import "./faq.css";

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<string>>(
    () => new Set(["music"]),
  );

  const toggleItem = (id: string) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="faq-section site-section" id="faq" aria-labelledby="faq-title">
      <div className="faq-section__intro">
        <span className="section-kicker">FAQ</span>
        <h2 id="faq-title">把常用功能放在<br />你伸手可及的地方</h2>
      </div>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openItems.has(item.id);
          return (
            <div className={`faq-item${isOpen ? " faq-item--open" : ""}`} key={item.id}>
              <button
                className="faq-item__trigger"
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => toggleItem(item.id)}
              >
                <span className="faq-item__index">0{index + 1}</span>
                <span>{item.title}</span>
                <span className="faq-item__icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="faq-item__panel"
                    id={`faq-panel-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24 }}
                  >
                    <p>{item.body}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

