import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xivvulkxkjvghsxadtun.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdnZ1bGt4a2p2Z2hzeGFkdHVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDczNzM1NCwiZXhwIjoyMDg2MzEzMzU0fQ.tZZfHyqWF1yyTDvk_M25GbWzjyFudknNmMpfK8rdPYI"
);

async function main() {
  // Test Message table access
  const { data, error } = await supabase.from("Message").select("id").limit(1);
  console.log("Message table access:", error ? `Error: ${error.message}` : `OK (${data?.length} rows)`);

  // Test realtime subscription
  console.log("\nTesting realtime subscription...");
  const channel = supabase
    .channel("test-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "Message" }, (payload) => {
      console.log("Realtime event:", payload.eventType);
    })
    .subscribe((status) => {
      console.log("Subscription status:", status);
      if (status === "SUBSCRIBED") {
        console.log("Realtime is working for Message table!");
        setTimeout(() => {
          supabase.removeChannel(channel);
          process.exit(0);
        }, 2000);
      }
    });
}

main();
