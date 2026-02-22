import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import "./FAQ.css";

export default function FAQ() {

  const faqs = [
    {
      question: "Our Journey",
      answer:
        "We started with a mission to deliver natural and sustainable superfoods to every household."
    },
    {
      question: "Being Unique!!!",
      answer:
        "Our uniqueness lies in combining traditional knowledge with modern food science."
    },
    {
      question: "We Indulge in Offering",
      answer:
        "We offer premium quality, organic, and carefully processed natural products."
    },
    {
      question: "We made it simple for you!!!",
      answer:
        "From farm to doorstep, we ensure smooth sourcing, processing, and delivery."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      <div className="faq-container">
        {faqs.map((item, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <span>{item.question}</span>
              {activeIndex === index ? <FiMinus /> : <FiPlus />}
            </div>

            {activeIndex === index && (
              <div className="faq-answer">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}