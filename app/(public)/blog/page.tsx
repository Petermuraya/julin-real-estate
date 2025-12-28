import Link from "next/link";
import { publicBlogService } from "@/domains/blog/blog.repository";

export const revalidate = 60; // cache for 60s

export default async function Page() {
	try {
		const posts = await publicBlogService.getAll();

		return (
			<main className="max-w-4xl mx-auto py-12 px-4">
				<h1 className="text-3xl font-bold mb-6">Blog</h1>
				<div className="space-y-6">
					{posts.length === 0 && <p>No posts yet.</p>}
					{posts.map((p) => (
						<article key={p.id} className="border rounded-lg p-4 hover:shadow">
							{p.coverImage && (
								// eslint-disable-next-line @next/next/no-img-element
								<img src={p.coverImage} alt={p.title} className="w-full h-48 object-cover rounded-md mb-3" />
							)}
							<h2 className="text-2xl font-semibold">
								<Link href={`/blog/${p.slug}`}>{p.title}</Link>
							</h2>
							<p className="text-sm text-muted-foreground mt-1">
								{p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}
							</p>
							{p.content && <p className="mt-3 text-sm line-clamp-3">{stripHtml(p.content)}</p>}
							<p className="mt-3">
								<Link href={`/blog/${p.slug}`} className="text-primary">Read more →</Link>
							</p>
						</article>
					))}
				</div>
			</main>
		);
	} catch (err: any) {
		console.error("Error loading blog posts:", err);
		const showDetail = process.env.NODE_ENV !== "production";
		return (
			<main className="max-w-4xl mx-auto py-12 px-4">
				<h1 className="text-3xl font-bold mb-6">Blog</h1>
				<div className="rounded-md border p-6 bg-yellow-50">
					<h2 className="text-xl font-semibold mb-2">Unable to load blog posts</h2>
					<p className="text-sm">The blog backend appears to be misconfigured. Please check the server environment variables.</p>
					{showDetail && err?.message && (
						<pre className="mt-3 text-sm text-red-700">{err.message}</pre>
					)}
				</div>
			</main>
		);
	}
}

function stripHtml(input?: string) {
	if (!input) return "";
	return input.replace(/<[^>]*>?/gm, "").slice(0, 300) + (input.length > 300 ? "…" : "");
}
