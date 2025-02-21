import { getCollection } from "astro:content";

export async function GET({ url }) {
  const page = Number(url.searchParams.get("page")) || 1;
  const postsPerPage = 6;
  const allPosts = await getCollection("strapiPostsLoader");

  // Sorting posts by date
  allPosts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  // Calculating the total number of pages
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  // We give you the right piece
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const posts = allPosts.slice(start, end);

  return new Response(JSON.stringify({ posts, totalPages }), {
    headers: { "Content-Type": "application/json" },
  });
}
