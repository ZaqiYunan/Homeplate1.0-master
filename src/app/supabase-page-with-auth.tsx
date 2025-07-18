"use client";

import Image from "next/image"
import { SupabaseLandingHeader } from "@/components/SupabaseLandingHeader"
import { AuthProvider } from '@/contexts/SupabaseAuthContext'

export default function SupabaseLandingPageWithAuth() {
  return (
    <AuthProvider>
      <div className="relative isolate bg-white">
        {/* Landing Page Header */}
        <SupabaseLandingHeader />

        {/* Background blur effect */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg]
            bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)",
            }}
          />
        </div>

        {/* Main content area */}
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pt-20 p-8 pb-8 gap-16 sm:p-20 sm:pt-24 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">

            {/* Hero Section */}
            <section id="home" className="text-center mx-auto max-w-2xl py-24 sm:py-32 lg:py-40">
              <div className="mb-4 hidden sm:flex justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  Temukan fitur terbaru kami.{" "}
                  <a href="#recipes" className="font-semibold text-green-600">
                    <span className="absolute inset-0" aria-hidden="true"></span>
                    Baca selengkapnya <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
              <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                Jelajahi Hidangan Favoritmu
              </h1>
              <p className="mt-6 text-lg text-gray-500 sm:text-xl">
                Platform yang membantu kamu menemukan dan mengelola makanan sehat dan lezat — langsung dari kulkasmu.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/login"
                  className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition duration-300"
                >
                  Mulai Sekarang
                </a>
                <a
                  href="#about"
                  className="text-sm font-semibold text-gray-900 hover:text-green-600 transition duration-300"
                >
                  Pelajari lebih lanjut <span aria-hidden="true">→</span>
                </a>
              </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="text-center mx-auto max-w-2xl py-24 sm:py-24 lg:py-10">
              <h2 className="text-green-600 text-2xl font-bold mb-4">ABOUT US</h2>
              <p className="max-w-xl mx-auto text-gray-600">
                Kami adalah platform yang menyediakan berbagai resep makanan yang lezat dan sehat. Dengan koleksi resep
                yang beragam, kami membantu Anda menemukan inspirasi masakan setiap hari untuk keluarga tercinta.
              </p>
            </section>

            {/* Featured Recipes Section */}
            <section id="recipes" className="py-10 px-4 w-full">
              <h2 className="text-center text-green-700 text-xl font-bold mb-8">TODAY'S FEATURED RECIPE</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    title: "KWETIAUW GORENG",
                    desc: "Kwetiauw yang dimasak dengan berbagai macam bumbu dan sayuran segar yang menggugah selera.",
                    kcal: 700,
                  },
                  {
                    title: "SOP AYAM SEHAT",
                    desc: "Sop ayam segar dan sehat cocok untuk dinikmati saat cuaca dingin atau sedang tidak enak badan.",
                    kcal: 320,
                  },
                  {
                    title: "KAREDOK",
                    desc: "Makanan khas Sunda dengan berbagai macam sayuran segar dan bumbu kacang yang lezat.",
                    kcal: 150,
                  },
                  {
                    title: "BALADO ATI AMPELA KENTANG",
                    desc: "Ati ampela dan kentang dimasak dengan bumbu balado yang pedas dan menggugah selera.",
                    kcal: 475,
                  },
                  {
                    title: "SOTO AYAM LAMONGAN",
                    desc: "Soto khas Lamongan, memberi rasa yang gurih dan segar dengan kuah yang kaya rempah.",
                    kcal: 400,
                  },
                  {
                    title: "RENDANG",
                    desc: "Daging sapi yang dimasak lama dengan berbagai rempah khas Minang yang kaya cita rasa.",
                    kcal: 500,
                  },
                ].map((recipe, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-lg hover:border-green-300 transition duration-300 bg-white"
                  >
                    <Image
                      src={`https://placehold.co/96x96/a7f3d0/166534?text=Food`}
                      alt={recipe.title}
                      width={96}
                      height={96}
                      className="object-cover rounded-md bg-green-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">{recipe.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.desc}</p>
                      <div className="text-xs text-green-600 font-semibold">{recipe.kcal} kcal / serving</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-green-50 py-10 px-4 w-full rounded-lg">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl text-green-600 font-semibold mb-6 text-center">Frequently Asked Questions</h2>
                <ul className="space-y-3">
                  <li className="border border-green-200 p-4 rounded-lg hover:bg-green-100 transition duration-300 bg-white">
                    <strong className="text-gray-900">Is my data safe?</strong> — Yes, we use advanced encryption to
                    protect your personal information and ensure your privacy is maintained.
                  </li>
                  <li className="border border-green-200 p-4 rounded-lg hover:bg-green-100 transition duration-300 bg-white">
                    <strong className="text-gray-900">What is storage?</strong> — Our storage system keeps your favorite
                    recipes and meal plans organized and easily accessible across all your devices.
                  </li>
                  <li className="border border-green-200 p-4 rounded-lg hover:bg-green-100 transition duration-300 bg-white">
                    <strong className="text-gray-900">How to use this application?</strong> — Simply browse our recipe
                    collection, save your favorites, and follow our step-by-step cooking instructions.
                  </li>
                  <li className="border border-green-200 p-4 rounded-lg hover:bg-green-100 transition duration-300 bg-white">
                    <strong className="text-gray-900">Who can I contact for further assistance?</strong> — You can reach
                    out to our support team through the contact form below or email us directly.
                  </li>
                </ul>
              </div>
            </section>
          </main>
        </div>

        {/* Footer - Full Width */}
        <footer id="contact" className="bg-green-800 text-white py-12 px-4 text-sm w-full">
          <div className="flex flex-col md:flex-row justify-between gap-8 max-w-6xl mx-auto">
            <div className="md:w-1/2">
              <div className="text-3xl font-bold mb-4">HomePlate</div>
              <p className="text-green-200 mb-6 text-base">
                Platform terpercaya untuk menemukan resep makanan sehat dan lezat. Bergabunglah dengan ribuan pengguna
                yang sudah merasakan kemudahan memasak bersama kami.
              </p>
              <div className="text-green-300">© 2025 HomePlate. All rights reserved.</div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-bold mb-4">Send Us a Message</h3>
              <p className="mb-6 text-green-200 text-base">
                Your feedback will help us make this app better than before.
              </p>
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="p-4 rounded-md text-gray-900 border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="p-4 rounded-md text-gray-900 border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
                />
                <textarea
                  placeholder="Message Here"
                  rows={4}
                  className="p-4 rounded-md text-gray-900 border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none text-base"
                />
                <button
                  type="submit"
                  className="bg-white text-green-800 px-6 py-4 rounded-md hover:bg-green-100 transition duration-300 font-semibold text-base"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}
