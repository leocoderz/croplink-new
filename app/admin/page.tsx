"use client";

import { AdminUtils } from "@/components/admin-utils";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🔧 CropLink Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Development utilities and debugging tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminUtils />

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">📧</span>
              Email Service Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Test the email notification service
            </p>
            <button
              onClick={() => window.open("/api/test-email", "_blank")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Test Email Service
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🏠</span>
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
              >
                Go to Main App
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">
            📝 Quick Solutions for Common Issues
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium text-red-600 dark:text-red-400">
                User Already Exists Error
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                If you get "email already exists" error, use the "Clear CropLink
                Data" button above to remove existing accounts.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-blue-600 dark:text-blue-400">
                Testing New Features
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Clear data between tests to ensure clean testing environment for
                signup/login flows.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-green-600 dark:text-green-400">
                Email Testing
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Use the email service test button to verify email notifications
                are working properly.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium text-yellow-600 dark:text-yellow-400">
                Development Tips
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Access this admin page anytime at <code>/admin</code> for
                debugging utilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
