export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-2 rounded bg-[#222] text-white focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded bg-[#222] text-white focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#FF8A00] text-white font-bold py-2 px-6 rounded hover:bg-[#E52E71] transition"
          >
            Login
          </button>
            <p className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <a href="/sign-up" className="text-[#FF8A00] hover:underline">
                Sign Up
                </a>
            </p>
        </form>
      </div>
    </div>
  );
}