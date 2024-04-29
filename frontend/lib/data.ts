'use server'



import { revalidatePath } from "next/cache";
import { Dataset } from "./definitions";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from 'next/cache';

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
  
  revalidatePath('/dashboard/datasets');
  redirect('/dashboard/datasets');
}


export async function listAll() {
  noStore();


  try {
    const response = await fetch('http://localhost:8000/dataset', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch datasets: ${response.status}`);
    }

    const datasets = await response.json();
    return datasets;

  } catch (error) {
    console.error('Error fetching datasets:', error);
    return { message: 'Failed to retrieve datasets' };
  }
}

