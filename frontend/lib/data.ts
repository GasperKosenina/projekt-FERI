"use server";
import { Dataset } from "./definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

const DatasetSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  url: z.string().url("URL must be a valid URL"),
  accessToken: z.string().min(3, "Access token must be at least 3 characters"),
  price: z.number().gt(0, "Price must be greater than 0"),
  description: z.any(),
  duration: z.number().gt(0, "Duration must be greater than 0"),
});

export type State = {
  errors?: {
    name?: string[];
    url?: string[];
    accessToken?: string[];
    price?: string[];
    duration?: string[];
  };
  message?: string | null;
};

export async function postDataset(formData: FormData) {
  const userID = "slkdasd98";

  if (!userID) {
    console.log("Error getting user ID");
    return {
      message: "Error getting user ID",
    };
  }

  const validatedData = DatasetSchema.safeParse({
    name: formData.get("name") as string,
    url: formData.get("url") as string,
    accessToken: formData.get("accessToken") as string,
    price: parseFloat(formData.get("price") as string),
    description: formData.get("schema") as File,
    duration: parseInt(formData.get("duration") as string),
    userID: userID,
  });

  if (!validatedData.success) {
    console.log("Missing Fields. Failed to create dataset");
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create dataset",
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
    console.log("Error creating dataset");
    return {
      message: "Error creating dataset",
    };
  }
  
  revalidatePath('/dashboard/datasets');
  redirect('/dashboard/datasets');
}

export async function listAll() {
  noStore();

  try {
    const response = await fetch("http://localhost:8000/dataset", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch datasets: ${response.status}`);
    }

    const datasets = await response.json();
    return datasets;
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return { message: "Failed to retrieve datasets" };
  }
}
