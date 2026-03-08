import {
  buildActionRequest,
  type ActionRequestDescriptor,
  type BuildActionRequestArgs,
} from "specloom";
import { createSignal, type Accessor } from "solid-js";

export interface ActionRunner<TResult = unknown> {
  isRunning: Accessor<boolean>;
  error: Accessor<unknown>;
  run(args: BuildActionRequestArgs): Promise<TResult>;
  reset(): void;
}

export function createActionRunner<TResult = unknown>(
  execute: (request: ActionRequestDescriptor) => Promise<TResult>,
): ActionRunner<TResult> {
  const [isRunning, setIsRunning] = createSignal(false);
  const [error, setError] = createSignal<unknown>();

  return {
    isRunning,
    error,
    async run(args) {
      setIsRunning(true);
      setError(undefined);

      try {
        const request = buildActionRequest(args);
        return await execute(request);
      } catch (nextError) {
        setError(nextError);
        throw nextError;
      } finally {
        setIsRunning(false);
      }
    },
    reset() {
      setError(undefined);
    },
  };
}
