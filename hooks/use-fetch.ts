import { useState } from "react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

function useFetch<T>(cb: (...args: any[]) => Promise<T>) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
}

export default useFetch;