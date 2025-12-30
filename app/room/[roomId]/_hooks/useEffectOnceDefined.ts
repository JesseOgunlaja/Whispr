import { useEffect, useRef } from "react";

export function useEffectOnceDefined(
    effect: () => void | (() => void),
    deps: unknown[]
) {
    const prevDeps = useRef<unknown[]>(deps.map(() => undefined));

    useEffect(() => {
        const hasNewlyDefined = deps.some(
            (curr, i) => prevDeps.current[i] === undefined && curr !== undefined
        );
        const allDefined = deps.every((dep) => dep !== undefined);

        prevDeps.current = deps;

        if (hasNewlyDefined && allDefined) {
            return effect();
        }
    }, deps);
}
