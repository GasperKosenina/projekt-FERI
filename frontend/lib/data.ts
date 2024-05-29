"use server";
import { Dataset, Payment, TokenRequest } from "./definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { any, z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { request } from "http";

const PriceItemSchema = z.object({
  purpose: z.string(),
  price: z.number().min(0, { message: "Price must be greater or equal to 1" }),
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
    .gt(0, { message: "Duration must be greater than 0" }),
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
  redirect("/dashboard");
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
export async function getDatasetNameById(id: string) {
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

    const dataset: Dataset = await response.json();
    return dataset.name;
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return [];
  }
}

export async function getDatasetProviderById(id: string) {
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

    const dataset: Dataset = await response.json();
    return getDataProviderName(dataset.userID);
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return [];
  }
}

export async function generate(token: string, experation: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        experation: experation,
      }),
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
        admin: false,
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
export async function getUserEmail(userId: string) {
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
    return user.email as string;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function paypal(
  datasetId: string,
  payee: string,
  amount: string,
  payment_id: string
) {
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
        payment_id: payment_id,
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
export async function createPayment(datasetId: string, amount: number) {
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
        amount: amount,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment");
    }

    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.error("Error creating payment:", error);
  }
}
export async function getDatasetsByUser(userID: string) {
  noStore();

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
export async function updateToken(id: string, token: boolean) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: token,
        }),
      }
    );
  } catch (error) {
    console.error("Error setting token status:", error);
  }
}
export async function updateStatus(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus: true,
        }),
      }
    );
  } catch (error) {
    console.error("Error setting payment status:", error);
  }
}

export async function updateTokenCreatedAt(id: string) {
  const tokenCreatedAt = new Date().toISOString();
  console.log(tokenCreatedAt);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/tokenCreatedAt/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenCreatedAt: tokenCreatedAt,
        }),
      }
    );
  } catch (error) {
    console.error("Error setting tokenCreatedAt status:", error);
  }
}

export async function updateShowStatus(id: string, show: boolean) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dataset/show-status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          show: show,
        }),
      }
    );
  } catch (error) {
    console.error("Error setting payment status:", error);
  }
}

export async function getPaymentById(id: string) {
  noStore();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/${id}`,
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
    console.error("Error fetching payment:", error);
    return [];
  }
}
export async function getPurchasedDatasets(userID: string) {
  noStore();

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/purchased/${userID}`,
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
export async function getPaymentsByUser(userID: string) {
  noStore();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/dataset/${userID}`,
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

    const payments = await response.json();
    return payments;
  } catch (error) {
    console.error("Error fetching payment:", error);
    return [];
  }
}

export async function getPaymentsByUser2(userID: string) {
  noStore();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/dataset2/${userID}`,
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

    const payments = await response.json();
    return payments;
  } catch (error) {
    console.error("Error fetching payment:", error);
    return [];
  }
}
export async function getDataProviderName(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);
    if (user.firstName) {
      return user.firstName;
    }
    return user.username;
  } catch (error) {
    return "No Data Provider";
  }
}
export async function getDataProviderPicture(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);
    if (user.imageUrl) {
      return user.imageUrl;
    }
    return "/default-avatar.png";
  } catch (error) {
    return "No Data Provider";
  }
}

export async function getPaymentByDataset(datasetID: string, userID: string) {
  noStore();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/purchased-dataset/${datasetID}/${userID}`,
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

    const payment = await response.json();
    return payment;
  } catch (error) {
    console.error("Error fetching payment:", error);
    return [];
  }
}

export async function getAllPaymentsByDataset(datasetID: string) {
  noStore();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/purchased-dataset-all/${datasetID}`,
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

    const payment = await response.json();
    return payment;
  } catch (error) {
    console.error("Error fetching payment:", error);
    return [];
  }
}

export async function postTokenRequest(
  datasetId: string,
  userId: string,
  providerId: string,
  paymentId: string,
  reason: string
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tokenrequest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reqUserID: userId,
          providerID: providerId,
          datasetID: datasetId,
          paymentID: paymentId,
          status: "pending",
          reason: reason,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create token request");
    }

    const Tokenrequest: TokenRequest = await response.json();
    return Tokenrequest;
  } catch (error) {
    console.error("Error creating token request:", error);
  }
}

export async function getAllPendingByUserId(userId: string) {
  noStore();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tokenrequest/pending/${userId}`,
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

    const requests = await response.json();
    return requests;
  } catch (error) {
    console.error("Error fetching token requests:", error);
    return [];
  }
}

export async function getAllDeclinedByUserId(userId: string) {
  noStore();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tokenrequest/declined/${userId}`,
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

    const requests = await response.json();
    return requests;
  } catch (error) {
    console.error("Error fetching token requests:", error);
    return [];
  }
}

export async function getAllAcceptedByUserId(userId: string) {
  noStore();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tokenrequest/accepted/${userId}`,
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

    const requests = await response.json();
    return requests;
  } catch (error) {
    console.error("Error fetching token requests:", error);
    return [];
  }
}

export async function updateTokenRequestStatus(
  id: string,
  datasetId: string,
  paymentId: string,
  status: string,
  amount: number
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tokenrequest/status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          datasetID: datasetId,
          paymentID: paymentId,
          status: status,
          amount: amount,
        }),
      }
    );

    if (!response.ok) {
      console.error("Error setting token request status:", response.statusText);
      return;
    }

    updateToken(paymentId, false);

    revalidatePath("/dashboard/notifications");
  } catch (error) {
    console.error("Error setting token request status:", error);
  }
}

export async function updateTokenRequestSeen(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tokenrequest/seen/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seen: true,
        }),
      }
    );

    if (!response.ok) {
      console.error("Error setting token request seen:", response.statusText);
      return;
    }

    revalidatePath("/dashboard/notifications");
  } catch (error) {
    console.error("Error setting token request seen:", error);
  }
}

export async function updateTokenRequestPayed(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tokenrequest/payed/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payed: true,
        }),
      }
    );

    if (!response.ok) {
      console.error("Error setting token request payed:", response.statusText);
      return;
    }

    revalidatePath("/dashboard/notifications");
  } catch (error) {
    console.error("Error setting token request payed:", error);
  }
}

export async function getAllPayments() {
  //console.log(id);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error setting all payments:", response.statusText);
      return [];
    }

    const payments = await response.json();

    return payments;
  } catch (error) {
    console.error("Error fetching all payments:", error);
    return [];
  }
}

export async function getAllTokenRequests() {
  //console.log(id);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tokenrequest`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Error setting all payments:", response.statusText);
      return [];
    }

    const token_requests = await response.json();

    return token_requests;
  } catch (error) {
    console.error("Error fetching all payments:", error);
    return [];
  }
}


export async function getTokenRequestsByUser(userID: string) {
  noStore();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tokenrequest/dataset/${userID}`,
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

    const token_requests = await response.json();
    return token_requests;
  } catch (error) {
    console.error("Error fetching payment:", error);
    return [];
  }
}

