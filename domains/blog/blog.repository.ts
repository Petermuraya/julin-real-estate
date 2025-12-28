import { supabase } from "@/infrastructure/database/supabase.client";
import { BlogPost } from "./blog.model";
import { uploadImage } from "@/infrastructure/storage/cloudinary.client";

// ----------------------------
// PUBLIC SERVICE (reads only)
// ----------------------------
export const publicBlogService = {
  async getAll(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as BlogPost[];
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) throw new Error(error.message);
    return data as BlogPost | null;
  },
};

// ----------------------------
// ADMIN SERVICE (CRUD)
// Uses the same public client — rely on RLS to enforce permissions by email/session
// ----------------------------
export const adminBlogService = {
  async getAll(): Promise<BlogPost[]> {
    const { data, error } = await supabase.from("blog").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as BlogPost[];
  },

  async create(blog: BlogPost): Promise<BlogPost> {
    if (blog.coverImage && blog.coverImage.startsWith("data:")) {
      const url = await uploadImage(blog.coverImage, "blog");
      blog.coverImage = url;
    }

    const { data, error } = await supabase.from("blog").insert(blog).select().single();
    if (error) throw new Error(error.message);
    return data as BlogPost;
  },

  async update(id: string, blog: Partial<BlogPost>): Promise<BlogPost> {
    if (blog.coverImage && blog.coverImage.startsWith("data:")) {
      const url = await uploadImage(blog.coverImage, "blog");
      blog.coverImage = url;
    }

    const { data, error } = await supabase.from("blog").update(blog).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as BlogPost;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("blog").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async togglePublish(id: string, published: boolean): Promise<BlogPost> {
    const { data, error } = await supabase.from("blog").update({ published }).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as BlogPost;
  },
};
