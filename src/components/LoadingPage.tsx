// // components/LoadingPage.tsx

// export default function LoadingPage() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
//       <div className="mb-6 animate-spin-slow">
//         {/* Spinning Ring Icon */}
//         <svg
//           className="h-16 w-16 text-yellow-500"
//           viewBox="0 0 64 64"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <circle cx="32" cy="40" r="16" stroke="currentColor" strokeWidth="4" />
//           <path
//             d="M26 14 L32 22 L38 14 M32 22 L32 30"
//             stroke="currentColor"
//             strokeWidth="3"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//           <path d="M28 10 H36 L32 4 Z" fill="currentColor" />
//         </svg>
//       </div>
//       <h1 className="text-xl font-medium mb-2">Polishing the sparkle...</h1>
//       <p className="text-sm text-gray-500">Your luxury experience is loading</p>
//     </div>
//   );
// }
// components/LoadingPage.tsx

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-6 animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-500"></div>
      <h1 className="text-lg sm:text-xl font-light text-gray-900 mb-2">
        Loading your experience
      </h1>
      <p className="text-sm text-gray-500 font-light">
        Please wait while we prepare everything
      </p>
    </div>
  );
}
