"use server";
import { Dataset } from "./definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { any, z } from "zod";
import { auth } from "@clerk/nextjs/server";

const PriceItemSchema = z.object({
  purpose: z.string(),
  price: z.number().min(0, { message: "Price must be greater or equal to 0" }),
});

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
    .array(PriceItemSchema)
    .min(1, { message: "At least one price item must be provided" }),
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
    description?: string[];
    category?: string[];
    duration?: string[];
    price?: string[];
  };
  message?: string | null;
};

export async function postDataset(prevState: State, formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    console.log("Error getting user ID");
    return {
      message: "Internal Server Error. Failed to create dataset",
    };
  }

  const validatedData = DatasetSchema.safeParse({
    name: formData.get("name") as string,
    url: formData.get("url") as string,
    accessToken: formData.get("accessToken") as string,
    description: formData.get("schema") as File,
    category: formData.get("category") as string,
    duration: parseInt(formData.get("duration") as string),
    userID: userId,
    price: JSON.parse(formData.get("purposeAndPrice") as string),
  });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "",
    };
  }

  const content = await validatedData.data.description.text();
  validatedData.data.description = JSON.parse(content);
  try {
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
  } catch (error) {
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

export async function findById(id: string) {
  noStore();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dataset/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const dataset = await response.json();
    return dataset;
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return [];
  }
}

export async function generate(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
}

export async function postUser(formData: FormData) {
  let userType = "";
  const entries = formData.entries();
  let entry = entries.next();
  while (!entry.done) {
    const [key, value] = entry.value;
    if (value) {
      userType = key;
      break;
    }
    entry = entries.next();
  }

  if (!userType) {
    console.error("No user type found");
    return;
  }

  const { userId } = auth();
  if (!userId) {
    console.error("No user ID found");
    return;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        userType: userType,
      }),
    });

    if (!response.ok) {
      console.error("Error setting user type:", response.statusText);
      return;
    }
  } catch (error) {
    console.error("Error setting user type:", error);
  }

  redirect(`/sign-in-paypal`);
}

export async function getUser(userId: string) {
  noStore();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function paypal(datasetId: string, payee: string, amount: string) {
  try {
    const response = await fetch(`http://localhost:5001/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        datasetId: datasetId,
        payee: payee,
        amount: amount,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create PayPal payment");
    }

    const data = await response.json();
    if (data.approvalUrl) {
      return data.approvalUrl;
    } else {
      throw new Error("Approval URL not found");
    }
  } catch (error) {
    console.error("Error fetching paypal:", error);
  }
}

const EmailSchema = z.object({
  email: z.string().email(),
});

export type State1 = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
};

export async function updateUserWithEmail(formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    console.error("No user ID found");
    return;
  }

  const validatedData = EmailSchema.safeParse({
    email: formData.get("email") as string,
  });

  if (!validatedData.success) {
    //console.log(validatedData.error.flatten().fieldErrors)
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/email/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData.data),
      }
    );

    if (!response.ok) {
      console.error("Error setting user email:", response.statusText);
      return;
    }
  } catch (error) {
    console.error("Error setting user email:", error);
  }

  redirect(`/dashboard`);
}

export async function createPayment(datasetId: string) {
  const { userId } = auth();
  if (!userId) {
    console.error("No user ID found");
    return;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        datasetId: datasetId,
        userId: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error creating payment:", error);
  }
}

export async function getDatasetsByUser(userID: string) {
  noStore();

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dataset/user/${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

export async function getDatasetsLengthByUser(userID: string) {
  noStore();

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dataset/user/${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const datasets = await response.json();
    return datasets.length;
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return [];
  }
}
