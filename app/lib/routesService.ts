// lib/routesService.ts
import { supabase } from "./supabase";

export type Route = {
  id: string;
  from: string;
  to: string;
  description: string;
  upvotes: number;
  downvotes: number;
  user_id: string;
  user_name: string;
};

// Fetch routes matching start/end
export async function fetchRoutes(from: string, to: string): Promise<Route[]> {
  const { data, error } = await supabase
    .from("routes")
    .select(`
      id,
      description,
      upvotes,
      downvotes,
      added_by,
      users(name),
      from_place(name),
      to_place(name)
    `)
    .eq("from_place.name", from)
    .eq("to_place.name", to)
    .not("from_place", "is", null)
    .not("to_place", "is", null)
    .order("upvotes", { ascending: false });

  if (error) throw error;

  if (!data) return [];

  return data
    .filter((r: any) => r.from_place && r.to_place) // remove invalid routes
    .map((r: any) => ({
      id: r.id,
      from: r.from_place.name,
      to: r.to_place.name,
      description: r.description,
      upvotes: r.upvotes ?? 0,
      downvotes: r.downvotes ?? 0,
      user_id: r.added_by,
      user_name: r.users?.name ?? "Unknown user",
    }));
}

// Check if user already voted
export async function getUserVote(route_id: string, user_id: string) {
  if (!user_id) return null;

  const { data, error } = await supabase
    .from("route_votes")
    .select("vote")
    .eq("route_id", route_id)
    .eq("user_id", user_id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.log("Get vote error:", error);
  }

  return data?.vote ?? null; // null = no vote
}

// Submit a vote
export async function submitVote(route_id: string, user_id: string, vote: 1 | -1) {
  if (!user_id) return { error: "Invalid user ID" };

  const existing = await getUserVote(route_id, user_id);

  if (existing === vote) return { error: "Already voted" };

  if (existing === null) {
    await supabase.from("route_votes").insert({ route_id, user_id, vote });
  } else {
    await supabase
      .from("route_votes")
      .update({ vote })
      .eq("route_id", route_id)
      .eq("user_id", user_id);
  }

  const upIncrement = vote === 1 ? 1 : existing === 1 ? -1 : 0;
  const downIncrement = vote === -1 ? 1 : existing === -1 ? -1 : 0;

  await supabase.rpc("update_route_votes", {
    routeid: route_id,
    upchange: upIncrement,
    downchange: downIncrement,
  });

  return { success: true };
}