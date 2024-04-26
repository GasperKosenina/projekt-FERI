import Form from "@/app/ui/create-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Datasets", href: "/dashboard/datasets" },
          {
            label: "Publish dataset",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
