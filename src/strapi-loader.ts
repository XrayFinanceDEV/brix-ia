import { z } from "astro:content";
import type { Loader } from "astro/loaders";
import type { ZodTypeAny, ZodObject } from "zod";

// Configuration constants
const STRAPI_BASE_URL =
  import.meta.env.STRAPI_BASE_URL || "https://api.brix-ia.com"; // Usa HTTPS
const SYNC_INTERVAL = 60 * 1000; // 1 minute in milliseconds

/**
 * Creates a Strapi content loader for Astro
 * @param contentType The Strapi content type to load
 * @returns An Astro loader for the specified content type
 */
export function strapiLoader({ contentType }: { contentType: string }): Loader {
  return {
    name: "strapi-posts",

    load: async function (this: Loader, { store, meta, logger }) {
      const lastSynced = meta.get("lastSynced");

      // Avoid frequent syncs
      if (lastSynced && Date.now() - Number(lastSynced) < SYNC_INTERVAL) {
        logger.info("Skipping Strapi sync");
        return;
      }

      logger.info("Fetching posts from Strapi");

      try {
        // Fetch all pages of content
        const allPosts = await fetchAllFromStrapi(`/api/${contentType}s`);

        if (!allPosts || !Array.isArray(allPosts)) {
          throw new Error("Invalid data received from Strapi");
        }

        // Get the schema
        const schemaOrFn = this.schema;
        if (!schemaOrFn) {
          throw new Error("Schema is not defined");
        }
        const schema =
          typeof schemaOrFn === "function" ? await schemaOrFn() : schemaOrFn;
        if (!(schema instanceof z.ZodType)) {
          throw new Error("Invalid schema: expected a Zod schema");
        }

        type Post = z.infer<typeof schema>;

        store.clear();
        allPosts.forEach((post: Post) => {
          console.log("Post sincronizzato:", post.slug); // Debug
          store.set({ id: post.id, data: post });
        });

        meta.set("lastSynced", String(Date.now()));
      } catch (error) {
        logger.error(
          `Error loading Strapi content: ${(error as Error).message}`
        );
        throw error;
      }
    },

    schema: async () => {
      const data = await fetchFromStrapi(
        `/get-strapi-schema/schema/${contentType}`
      );
      if (!data?.attributes) {
        throw new Error("Invalid schema data received from Strapi");
      }
      return generateZodSchema(data.attributes);
    },
  };
}

/**
 * Fetches all data from Strapi, handling pagination
 * @param path The API endpoint path
 * @param params Optional query parameters
 * @returns All items from the API across all pages
 */
async function fetchAllFromStrapi(
  path: string,
  params: Record<string, string> = { populate: "*" }
): Promise<any[]> {
  const url = new URL(path, STRAPI_BASE_URL);
  let allData: any[] = [];
  let page = 1;
  const pageSize = 25; // Strapi default

  while (true) {
    const pageParams = {
      ...params,
      "pagination[page]": page.toString(),
      "pagination[pageSize]": pageSize.toString(),
    };

    Object.entries(pageParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    try {
      const response = await fetch(url.href);
      if (!response.ok) {
        throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
      }
      const { data, meta } = await response.json();
      
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid data received from Strapi");
      }

      allData = [...allData, ...data];

      // Check if there are more pages
      const { pageCount } = meta.pagination;
      if (page >= pageCount) {
        break;
      }
      page++;
    } catch (error) {
      console.error(`Error fetching from Strapi: ${(error as Error).message}`);
      throw error;
    }
  }

  return allData;
}

/**
 * Fetches a single page of data from the Strapi API
 * @param path The API endpoint path
 * @param params Optional query parameters
 * @returns The JSON response from the API
 */
async function fetchFromStrapi(
  path: string,
  params?: Record<string, string>
): Promise<any> {
  const url = new URL(path, STRAPI_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  try {
    const response = await fetch(url.href);
    if (!response.ok) {
      throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching from Strapi: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Maps Strapi field types to Zod schema types
 * @param type The Strapi field type
 * @param field The field configuration object
 * @returns A Zod schema corresponding to the Strapi field type
 */
function mapTypeToZodSchema(type: string, field: any): ZodTypeAny {
  const schemaMap: Record<string, () => ZodTypeAny> = {
    string: () => z.string(),
    uid: () => z.string(),
    media: () =>
      z.object({
        allowedTypes: z.array(z.enum(field.allowedTypes)),
        type: z.literal("media"),
        multiple: z.boolean(),
        url: z.string(),
        alternativeText: z.string().optional(),
        caption: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      }),
    richtext: () => z.string(),
    datetime: () => z.string().datetime(),
    relation: () =>
      z
        .object({
          relation: z.literal(field.relation),
          target: z.literal(field.target),
          configurable: z.boolean().optional(),
          writable: z.boolean().optional(),
          visible: z.boolean().optional(),
          useJoinTable: z.boolean().optional(),
          private: z.boolean().optional(),
        })
        .optional(),
    boolean: () => z.boolean(),
    number: () => z.number(),
    array: () => z.array(mapTypeToZodSchema(field.items.type, field.items)),
    object: () => {
      const shape: Record<string, ZodTypeAny> = {};
      for (const [key, value] of Object.entries(field.properties)) {
        if (typeof value === "object" && value !== null && "type" in value) {
          shape[key] = mapTypeToZodSchema(value.type as string, value);
        } else {
          throw new Error(`Invalid field value for key: ${key}`);
        }
      }
      return z.object(shape);
    },
    text: () => z.string(),
    dynamiczone: () => z.array(z.object({ __component: z.string() })),
  };

  return (schemaMap[type] || (() => z.any()))();
}

/**
 * Generates a Zod schema from Strapi content type attributes
 * @param attributes The Strapi content type attributes
 * @returns A Zod object schema representing the content type
 */
function generateZodSchema(attributes: Record<string, any>): ZodObject<any> {
  const shape: Record<string, ZodTypeAny> = {};
  for (const [key, value] of Object.entries(attributes)) {
    const { type, ...rest } = value;
    shape[key] = mapTypeToZodSchema(type, rest);
  }
  return z.object(shape);
}

// Ensure the required environment variable is set
function checkEnvironmentVariables() {
  if (!STRAPI_BASE_URL) {
    throw new Error("STRAPI_BASE_URL environment variable is not set");
  }
}

// Ensure environment variables are set before proceeding
checkEnvironmentVariables();