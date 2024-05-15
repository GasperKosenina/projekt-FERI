export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  return (
    <div>
      <h1>Payment successful!</h1>
      <p>Thank you for your payment.</p>
    </div>
  );
}
