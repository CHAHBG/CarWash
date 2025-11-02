import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
    fn: (params: P) => Promise<T>;
    params?: P;
    skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (newParams?: P) => Promise<void>;
}

const useAppwrite = <T, P extends Record<string, string | number>>({
                                                                       fn,
                                                                       params = {} as P,
                                                                       skip = false,
                                                                   }: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState<string | null>(null);
    const paramsRef = useRef<P>(params);

    useEffect(() => {
        paramsRef.current = params;
    }, [params]);

    const fetchData = useCallback(
        async (fetchParams?: P) => {
            setLoading(true);
            setError(null);

            try {
                const effectiveParams = (fetchParams ?? paramsRef.current) as P;
                const result = await fn({ ...effectiveParams });
                setData(result);
            } catch (err: unknown) {
                const errorMessage =
                    err instanceof Error ? err.message : "An unknown error occurred";
                setError(errorMessage);
                Alert.alert("Error", errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [fn]
    );

    useEffect(() => {
        if (!skip) {
            fetchData(paramsRef.current);
        }
    }, [fetchData, skip]);

    const refetch = useCallback(
        async (newParams?: P) => {
            if (newParams) {
                paramsRef.current = newParams;
            }
            await fetchData(newParams);
        },
        [fetchData]
    );

    return { data, loading, error, refetch };
};

export default useAppwrite;
