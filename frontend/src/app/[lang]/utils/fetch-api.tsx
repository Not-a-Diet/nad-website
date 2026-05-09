import qs from "qs";
import { getStrapiURL } from "./api-helpers";

function normalizePopulate(populate: unknown): unknown {
  if (Array.isArray(populate)) {
    const result: Record<string, unknown> = {};
    for (const item of populate) {
      if (typeof item === "string" && item.includes(".")) {
        const parts = item.split(".");
        let current = result;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (i === parts.length - 1) {
            current[part] = true;
          } else {
            if (!current[part] || typeof current[part] !== "object") {
              current[part] = { populate: {} };
            }
            current = (current[part] as Record<string, unknown>).populate as Record<string, unknown>;
          }
        }
      } else if (typeof item === "string") {
        result[item] = true;
      } else {
        throw new TypeError(`populate array entries must be strings, got: ${typeof item} ${item}`);
      }
    }
    return result;
  }
  return populate;
}

function normalizeParams(params: Record<string, unknown>): Record<string, unknown> {
  if (params.populate) {
    return { ...params, populate: normalizePopulate(params.populate) };
  }
  return params;
}

export async function fetchAPI(
  path: string,
  urlParamsObject: Record<string, unknown> = {},
  options: Record<string, unknown> = {}
) {
  try {
    const mergedOptions: Record<string, unknown> = {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    const normalizedParams = normalizeParams(urlParamsObject);
    const queryString = qs.stringify(normalizedParams);
    const requestUrl = `${getStrapiURL(
      `/api${path}${queryString ? `?${queryString}` : ""}`
    )}`;

    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();

    if (data?.error) {
      throw new Error(`Strapi API error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    return data;

  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Strapi API error')) {
      throw error;
    }
    console.error(error);
    throw new Error(
      `Please check if your server is running and you set all the required tokens.`
    );
  }
}