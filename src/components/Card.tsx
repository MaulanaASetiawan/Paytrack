export default function Card({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <div className="bg-neutral-800/60 rounded-lg p-6 hover:bg-neutral-800 transition-colors">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
      <a href={link} className="mt-4 inline-block text-sm font-medium text-orange-500 hover:text-orange-600">
        Learn more
      </a>
    </div>
  );
}