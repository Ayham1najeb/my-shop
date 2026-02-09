// src/components/Privacy.jsx
import React from "react";
import "./Privacy.css"; // CSS خارجي

const Privacy = () => {
  return (
    <div className="privacy-page">
      <h1 className="privacy-title">Privacy Policy</h1>
      <p className="privacy-subtitle">
        Your privacy matters to us. Learn how we collect, use, and protect your information.
      </p>

      <div className="privacy-sections">
        <section>
          <h3>Information Collection</h3>
          <p>
            We collect information you provide directly, such as your name, email, and payment details. We also gather data automatically to improve your experience.
          </p>
        </section>

        <section>
          <h3>Use of Information</h3>
          <p>
            Your data is used to enhance our services, personalize content, and process transactions securely and efficiently.
          </p>
        </section>

        <section>
          <h3>Data Protection</h3>
          <p>
            We implement top-level security measures, including encryption and firewalls, to ensure your information is safe from unauthorized access.
          </p>
        </section>

        <section>
          <h3>Third-Party Sharing</h3>
          <p>
            We do not sell your data. Trusted partners may have limited access to fulfill services or comply with legal obligations.
          </p>
        </section>
      </div>

      <div className="privacy-cta">
        <a href="/contact">Contact Us for Privacy Concerns</a>
      </div>
    </div>
  );
};

export default Privacy;
