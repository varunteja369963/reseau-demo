import { useEffect, useState } from "react";
import {
  initClient,
  getClient,
  ConversationsClientType,
} from "@/integrations/twilio/client";

interface UseConversationClientResult {
  client: ConversationsClientType | null;
  loading: boolean;
  error: string | null;
}

export function useConversationClient(identity?: string): UseConversationClientResult {
  const [client, setClient] = useState<ConversationsClientType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function setup() {
      setLoading(true);
      setError(null);
      try {
        await initClient(identity);
        if (!mounted) return;
        const c = getClient();
        setClient(c);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? String(e));
        setClient(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    setup();

    return () => {
      mounted = false;
    };
  }, [identity]);

  return { client, loading, error };
}

export default useConversationClient;
