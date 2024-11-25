import { describe, test, expect } from 'vitest';
import { renderHook, act } from "@testing-library/react";
import { useAsync } from "./use-async";

describe("useAsync", () => {
  test("handles successful async operations", async () => {
    const { result } = renderHook(() => useAsync<string>());

    await act(async () => {
      const promise = Promise.resolve("success");
      await result.current.run(promise);
    });

    expect(result.current.data).toBe("success");
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  test("handles errors", async () => {
    const { result } = renderHook(() => useAsync<string>());
    const error = new Error("test error");

    await act(async () => {
      const promise = Promise.reject(error);
      try {
        await result.current.run(promise);
      } catch (_) {
        // Expected error
      }
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(error);
    expect(result.current.isLoading).toBe(false);
  });
}); 