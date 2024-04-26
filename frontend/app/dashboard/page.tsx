import { fetchData } from "@/lib/data";

export default async function Page() {
  const data = await fetchData();
  return (
    <div>
      <h1>Dashboard</h1>
      {data.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
