export interface BusinessIdea {
  id: number;                    // SERIAL PRIMARY KEY maps to number
  title: string;                 // VARCHAR(500) maps to string
  description: string;           // TEXT maps to string
  category: string;              // VARCHAR(500) maps to string
  upvotes: number | null;        // INTEGER (nullable)
  subreddit_name: string | null; // VARCHAR(100) (nullable)
  subreddit_subscribers: number | null; // INTEGER (nullable)
  post_date: string | null;      // TIMESTAMP maps to string in ISO format
  url: string | null;            // VARCHAR(500) (nullable)
  original_post: string | null;  // TEXT (nullable)
  created_at: string;           // TIMESTAMP maps to string in ISO format
  updated_at: string;           // TIMESTAMP maps to string in ISO format
}