export default function PresetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Presets</h1>
        <p className="text-gray-400">Quick access light scenes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Preset cards will go here */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <div className="text-4xl mb-2">💡</div>
          <h3 className="font-semibold">No presets yet</h3>
        </div>
      </div>
    </div>
  );
}
