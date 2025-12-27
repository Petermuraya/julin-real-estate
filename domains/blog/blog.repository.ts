import { supabaseBrowser, supabaseServer } from "@/infrastructure/database/supabase.client";
import { BlogPost } from "./blog.model";
import { uploadImage } from "@/infrastructure/storage/cloudinary.client";

const client = typeof window === "undefined" && supabaseServer ? supabaseServer : supabaseBrowser;

export const blogRepository = {
  async getAll(): Promise<BlogPost[]> {
    const { data, error } = await client.from("blog").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as BlogPost[];
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await client.from("blog").select("*").eq("slug", slug).single();
    if (error) {
      if ((error as any).code === "PGRST116") return null;
      throw new Error(error.message);
    }
    return (data as BlogPost) ?? null;
  },

  async create(blog: BlogPost): Promise<BlogPost> {
    // handle cover image upload if provided as base64
    if (blog.coverImage && blog.coverImage.startsWith("data:")) {
      const url = await uploadImage(blog.coverImage, "blog");
      blog.coverImage = url;
    }

    const { data, error } = await client.from("blog").insert(blog).select().single();
    if (error) throw new Error(error.message);
    return data as BlogPost;
  },

  async update(id: string, blog: Partial<BlogPost>): Promise<BlogPost> {
    if (blog.coverImage && blog.coverImage.startsWith("data:")) {
      const url = await uploadImage(blog.coverImage, "blog");
      blog.coverImage = url;
    }

    const { data, error } = await client.from("blog").update(blog).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as BlogPost;
  },

  async delete(id: string): Promise<void> {
    const { error } = await client.from("blog").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
