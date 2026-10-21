import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import SiteFooter from '../sections/home/SiteFooter.jsx';
import '../content/legal.css';

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service · THEUNOiA';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <Header />
      <main className="legal-wrap">
        <header className="legal-header">
          <span className="legal-eyebrow">Agreements</span>
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-updated">Last Updated: October 2026 · Effective Date: October 2026</p>
        </header>

        <article className="legal-content">
          <div className="legal-callout">
            <p><strong>Overview:</strong> These Terms of Service govern your access to and use of the website, software development services, and digital products provided by THEUNOiA LLP. By accessing our website or engaging our services, you agree to these Terms.</p>
          </div>

          <h2>1. Introduction &amp; Acceptance</h2>
          <p>These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client", "User", or "You") and <strong>THEUNOiA LLP</strong> ("THEUNOiA", "Company", "we", or "us"). If you do not agree with any part of these Terms, please do not use our website or services.</p>

          <h2>2. Scope of Services</h2>
          <p>THEUNOiA is a software development and digital products company. Our services include, but are not limited to:</p>
          <ul>
            <li>Custom web application design and engineering.</li>
            <li>Full-stack software development and cloud deployment.</li>
            <li>UI/UX design, design systems, and frontend architecture.</li>
            <li>Digital platform development and technology consulting.</li>
            <li>Student-first initiatives including Hunhar (freelance marketplace) and Hivh (community workshops).</li>
          </ul>
          <p>Specific project deliverables, timelines, payment schedules, and project scopes are detailed in written Statements of Work (SOW) or Master Services Agreements (MSA) executed between the Client and THEUNOiA.</p>

          <h2>3. Intellectual Property Rights</h2>
          <p><strong>Client Deliverables:</strong> Upon receipt of full and final payment for a contracted project milestone, the custom software, designs, and content specifically created for the Client will become the property of the Client, subject to any retained open-source dependencies or pre-existing libraries.</p>
          <p><strong>THEUNOiA Pre-Existing IP:</strong> THEUNOiA retains all right, title, and interest in its pre-existing tools, proprietary code libraries, modular architectures, frameworks, know-how, and website design assets (including THEUNOiA trademarks, logos, and branding).</p>

          <h2>4. Client Responsibilities</h2>
          <p>To ensure successful project delivery, the Client agrees to:</p>
          <ul>
            <li>Provide prompt, accurate information, project assets, brand guidelines, and required technical credentials.</li>
            <li>Appoint an authorized representative empowered to review deliverables and provide binding project approvals.</li>
            <li>Conduct timely acceptance reviews within the agreed milestone evaluation windows (typically 7 business days).</li>
            <li>Ensure that all materials, media, and trademarks provided to THEUNOiA do not infringe third-party intellectual property rights.</li>
          </ul>

          <h2>5. Confidentiality</h2>
          <p>Both parties agree to treat all non-public technical, business, and financial information disclosed during project engagements as strictly confidential. Confidential information will not be disclosed to any third party without prior written consent, except as required by applicable law.</p>

          <h2>6. Limitation of Liability</h2>
          <p>To the maximum extent permitted by applicable Indian law, in no event shall THEUNOiA LLP, its partners, makers, or affiliates be liable for indirect, incidental, consequential, special, or punitive damages (including loss of profits, data, business goodwill, or opportunity) arising out of or in connection with the use of our services or website.</p>
          <p>THEUNOiA's aggregate liability under any contracted engagement shall be strictly limited to the actual fees received by THEUNOiA for the specific milestone or deliverable giving rise to the claim.</p>

          <h2>7. Warranties &amp; Disclaimers</h2>
          <p>Our website and general content are provided on an "as-is" and "as-available" basis without warranties of any kind. Custom engineering projects include a standard post-launch bug warranty period specified in each individual project agreement, during which reproducible defects will be resolved at no additional charge.</p>

          <h2>8. Governing Law &amp; Jurisdiction</h2>
          <p>These Terms shall be governed by, and construed in accordance with, the laws of the Republic of India. Any legal suit, action, or proceeding arising out of or related to these Terms shall be instituted exclusively in the competent courts located in Maharashtra, India.</p>

          <div className="legal-contact-card">
            <h3>Contact Us Regarding These Terms</h3>
            <p>If you have questions about these Terms of Service or wish to discuss an enterprise Master Services Agreement, reach out to:</p>
            <p><strong>THEUNOiA LLP</strong><br />Laxmi Nagar, Chandrapur, Maharashtra – 442401, India<br />Email: <a href="mailto:howdy@theunoia.com">howdy@theunoia.com</a><br />Phone: <a href="tel:+916374214583">+91 63742 14583</a></p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
