export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Daily Agent Console</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Admin console for managing AI intelligence agents
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">
              View agent status and recent activity
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Data Sources</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Connect Linear, GitHub, and other sources
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Agents</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Configure Context, Competitive, and Industry agents
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
