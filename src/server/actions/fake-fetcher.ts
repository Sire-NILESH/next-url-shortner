"use server";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const fakeDataFetcher = async <T>(
  data: T,
  delay: number = 1000
): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data });
    }, delay);
  });
};
