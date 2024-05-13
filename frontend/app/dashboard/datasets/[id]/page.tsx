import Breadcrumbs from "@/app/ui/breadcrumbs"
import { findById, generate } from "@/lib/data";
import { Dataset } from "@/lib/definitions";


export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const dataset: Dataset = await findById(id);
  //console.log(dataset.accessToken)


  const access_token = await generate(dataset.accessToken);
  //console.log(access_token);

  if (access_token == null) {
    return (
      <p>Napaka</p>
    )
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Datasets', href: '/dashboard/datasets' },
          {
            label: 'Details',
            href: `/dashboard/datasets/${id}`,
            active: true,
          },
        ]}
      />
      <p>Your access token:</p>
      <strong>{access_token.access_token}</strong>
    </main>
  );
}
