"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BlogPost = {
	id: string;
	title: string;
	slug: string;
	excerpt?: string;
	coverImage?: string;
	published?: boolean;
	created_at?: string;
};

export default function AdminBlogPage() {
	const router = useRouter();
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function fetchPosts() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/blog?admin=1");
			if (!res.ok) throw new Error("Failed to load posts");
			const data = await res.json();
			setPosts(Array.isArray(data) ? data : []);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchPosts();
	}, []);

	async function handleDelete(id: string) {
		if (!confirm("Delete this post permanently? This cannot be undone.")) return;
		try {
			const res = await fetch(`/api/blog?id=${encodeURIComponent(id)}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Delete failed");
			setPosts((p) => p.filter((x) => x.id !== id));
			alert("Post deleted");
		} catch (err: unknown) {
			alert(err instanceof Error ? err.message : "Unknown error");
		}
	}

	async function togglePublish(id: string, current: boolean | undefined) {
		try {
			const next = !current;
			// Use PUT to update published flag (matches admin blog form update)
			const res = await fetch("/api/blog", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, published: next }),
			});
			if (!res.ok) throw new Error("Update failed");
			setPosts((list) => list.map((p) => (p.id === id ? { ...p, published: next } : p)));
		} catch (err: unknown) {
			alert(err instanceof Error ? err.message : "Unknown error");
		}
	}

	return (
		<div className="p-6">
			<header className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-semibold">Blog</h1>
					<p className="text-sm text-[var(--color-muted)]">Manage blog posts, drafts and SEO</p>
				</div>

				<div className="flex items-center gap-2">
					<Link href="/(admin)/admin/blog/new" className="btn btn-primary">New Post</Link>
				</div>
			</header>

			{loading && <div className="text-sm text-[var(--color-muted)]">Loading posts…</div>}
			{error && <div className="text-sm text-[var(--color-error)]">{error}</div>}

			{!loading && posts.length === 0 && (
				<div className="card p-4">No posts found. Create a new post to get started.</div>
			)}

			{!loading && posts.length > 0 && (
				<div className="space-y-3">
					{posts.map((post) => (
						<div key={post.id} className="card p-4 flex items-center justify-between">
							<div className="flex gap-4 items-center">
								{post.coverImage ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img src={post.coverImage} alt={post.title} className="w-20 h-12 object-cover rounded" />
								) : (
									<div className="w-20 h-12 bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)] rounded">No image</div>
								)}

								<div>
									<div className="font-semibold">{post.title}</div>
									<div className="text-sm text-[var(--color-muted)]">{post.slug} • {post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}</div>
									{post.excerpt && <div className="text-sm mt-1 line-clamp-2">{post.excerpt}</div>}
								</div>
							</div>

							<div className="flex items-center gap-2">
								<button
									className="px-3 py-1 rounded border hover:bg-[var(--color-primary)] hover:text-white transition text-sm"
									onClick={() => router.push(`/(admin)/admin/blog/new?id=${encodeURIComponent(post.id)}`)}
								>
									Edit
								</button>

								<button
									className="px-3 py-1 rounded border text-sm"
									onClick={() => togglePublish(post.id, post.published)}
								>
									{post.published ? 'Unpublish' : 'Publish'}
								</button>

								<button
									className="px-3 py-1 rounded bg-[var(--color-error)] text-white text-sm"
									onClick={() => handleDelete(post.id)}
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

