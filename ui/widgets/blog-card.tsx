import Link from "next/link";

type Blog = {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  excerpt?: string;
  created_at?: string;
};

export default function BlogCard({ post }: { post: Blog }) {
  return (
    <article className="card overflow-hidden rounded-lg">
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage} alt={post.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)]">No image</div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate">{post.title}</h3>
        <p className="text-sm text-[var(--color-muted)] mb-3">{post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</p>
        {post.excerpt && <p className="text-sm text-[var(--color-text)] line-clamp-3 mb-3">{post.excerpt}</p>}
        <Link href={`/blog/${post.slug}`} className="text-[var(--color-primary)] text-sm font-medium hover:underline">Read more →</Link>
      </div>
    </article>
  );
}
