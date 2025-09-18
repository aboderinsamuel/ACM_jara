import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@shared/env";

// Guard for SSR/non-browser contexts
const isBrowser = typeof window !== "undefined" && !!window.localStorage;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		storage: isBrowser ? window.localStorage : undefined,
	},
});

export type { Session, User } from "@supabase/supabase-js";
