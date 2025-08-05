import { type ActionFunctionArgs } from "@remix-run/router";
import { syncMultipleRounds } from "~/lib/syncCartolaToFirestore";

export async function action({ request }: ActionFunctionArgs) {
  await syncMultipleRounds(18, 21);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
