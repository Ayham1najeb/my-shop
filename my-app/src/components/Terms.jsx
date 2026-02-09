// src/components/Terms.jsx
import React from "react";
import "./Terms.css"; // CSS خارجي

const Terms = () => {
  return (
    <div className="terms-page">
      <h1 className="terms-title">Terms & Conditions</h1>
      <p className="terms-subtitle">
        Please read these terms carefully before using our services.
      </p>

      <div className="terms-sections">
        <section>
          <h3>Acceptance of Terms</h3>
          <p>
            By accessing our website, you agree to comply with and be bound by these terms and conditions.
          </p>
        </section>

        <section>
          <h3>Use of Services</h3>
          <p>
            You agree to use our services only for lawful purposes and in a way that does not infringe the rights of others.
          </p>
        </section>

        <section>
          <h3>Account Responsibilities</h3>
          <p>
            Users are responsible for maintaining the confidentiality of their account information and are responsible for all activities that occur under their account.
          </p>
        </section>

        <section>
          <h3>Limitation of Liability</h3>
          <p>
            We are not liable for any damages arising from the use or inability to use our services, including but not limited to direct, indirect, incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h3>Modifications</h3>
          <p>
            We reserve the right to modify these terms at any time. Users should check this page regularly for updates.
          </p>
        </section>
      </div>

      <div className="terms-cta">
        <a href="/contact">Contact Us for Questions</a>
      </div>
    </div>
  );
};

export default Terms;
