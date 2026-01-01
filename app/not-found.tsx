import Image from "next/image";
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl text-center">
        <Image src="/assets/ui/404 error.png" alt="Page not found" width={600} height={300} className="mx-auto" />
        <h1 className="text-3xl font-bold mt-6">404 — Page not found</h1>
        <p className="text-[var(--color-muted)] mt-2">Sorry, we couldn’t find the page you’re looking for.</p>
      </div>
    </div>
  );
}
