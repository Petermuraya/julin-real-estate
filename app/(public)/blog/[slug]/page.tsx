import { notFound } from "next/navigation";
import { publicBlogService } from "@/domains/blog/blog.repository";

export const revalidate = 60;

export default async function Page({ params }: { params: { slug: string } }) {
	try {
		const post = await publicBlogService.getBySlug(params.slug);
		if (!post) return notFound();

		return (
			<main className="max-w-3xl mx-auto py-12 px-4">
				<article>
					<h1 className="text-3xl font-bold mb-4">{post.title}</h1>
					<p className="text-sm text-muted-foreground mb-4">{post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</p>
					{post.coverImage && (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-md mb-6" />
					)}

					<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
				</article>
			</main>
		);
	} catch (err: any) {
		console.error("Error loading blog post:", err);
		const showDetail = process.env.NODE_ENV !== "production";
		return (
			<main className="max-w-3xl mx-auto py-12 px-4">
				<div className="rounded-md border p-6 bg-yellow-50">
					<h2 className="text-xl font-semibold mb-2">Unable to load blog post</h2>
					<p className="text-sm">The blog backend appears to be misconfigured. Please check the server environment variables.</p>
					{showDetail && err?.message && (
						<pre className="mt-3 text-sm text-red-700">{err.message}</pre>
					)}
				</div>
			</main>
		);
	}
}
