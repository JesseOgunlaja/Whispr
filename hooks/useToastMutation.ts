import { promiseToast } from "@/lib/lib";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useToastMutation<
    TVariables = void,
    TData extends { message: string } = { message: string },
    TContext = unknown
>(
    mutateOptions: UseMutationOptions<TData, unknown, TVariables, TContext>,
    loadingMessage?: string
) {
    const mutation = useMutation<TData, unknown, TVariables, TContext>(
        mutateOptions
    );

    return {
        ...mutation,
        mutate: (
            ...args: TVariables extends void ? [] : [variables: TVariables]
        ) => {
            promiseToast(
                mutation.mutateAsync(args[0] as TVariables),
                loadingMessage
            );
        },
    };
}
