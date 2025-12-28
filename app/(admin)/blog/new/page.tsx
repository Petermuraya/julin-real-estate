"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  published?: boolean;
}
import ReactMarkdown from "react-markdown";

export default function BlogForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [published, setPublished] = useState(false);

  // Load existing blog if editing
  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const res = await fetch("/api/blog?admin=1");
        const data: BlogPost[] = await res.json();
        const blog = data.find((b) => b.id === editId);
        if (!blog) return;
        setTitle(blog.title);
        setSlug(blog.slug);
        setContent(blog.content);
        setCoverUrl(blog.coverImage || "");
        setPublished(blog.published || false);
      } catch (err) {
        console.error("Failed to load blog for edit", err);
      }
    })();
  }, [editId]);

  const handleUpload = async () => {
    if (!coverFile) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: reader.result, folder: "blog" }),
        });
        const json = await res.json();
        if (res.ok) setCoverUrl(json.url);
        else throw new Error(json.error || "Upload failed");
      } catch (err) {
        console.error("Upload error", err);
        alert("Upload failed");
      }
    };
    reader.readAsDataURL(coverFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const blog: BlogPost = { title, slug, content, coverImage: coverUrl, published };
    try {
      if (editId) {
        const res = await fetch("/api/blog", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...blog }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Failed");
      } else {
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blog),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Failed");
      }
      router.push("/admin/blog");
    } catch (err) {
      console.error("Failed to save blog", err);
      alert("Failed to save blog");
    }
  };

  return (
    <div className="flex gap-8 p-6">
      {/* Editor */}
      <div className="flex-1 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded w-full h-[400px]"
          placeholder="Write your blog in Markdown..."
        />
        <input type="file" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
        <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload Cover
        </button>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
          {editId ? "Update Blog" : "Create Blog"}
        </button>
      </div>

      {/* Live Preview */}
      <div className="flex-1 border p-4 rounded h-[600px] overflow-auto">
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="Cover" className="mb-4 rounded" />
        )}
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
