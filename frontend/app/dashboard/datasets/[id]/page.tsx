import Breadcrumbs from "@/app/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { findById, generate } from "@/lib/data";
import { Dataset } from "@/lib/definitions";
import { clerkClient } from "@clerk/nextjs/server";

async function getDataProvider(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user.username;
  }
  catch (error) {
    return ("No Data Provider")
  }
}


function formatDate(dateString: any) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const dataset: Dataset = await findById(id);

  const access_token = await generate(dataset.accessToken);

  if (access_token == null) {
    return (
      <p>Napaka</p>
    );
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Datasets", href: "/dashboard/datasets" },
          {
            label: "Details",
            href: `/dashboard/datasets/${id}`,
            active: true,
          },
        ]}
      />
      <div className="max-w mx-auto bg-gray-100 p-8 rounded-md">
        <h2 className="text-xl font-semibold mb-4">{dataset.name}</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-500">URL:</p>
            <p>{dataset.url}</p>
          </div>
          <div>
            <p className="text-gray-500">Price:</p>
            <p>{dataset.price}€</p>
          </div>
          <div>
            <p className="text-gray-500">Category:</p>
            <p>{dataset.category}</p>
          </div>
          <div>
            <p className="text-gray-500">Data Provider:</p>
            <p><span>{(await getDataProvider(dataset.userID))} </span></p>
          </div>
          <div>
            <p className="text-gray-500">Duration:</p>
            <p>{dataset.duration} seconds</p>
          </div>
          <div>
            <p className="text-gray-500">Date:</p>
            <p>{formatDate(dataset.createdAt)}</p>
          </div>
        </div>
      </div>
      

      <p className="mt-20">Your access token:</p>
      <strong>{access_token.access_token}</strong>
    </main>
  );
}
