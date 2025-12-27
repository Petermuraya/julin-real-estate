export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string; // rich-text HTML or Markdown
  coverImage?: string; // Cloudinary URL
  created_at?: string;
  updated_at?: string;
  published?: boolean;
}
