import Breadcrumbs from "@/app/ui/breadcrumbs"

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;


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
            <p>{id}</p>
        </main>
    );
}