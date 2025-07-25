export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-center font-bold mb-4">Sign Up</h2>
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="First Name"
            className="px-4 py-2 rounded bg-[#222] text-white focus:outline-none"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="px-4 py-2 rounded bg-[#222] text-white focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded bg-[#222] text-white focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded bg-[#222] text-white focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="px-4 py-2 rounded bg-[#222] text-white focus:outline-none"
          />
          <p className="text-sm text-gray-400 mb-4 text-center">
            By signing up, you agree to our{" "}
            <a href="/terms" className="text-[#FF8A00] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[#FF8A00] hover:underline">
              Privacy Policy
            </a>.
          </p>
          <button
            type="submit"
            className="bg-[#FF8A00] text-white font-bold py-2 px-6 rounded hover:bg-[#E52E71] transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

            <p className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <a href="/sign-up" className="text-[#FF8A00] hover:underline">
                Sign Up
                </a>
            </p>
