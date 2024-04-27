"use server";
import { revalidatePath } from "next/cache";
import { Dataset } from "./definitions";
import { redirect } from "next/navigation";

export async function postDataset(formData: FormData) {
  const file = formData.get("schema") as File;
  const content = await file.text();

  const dataset: Dataset = {
    name: formData.get("name") as string,
    url: formData.get("url") as string,
    accessToken: formData.get("accessToken") as string,
    price: parseFloat(formData.get("price") as string),
    description: JSON.parse(content),
    duration: parseInt(formData.get("duration") as string),
    userID: "1",
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dataset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataset),
  });
  if (response.status !== 201) {
    console.log("Error creating dataset");
    return {
      message: "Error creating dataset",
    };
  }
}
