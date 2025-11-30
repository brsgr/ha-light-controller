export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Groups</h1>
        <p className="text-gray-400">Manage light groups and areas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Group cards will go here */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
          <p className="text-gray-400 text-sm">Groups will sync from Home Assistant</p>
        </div>
      </div>
    </div>
  );
}
