import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionLabel } from "@/components/site/PageShell";
import { CardSkeleton } from "@/components/site/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { slugify, profileStrength } from "@/lib/profile-strength";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Edit your freelancer profile — Loom" },
      { name: "description", content: "Update your headline, skills, pricing and availability." },
      { property: "og:title", content: "Edit your freelancer profile — Loom" },
      { property: "og:description", content: "Update your headline, skills, pricing and availability." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfileEditor;
});

function ProfileEditor() {
  return null;
}
