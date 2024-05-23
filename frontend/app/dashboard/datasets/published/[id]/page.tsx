import { findById } from "@/lib/data";
import { Dataset } from "@/lib/definitions";
import DatasetPage from "@/app/ui/published-dataset";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const dataset: Dataset = await findById(id);

    return <DatasetPage dataset={dataset} />;
}
