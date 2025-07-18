export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-4">
        Test Page - Can You See This?
      </h1>
      <p className="text-xl text-white">
        If you can see this blue page, the Next.js app is working properly.
      </p>
      <div className="mt-8 p-4 bg-white rounded-lg">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">Test Content</h2>
        <p className="text-gray-700">
          This is a simple test page to verify that:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li>Next.js is rendering properly</li>
          <li>Tailwind CSS is working</li>
          <li>Components can be displayed</li>
        </ul>
      </div>
    </div>
  );
}
