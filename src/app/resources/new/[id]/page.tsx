export default function CreateResourcePage({ params: { id } }: { params: { id: string } }) {
  return <div className="p-6">{id}</div>
}
