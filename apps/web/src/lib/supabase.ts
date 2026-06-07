import { createClient } from "@supabase/supabase-js";

/* ─────────────────────────────────────────────────────
   Supabase Client
   
   Set these environment variables in .env.local:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
───────────────────────────────────────────────────── */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ─── Auth Helpers ─── */

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
  if (error) throw error;

  // Insert into profiles table
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: fullName,
      email,
      created_at: new Date().toISOString(),
    });
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWithOtp(email: string, userData?: any) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: userData,
    },
  });
  if (error) throw error;
  return data;
}

export async function verifyOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/* ─── Ideas CRUD ─── */

export interface IdeaRecord {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  help_needed: string;
  created_at?: string;
}

export async function saveIdea(idea: Omit<IdeaRecord, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("ideas")
    .insert(idea)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUserIdeas(userId: string) {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

/* ─── Reviews CRUD ─── */

export interface ReviewRecord {
  id?: string;
  idea_id: string;
  user_id: string;
  overall_score: number;
  dimensions: Record<string, { score: number; reasoning: string }>;
  good_reasons: string[];
  bad_reasons: string[];
  recommendations: string[];
  verdict: string;
  created_at?: string;
}

export async function saveReview(review: Omit<ReviewRecord, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("reviews")
    .insert(review)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUserReviews(userId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, ideas(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getReviewByIdeaId(ideaId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("idea_id", ideaId)
    .single();
  if (error) throw error;
  return data;
}

/* ─── Check if Supabase is configured ─── */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}
