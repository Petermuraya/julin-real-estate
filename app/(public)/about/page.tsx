import AnimateOnScroll from "@/ui/components/AnimateOnScroll";

export const metadata = {
  title: "About — Julin Real Estate",
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <AnimateOnScroll>
        <section className="section">
          <div className="container">
            <h1>About Julin Real Estate</h1>
            <p className="text-muted max-w-prose">We are a small team dedicated to helping you find your perfect home. We combine deep local knowledge with modern tools to make every transaction smooth.</p>
          </div>
        </section>
      </AnimateOnScroll>

      <div className="container grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimateOnScroll>
          <div className="card">
            <h3>Our Mission</h3>
            <p>Deliver honest, transparent, and efficient real estate services.</p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div className="card">
            <h3>Our Values</h3>
            <ul className="list-disc pl-5">
              <li>Customer first</li>
              <li>Integrity</li>
              <li>Local expertise</li>
            </ul>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div className="card">
            <h3>Team</h3>
            <p>Small but experienced team of agents and support staff.</p>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
