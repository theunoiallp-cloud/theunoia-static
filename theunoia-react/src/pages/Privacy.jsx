import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import SiteFooter from '../sections/home/SiteFooter.jsx';
import '../content/legal.css';

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy · THEUNOiA';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <Header />
      <main className="legal-wrap">
        <header className="legal-header">
          <span className="legal-eyebrow">Legal &amp; Trust</span>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last Updated: October 2026 · Effective Date: October 2026</p>
        </header>

        <article className="legal-content">
          <div className="legal-callout">
            <p><strong>Summary:</strong> THEUNOiA respects your privacy. We collect only the information necessary to provide our digital services, review maker applications, and communicate with you. We do not sell or rent your personal information to third parties.</p>
          </div>

          <h2>1. Who We Are</h2>
          <p>This Privacy Policy applies to <strong>THEUNOiA LLP</strong> ("THEUNOiA", "we", "our", or "us"), a technology and software development company based in Chandrapur, Maharashtra, India. We operate the website <a href="https://www.theunoia.com">www.theunoia.com</a> and associated digital initiatives, including Hunhar and Hivh.</p>

          <h2>2. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when interacting with our website:</p>
          <ul>
            <li><strong>Contact Us Inquiries:</strong> When you submit a project request or question, we collect your full name, email address, phone number, company name (optional), physical address (optional), and the details of your project or inquiry.</li>
            <li><strong>Become a Maker / Team Applications:</strong> When applying to join THEUNOiA as a maker, student contributor, or team member, we collect your full name, email address, phone number, designated department or role, and any custom role specifications you submit.</li>
            <li><strong>Technical &amp; Usage Data:</strong> We may collect standard server logs and technical information such as browser type, operating system, IP address, and pages visited to ensure the security, stability, and responsiveness of our platform.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information strictly for legitimate business and operational purposes:</p>
          <ul>
            <li>To respond to your inquiries, consultation requests, and customer service needs.</li>
            <li>To evaluate candidates and student makers for team roles and collaboration opportunities.</li>
            <li>To prepare project proposals, service contracts, and milestones.</li>
            <li>To maintain website security, prevent spam, and enforce our terms of service.</li>
            <li>To comply with applicable legal and statutory requirements in India.</li>
          </ul>

          <h2>4. Storage, Security &amp; Infrastructure</h2>
          <p>Your inquiries and application records are securely transmitted and stored using industry-standard encryption protocols. We use managed database infrastructure provided by <strong>Supabase Inc.</strong> with strict Row Level Security (RLS) policies configured to isolate data and prevent unauthorized public access. Our frontend application is hosted on <strong>Vercel Inc.</strong></p>
          <p>While we implement rigorous technical and administrative security measures, no electronic transmission over the internet can be guaranteed as 100% immune from vulnerabilities. We encourage users to avoid transmitting sensitive passwords, payment credentials, or government identification numbers through our contact forms.</p>

          <h2>5. Third-Party Sharing</h2>
          <p>We do not sell, rent, or trade your personal data. We disclose information only under the following limited circumstances:</p>
          <ul>
            <li><strong>Trusted Service Providers:</strong> Cloud hosting (Vercel) and database providers (Supabase) who operate under strict confidentiality and data protection terms.</li>
            <li><strong>Legal Compliance:</strong> When required by lawful process, court order, or governmental authority under the laws of India.</li>
            <li><strong>Protection of Rights:</strong> To investigate potential violations, protect our intellectual property, or defend our rights, property, or safety.</li>
          </ul>

          <h2>6. Cookies &amp; Tracking</h2>
          <p>Our website utilizes essential session cookies and local browser storage (such as saving in-progress editor drafts) strictly necessary for site navigation, security, and performance. We do not deploy intrusive third-party cross-site advertising trackers.</p>

          <h2>7. Your Privacy Rights</h2>
          <p>Under applicable data protection laws, you have the right to:</p>
          <ul>
            <li>Request access to the personal data we hold about you.</li>
            <li>Request correction or updating of inaccurate information.</li>
            <li>Request deletion of your contact inquiry or application records from our database.</li>
            <li>Withdraw consent to future communications from THEUNOiA.</li>
          </ul>
          <p>To exercise any of these rights, please contact our team using the details below.</p>

          <div className="legal-contact-card">
            <h3>Questions or Requests?</h3>
            <p>If you have any questions regarding this Privacy Policy or wish to request data deletion, please contact:</p>
            <p><strong>THEUNOiA LLP</strong><br />Laxmi Nagar, Chandrapur, Maharashtra – 442401, India<br />Email: <a href="mailto:howdy@theunoia.com">howdy@theunoia.com</a><br />Phone: <a href="tel:+916374214583">+91 63742 14583</a></p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
