import { useEffect, useRef } from "react";

export function useEffectOnDefined(
    effect: () => void | (() => void),
    deps: unknown[]
) {
    const prevDeps = useRef<unknown[]>(deps.map(() => undefined));

    useEffect(() => {
        let hasDuplicate = false;
        let allDefined = true;

        for (let i = 0; i < deps.length; i++) {
            const prev = prevDeps.current[i];
            const curr = deps[i];

            if (prev === undefined && curr !== undefined) {
                hasDuplicate = true;
                break;
            }

            if (curr === undefined) {
                allDefined = false;
                break;
            }
        }

        prevDeps.current = deps;

        if (hasDuplicate && allDefined) {
            return effect();
        }
    }, deps);
}
