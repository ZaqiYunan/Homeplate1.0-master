"use client"

import Image from "next/image"
import { SupabaseHeader } from "@/components/SupabaseHeader"
import { AppProvider } from '@/contexts/SupabaseAppContext'
import { useEffect, useState } from "react"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { ScrollProgress } from "@/components/ScrollProgress"
import { FloatingElements } from "@/components/FloatingElements"

export default function SupabaseLandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [heroRef, heroInView] = useIntersectionObserver({ threshold: 0.1 })
  const [servicesRef, servicesInView] = useIntersectionObserver({ threshold: 0.3 })
  const [menuRef, menuInView] = useIntersectionObserver({ threshold: 0.1 })
  const [galleryRef, galleryInView] = useIntersectionObserver({ threshold: 0.2 })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const menuCategories = [
    { name: "Pizza", icon: "🍕", color: "bg-green-100" },
    { name: "Burger", icon: "🍔", color: "bg-green-200" },
    { name: "Food Chicken", icon: "🍗", color: "bg-green-100" },
    { name: "Vegetarian", icon: "🥗", color: "bg-green-200" },
    { name: "Drink", icon: "🥤", color: "bg-green-100" },
    { name: "Main Dish", icon: "🍽️", color: "bg-green-200" },
  ]

  const featuredDishes = [
    {
      title: "KWETIAUW GORENG",
      desc: "Kwetiauw yang dimasak dengan berbagai macam bumbu dan sayuran segar yang menggugah selera.",
      kcal: 700,
      image: "https://placehold.co/300x300/a7f3d0/166534?text=Kwetiauw",
    },
    {
      title: "SOP AYAM SEHAT",
      desc: "Sop ayam segar dan sehat cocok untuk dinikmati saat cuaca dingin atau sedang tidak enak badan.",
      kcal: 320,
      image: "https://placehold.co/300x300/86efac/166534?text=Sop",
    },
    {
      title: "KAREDOK",
      desc: "Makanan khas Sunda dengan berbagai macam sayuran segar dan bumbu kacang yang lezat.",
      kcal: 150,
      image: "https://placehold.co/300x300/bbf7d0/166534?text=Karedok",
    },
  ]

  const services = ["Menu Makanan Sehat", "Resep Tradisional", "Panduan Memasak", "Konsultasi Nutrisi"]

  return (
      <div className="relative isolate bg-background overflow-hidden">
        <SupabaseHeader />
        <ScrollProgress />
        <FloatingElements />

        {/* Main Content */}
        <div className="relative">
          {/* Hero Section - Redesigned */}
          <section
            ref={heroRef}
            className={`relative flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-16 py-20 min-h-[70vh] transition-all duration-1000 ${
              heroInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            {/* Left Side - Hero Content */}
            <div className="flex-1 max-w-xl z-10 flex flex-col items-start justify-center w-full mx-auto ml-4 sm:ml-20 lg:ml-52">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-2">
                Smart Ingredient<br />Management
              </h1>
              <h2 className="text-2xl sm:text-3xl text-accent font-semibold mb-4">AI-Powered Recipe Recommendations</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Organize your pantry, track your food ingredients, and let our AI suggest delicious recipes based on what you have. Reduce waste, save time, and enjoy smarter cooking.
              </p>
              <div className="flex gap-4 mb-8 flex-wrap">
                <button className= "px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold shadow hover:bg-primary/90 transition-colors">
                  Get Started
                </button>
                <button className="px-6 py-3 bg-muted text-foreground rounded-full font-semibold border border-border hover:bg-accent/10 transition-colors">
                  See AI Recommendations
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="text-xs text-muted-foreground">Try a Smart Dinner Plan</div>
                <div className="text-xs text-foreground font-semibold">Personalized for You by AI</div>
                <svg className="ml-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>

            {/* Right Side - Food Image with Floating Ingredients */}
            <div className="flex-1 flex items-center justify-center w-full mb-12 lg:mb-0 relative min-h-[320px]">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
                <Image
                  src="https://images.pexels.com/photos/1410236/pexels-photo-1410236.jpeg"
                  alt="Healthy Food Bowl"
                  fill
                  className="rounded-full object-cover shadow-2xl border-1 border-white"
                  style={{ objectFit: 'cover' }}
                />
                {/* Floating Ingredients (decorative) */}
                <span className="absolute -top-6 left-1/4 w-10 h-10 bg-green-200 rounded-full rotate-12 blur-sm"></span>
                <span className="absolute -top-8 right-8 w-8 h-8 bg-yellow-200 rounded-full rotate-45 blur-sm"></span>
                <span className="absolute bottom-0 left-0 w-8 h-8 bg-red-200 rounded-full -rotate-12 blur-sm"></span>
                <span className="absolute bottom-4 right-0 w-12 h-12 bg-green-100 rounded-full rotate-6 blur-sm"></span>
                {/* You can replace these with ingredient images for more realism */}
              </div>
            </div>
          </section>

          {/* Our Menus Section */}
          <section
            ref={menuRef}
            className={`py-20 px-4 sm:px-8 lg:px-16 bg-muted/30 transition-all duration-1000 ${
              menuInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-12">Ingredient Categories</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {menuCategories.map((category, index) => (
                  <div
                    key={index}
                    className={`group cursor-pointer transition-all duration-500 hover:-translate-y-2 ${
                      menuInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`${category.color} rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="font-semibold text-sm text-foreground">{category.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services & About Section */}
          <section
            ref={servicesRef}
            className={`py-20 px-4 sm:px-8 lg:px-16 transition-all duration-1000 ${
              servicesInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              {/* Services */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8">Our Services</h2>
                <div className="space-y-4">
                  {["Ingredient Tracking", "AI Recipe Suggestions", "Nutritional Insights", "Pantry Analytics"].map((service, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-all duration-300 ${
                        servicesInView ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-foreground">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Us */}
              <div className="relative">
                <div className="bg-accent/10 rounded-3xl p-10 relative overflow-hidden">
                  <h2 className="text-2xl font-bold text-foreground mb-6">About HomePlate</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    HomePlate helps you manage your kitchen ingredients and discover new recipes with the power of AI. Our platform is designed to make home cooking easier, smarter, and more enjoyable.
                  </p>

                  {/* Decorative Circle */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full"></div>
                  <div className="absolute -top-5 -right-5 w-20 h-20 bg-primary/10 rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Step-by-Step How It Works Section (replaces Gallery) */}
          <section
            className={`py-20 px-4 sm:px-8 lg:px-16 bg-muted/20 transition-all duration-1000`}
          >
            <div className="max-w-6xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-2">How to Get AI Recipe Recommendations</h2>
              <p className="text-muted-foreground mb-8">
                Follow these simple steps to discover recipes based on your available ingredients.
              </p>
            </div>
            {/* Interactive Steps */}
            {(() => {
              const steps = [
                {
                  title: "Enter Ingredients",
                  desc: "Add your available ingredients to your storage.",
                  icon: (
                    <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></svg>
                  ),
                },
                {
                  title: "Fill in Data",
                  desc: "Fill in the details for each item you have.",
                  icon: (
                    <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 8h6M9 12h6M9 16h2"/></svg>
                  ),
                },
                {
                  title: "Get Recipe Recommendations",
                  desc: "See personalized recipes based on your ingredients.",
                  icon: (
                    <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="10"/></svg>
                  ),
                },
              ]
              const [activeStep, setActiveStep] = useState(0)
              return (
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 md:gap-0">
                  {steps.map((step, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`group flex flex-col items-center flex-1 focus:outline-none transition-all duration-300 ${activeStep === idx ? "scale-105" : "opacity-80 hover:scale-105"}`}
                      onMouseEnter={() => setActiveStep(idx)}
                      onFocus={() => setActiveStep(idx)}
                      onClick={() => setActiveStep(idx)}
                      tabIndex={0}
                    >
                      <div className={`transition-all duration-300 mb-4 flex items-center justify-center rounded-full w-28 h-28 shadow-lg ${
                        activeStep === idx
                          ? "bg-accent text-accent-foreground border-4 border-accent"
                          : "bg-background border-2 border-accent text-accent"
                      }`}>
                        {step.icon}
                      </div>
                      <div className={`text-3xl font-bold mb-1 transition-all duration-300 ${activeStep === idx ? "text-accent" : "text-accent/30"}`}>{`0${idx + 1}`}</div>
                      <div className={`font-semibold text-lg mb-1 transition-all duration-300 ${activeStep === idx ? "text-foreground" : "text-muted-foreground"}`}>{step.title}</div>
                      <div className={`text-sm transition-all duration-300 ${activeStep === idx ? "text-accent" : "text-muted-foreground"}`}>{step.desc}</div>
                    </button>
                  ))}
                </div>
              )
            })()}
          </section>

          {/* Featured Dishes Section (moved and improved) */}
          <section className="py-20 px-4 sm:px-8 lg:px-16 bg-card">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground text-center mb-12">AI-Recommended Recipes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Recipe 1 */}
                <div className="card-hover bg-background rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                      src="https://images.pexels.com/photos/2092906/pexels-photo-2092906.jpeg"
                      alt="Kwetiauw Goreng"
                      width={96}
                      height={96}
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">KWETIAUW GORENG</h3>
                  <p className="text-sm text-muted-foreground mb-2">Kwetiauw yang dimasak dengan berbagai macam bumbu dan sayuran segar yang menggugah selera.</p>
                  <div className="text-xs text-accent mb-4">700 kcal</div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground text-xs rounded-full hover:bg-primary/90 transition-colors">
                    View Recipe
                  </button>
                </div>
                {/* Recipe 2 */}
                <div className="card-hover bg-background rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                      src="https://images.pexels.com/photos/9027511/pexels-photo-9027511.jpeg"
                      alt="Sop Ayam Sehat"
                      width={96}
                      height={96}
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">SOP AYAM SEHAT</h3>
                  <p className="text-sm text-muted-foreground mb-2">Sop ayam segar dan sehat cocok untuk dinikmati saat cuaca dingin atau sedang tidak enak badan.</p>
                  <div className="text-xs text-accent mb-4">320 kcal</div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground text-xs rounded-full hover:bg-primary/90 transition-colors">
                    View Recipe
                  </button>
                </div>
                {/* Recipe 3 */}
                <div className="card-hover bg-background rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                      src="https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg"
                      alt="salad"
                      width={96}
                      height={96}
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">SALAD</h3>
                  <p className="text-sm text-muted-foreground mb-2">Salad yang segar dan lezat, cocok untuk dinikmati saat cuaca panas atau sedang tidak enak badan.</p>
                  <div className="text-xs text-accent mb-4">100 kcal</div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground text-xs rounded-full hover:bg-primary/90 transition-colors">
                    View Recipe
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Enhanced Footer */}
        <footer
          id="contact"
          className="bg-primary text-primary-foreground py-12 px-4 text-sm w-full relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-50"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 max-w-6xl mx-auto">
            <div className="md:w-1/2 transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold mb-4 hover:text-accent transition-colors duration-300">HomePlate</div>
              <p className="text-primary-foreground/80 mb-6 text-base leading-relaxed">
                The trusted platform for managing your kitchen, tracking ingredients, and discovering AI-powered recipes. Join thousands of users making smarter cooking decisions every day.
              </p>
              <div className="text-primary-foreground/60">© 2025 HomePlate. All rights reserved.</div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-bold mb-4 hover:text-accent transition-colors duration-300">
                Send Us a Message
              </h3>
              <p className="mb-6 text-primary-foreground/80 text-base">
                Your feedback will help us make this app even smarter and more helpful for home cooks everywhere.
              </p>
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="p-4 rounded-full text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-accent text-base transition-all duration-300 focus:scale-105 hover:shadow-md"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="p-4 rounded-full text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-accent text-base transition-all duration-300 focus:scale-105 hover:shadow-md"
                />
                <textarea
                  placeholder="Message Here"
                  rows={4}
                  className="p-4 rounded-2xl text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-accent resize-none text-base transition-all duration-300 focus:scale-105 hover:shadow-md"
                />
                <button
                  type="submit"
                  className="group bg-accent text-accent-foreground px-6 py-4 rounded-full hover:bg-accent/90 transition-all duration-300 font-semibold text-base transform hover:scale-105 hover:shadow-lg relative overflow-hidden"
                >
                  <span className="relative z-10">Send Message</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </div>
          </div>
        </footer>
      </div>
  )
} 