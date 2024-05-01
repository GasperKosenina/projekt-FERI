"use server";
import { Dataset } from "./definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

const DatasetSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  url: z
    .string()
    .url({ message: "URL must be valid" })
    .max(255, { message: "URL must be less than 255 characters" }),
  accessToken: z
    .string()
    .min(3, { message: "Access Token must be at least 3 characters" })
    .max(50, { message: "Access Token must be less than 50 characters" }),
  price: z
    .number({ message: "Price must be a number" })
    .gt(0, { message: "Price must be greater than 0" })
    .max(1000, { message: "Price must be less than 1001" }),
  description: z
    .instanceof(File)
    .refine((file) => file.type === "application/json", {
      message: "Schema must be a JSON file",
    })
    .refine((file) => file.size < 1024 * 1024, {
      message: "Schema must be less than 1MB",
    }),
  category: z.string().nonempty({ message: "Please select a category" }),
  duration: z
    .number({ message: "Duration must be a number" })
    .gt(0, { message: "Duration must be greater than 0" })
    .max(1440, { message: "Duration must be less than 1441" }),
  userID: z.string(),
});

export type State = {
  errors?: {
    name?: string[];
    url?: string[];
    accessToken?: string[];
    price?: string[];
    description?: string[];
    category?: string[];
    duration?: string[];
  };
  message?: string | null;
};

export async function postDataset(prevState: State, formData: FormData) {
  const userID = "slkdasd98";

  if (!userID) {
    console.log("Error getting user ID");
    return {
      message: "Internal Server Error. Failed to create dataset",
    };
  }

  const validatedData = DatasetSchema.safeParse({
    name: formData.get("name") as string,
    url: formData.get("url") as string,
    accessToken: formData.get("accessToken") as string,
    price: parseFloat(formData.get("price") as string),
    description: formData.get("schema") as File,
    category: formData.get("category") as string,
    duration: parseInt(formData.get("duration") as string),
    userID: userID,
  });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "",
    };
  }

  const content = await validatedData.data.description.text();
  validatedData.data.description = JSON.parse(content);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dataset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData.data),
  });
  if (response.status !== 201) {
    return {
      message: "Internal Server Error. Failed to create dataset",
    };
  }

  revalidatePath("/dashboard/datasets");
  redirect("/dashboard/datasets");
}

export async function listAll() {
  noStore();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dataset`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const datasets = await response.json();
    return datasets;
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return [];
  }
}
