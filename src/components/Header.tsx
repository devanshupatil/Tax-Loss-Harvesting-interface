export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
      <div className="flex items-center gap-1">
        <span className="font-black text-xl text-gray-900">KoinX</span>
        <span className="text-yellow-400 text-lg">★</span>
      </div>
      <div className="w-px h-5 bg-gray-200" />
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800 text-sm">Tax Harvesting</span>
        <a href="#" className="text-blue-500 text-xs underline">
          How it works?
        </a>
      </div>
    </header>
  )
}
