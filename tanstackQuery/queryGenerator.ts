import {useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions} from '@tanstack/react-query';

const useCustomQuery = <T>(
    queryKeys: Array<string|object>,
    queryFn: () => Promise<T>,
    options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<T>({
        queryKey: queryKeys,
        queryFn,
        retry: false,
        ...options,
    });
};

const useCustomMutation = <T, V = undefined|any> (
    mutationFn: (variables: V) => Promise<T>,
    invalidatedQueryKeys: string[][] = [],
    options?: Omit<UseMutationOptions<T, unknown, V>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        retry: false,
        ...options,
        onSuccess: (data, variables, context) => {
            // Fonction pour invalider toutes les requêtes
            const invalidateAllQueries = (keys: string[][]) => {
                keys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
            };

            if (options?.onSuccess) {
                options.onSuccess(data, variables, context);
            }
            invalidateAllQueries(invalidatedQueryKeys);
        },

    });
};



export { useCustomQuery, useCustomMutation }