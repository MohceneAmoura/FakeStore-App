// src/app/global-error.js
'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-xl mb-6">{error.message}</p>
          <button
            onClick={() => reset()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}