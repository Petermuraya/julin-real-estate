import Link from "next/link";

export default function FooterComponent() {
  return (
    <footer className="bg-[var(--color-footer-bg)] text-[var(--color-footer-text)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-lg font-bold text-[var(--color-footer-text)]">Julin Real Estate</Link>
            <p className="mt-2 text-sm text-[var(--color-footer-muted)]">Trusted land & property listings across Kenya.</p>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--color-footer-text)] mb-3">Quick links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/properties" className="hover:underline">Properties</Link></li>
              <li><Link href="/blog" className="hover:underline">Blog</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--color-footer-text)] mb-3">Contact</h4>
            <p className="text-sm">Phone: <a href="tel:+254700000000" className="hover:underline">+254 700 000 000</a></p>
            <p className="text-sm">Email: <a href="mailto:info@example.com" className="hover:underline">info@julin.co.ke</a></p>
            <p className="text-sm mt-2">Office: Nairobi, Kenya</p>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--color-footer-text)] mb-3">Follow us</h4>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded flex items-center justify-center" style={{backgroundColor: 'rgba(255,255,255,0.06)'}}>IG</div>
              <div className="w-9 h-9 rounded flex items-center justify-center" style={{backgroundColor: 'rgba(255,255,255,0.06)'}}>FB</div>
              <div className="w-9 h-9 rounded flex items-center justify-center" style={{backgroundColor: 'rgba(255,255,255,0.06)'}}>X</div>
            </div>
            <p className="text-sm text-[var(--color-footer-muted)] mt-4">We share verified listings and local market updates.</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-sm text-[var(--color-footer-muted)] text-center sm:text-left" style={{borderColor: 'var(--color-footer-muted)'}}>
          &copy; {new Date().getFullYear()} Julin Real Estate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
