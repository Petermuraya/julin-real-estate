"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { uploadImage } from "@/infrastructure/storage/cloudinary.client";
import ReactMarkdown from "react-markdown";

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState("");

  // Handle cover image upload
  const handleUpload = async () => {
    if (!coverFile) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const url = await uploadImage(reader.result as string, "blog");
      setCoverUrl(url);
    };
    reader.readAsDataURL(coverFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content, coverImage: coverUrl, published: true }),
    });

    if (res.ok) router.push("/admin/blog");
    else alert("Error creating blog");
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
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
          Create Blog
        </button>
      </div>

      {/* Live Preview */}
      <div className="flex-1 border p-4 rounded h-[600px] overflow-auto">
        {coverUrl && <img src={coverUrl} alt="Cover" className="mb-4 rounded" />}
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
