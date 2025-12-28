import LeadForm from "@/ui/components/forms/lead-form";
import AnimateOnScroll from "@/ui/components/AnimateOnScroll";

export const metadata = {
  title: "Contact — Julin Real Estate",
};

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <AnimateOnScroll>
        <section className="section">
          <div className="container">
            <h1>Contact Us</h1>
            <p className="text-muted max-w-prose">Have questions or want to schedule a viewing? Send us a message and our team will get back to you promptly.</p>
          </div>
        </section>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimateOnScroll>
          <div className="card md:col-span-2">
            <h2>Send an inquiry</h2>
            <LeadForm propertyId={""} />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <aside className="card">
            <h3>Office</h3>
            <p>Julin Real Estate</p>
            <p>123 Main Street, City</p>
            <p>Email: hello@julinrealestate.com</p>
            <p>Phone: +1 555 0123</p>
          </aside>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
