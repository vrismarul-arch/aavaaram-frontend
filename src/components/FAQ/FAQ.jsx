import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import "./FAQ.css";

export default function FAQ() {
const faqs = [
  {
    question: "Is it safe to take multiple supplements together?",
    answer:
      "Yes, it is generally safe when taken in the right dosage. However, some nutrients may interact and affect absorption. It is best to follow recommended usage or consult a healthcare professional."
  },
  {
    question: "Do health supplements have side effects?",
    answer:
      "Health supplements are usually safe when taken correctly. Overuse or wrong combinations may cause mild effects like stomach upset, headache, or allergies. Consult a doctor if needed."
  },
  {
    question: "Do I need a prescription to buy supplements?",
    answer:
      "No, most supplements do not require a prescription and are available over the counter. However, if you have medical conditions or take medications, consult a doctor before use."
  },
  {
    question: "Can supplements be taken for general nutrition?",
    answer:
      "Yes, supplements help fill nutritional gaps and support overall health. However, they should not replace a balanced diet and are best used alongside healthy food habits."
  },
  {
    question: "What is the best time to take supplements?",
    answer:
      "Most supplements are best taken after meals for better absorption. Energy supplements are ideal in the morning, while relaxation or sleep supplements can be taken at night."
  },
  {
    question: "What makes Enerj+ formulations unique?",
    answer:
      "Enerj+ combines 2–4 carefully selected herbal ingredients that work together for better absorption and effectiveness. This ensures faster results with balanced, natural support."
  },
  {
    question: "What is the uniqueness of Enerj+ products?",
    answer:
      "Enerj+ focuses on root-cause healing with multi-functional benefits. It blends traditional herbal knowledge with a scientific approach for safe, effective, and holistic results."
  }
];


  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">Clarity Before Placing Order</h2>
      <p className="faq-subtitle">FAQ(Frequently Asked Questions)</p>

      <div className="faq-container">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <span>{item.question}</span>
              <FiPlus className="faq-icon" />
            </div>

            <div
              className={`faq-answer-wrapper ${
                activeIndex === index ? "open" : ""
              }`}
            >
              <div className="faq-answer">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
