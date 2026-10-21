import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import SiteFooter from '../sections/home/SiteFooter.jsx';
import '../content/legal.css';

export default function Refund() {
  useEffect(() => {
    document.title = 'Refund & Cancellation Policy · THEUNOiA';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <Header />
      <main className="legal-wrap">
        <header className="legal-header">
          <span className="legal-eyebrow">Billing &amp; Payments</span>
          <h1 className="legal-title">Refund &amp; Cancellation Policy</h1>
          <p className="legal-updated">Last Updated: October 2026 · Effective Date: October 2026</p>
        </header>

        <article className="legal-content">
          <div className="legal-callout">
            <p><strong>Notice:</strong> Because THEUNOiA provides custom, bespoke software engineering, architecture, and digital design services, billing is structured around defined deliverables and milestone approvals. This policy outlines how cancellations, deposits, and refunds are handled.</p>
          </div>

          <h2>1. Milestone-Based Engagements</h2>
          <p>Most commercial engagements with THEUNOiA LLP operate on a phased milestone schedule outlined in your project proposal or Statement of Work (SOW):</p>
          <ul>
            <li><strong>Discovery &amp; Scoping Deposit:</strong> Covers initial architectural discovery, wireframing, UX exploration, and technical specification. Deposits are dedicated to engineering resource allocation and are non-refundable once discovery sprints commence.</li>
            <li><strong>Development Sprints:</strong> Billed at pre-agreed milestone thresholds (e.g. Design Sign-off, Alpha/MVP Build, Final Acceptance). Once a milestone deliverable is approved by the client in writing, the associated milestone payment is final and non-refundable.</li>
            <li><strong>Final Deployment &amp; Handover:</strong> Released upon full acceptance and deployment to the client's production environment or repository transfer.</li>
          </ul>

          <h2>2. Project Cancellation by Client</h2>
          <p>Clients may request project cancellation in writing at any time. Upon receiving written notice:</p>
          <ul>
            <li>All active engineering and design work ceases immediately.</li>
            <li>The client is invoiced only for verified work completed up to the cancellation notice date, calculated at our standard hourly or milestone rate.</li>
            <li>Any unearned advance funds remaining after settling completed sprint hours and incurred third-party expenses will be refunded to the original payment source within 14 business days.</li>
            <li>All completed code, design files, and documentation created up to the date of settlement will be packaged and delivered to the client upon full clearance of outstanding dues.</li>
          </ul>

          <h2>3. Non-Refundable Items &amp; Expenses</h2>
          <p>The following costs are non-refundable under all circumstances:</p>
          <ul>
            <li>Third-party domain registrations, DNS services, and SSL certificates purchased on your behalf.</li>
            <li>Cloud infrastructure costs (e.g., AWS, Supabase, Vercel, Google Cloud, Docker registries) provisioned for the project.</li>
            <li>Commercial fonts, stock assets, iconography licenses, or third-party API subscriptions.</li>
            <li>Completed and formally approved milestones.</li>
          </ul>

          <h2>4. Defect Remediation &amp; Warranty</h2>
          <p>Rather than monetary refunds for subjective revisions, THEUNOiA provides a post-launch defect warranty period (typically 30 days from launch, or as specified in your SOW). If a deliverable fails to conform to the documented technical specification, our engineering team will patch, rectify, and resolve the defect at no additional charge.</p>

          <h2>5. Dispute Resolution</h2>
          <p>We take pride in building transparent, high-trust relationships with startups and businesses. If you are dissatisfied with any phase of our work, we encourage you to contact your project lead immediately to conduct an executive review and establish an amicable remediation roadmap.</p>

          <div className="legal-contact-card">
            <h3>Billing &amp; Project Inquiries</h3>
            <p>For questions regarding invoices, milestone schedules, or payment terms, please reach out to our finance and operations team:</p>
            <p><strong>THEUNOiA LLP</strong><br />Laxmi Nagar, Chandrapur, Maharashtra – 442401, India<br />Email: <a href="mailto:howdy@theunoia.com">howdy@theunoia.com</a><br />Phone: <a href="tel:+916374214583">+91 63742 14583</a></p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
