import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CalendarIcon, ShoppingBagIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const Home = () => {
  const features = [
    {
      icon: CalendarIcon,
      title: 'Discover Events',
      description: 'Find and attend amazing events happening around you'
    },
    {
      icon: ShoppingBagIcon,
      title: 'Shop Merchandise',
      description: 'Browse exclusive merchandise from your favorite creators'
    },
    {
      icon: SparklesIcon,
      title: 'Digital Tickets',
      description: 'Instant digital tickets delivered to your phone'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Payments',
      description: 'Safe and reliable payment processing with MoMo'
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Summit 2025',
      date: 'Nov 15, 2025',
      location: 'Kampala',
      price: 50000,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
    },
    {
      id: 2,
      title: 'Music Festival',
      date: 'Dec 1, 2025',
      location: 'Entebbe',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'
    },
    {
      id: 3,
      title: 'Art Exhibition',
      date: 'Nov 20, 2025',
      location: 'Jinja',
      price: 30000,
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'
    }
  ]

  const featuredMerchandise = [
    {
      id: 1,
      name: 'CEO Bazaar T-Shirt',
      category: 'Apparel',
      price: 50000,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      organization: 'CEO Bazaar Events'
    },
    {
      id: 2,
      name: 'VIP Event Lanyard',
      category: 'Accessories',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800',
      organization: 'Downtown Concerts'
    },
    {
      id: 3,
      name: 'Limited Edition Poster',
      category: 'Prints',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800',
      organization: 'Art Gallery UG'
    },
    {
      id: 4,
      name: 'Branded Water Bottle',
      category: 'Accessories',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      organization: 'Sports Arena LLC'
    }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-clash font-bold text-5xl md:text-7xl mb-6"
          >
            Where Vision Meets <span className="text-gold">Impact</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-graytext mb-12 max-w-3xl mx-auto"
          >
            Discover events, shop exclusive merchandise, and connect with extraordinary experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
            >
              Explore Events
            </button>
            <Link
              to="/register"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-black transition-colors"
            >
              Start Selling
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-matte/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-clash font-bold text-4xl text-center mb-16">
            Why Choose <span className="text-gold">CEO Bazaar</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-gold/50 transition-colors"
              >
                <feature.icon className="h-12 w-12 text-gold mb-4" />
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-graytext">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-clash font-bold text-4xl">
              Upcoming <span className="text-gold">Events</span>
            </h2>
            <Link to="/events" className="text-gold hover:text-gold/80 transition-colors">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/event/${event.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-gold text-black px-3 py-1 rounded-md font-semibold text-sm">
                      UGX {event.price.toLocaleString()}
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl mb-2 group-hover:text-gold transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-graytext text-sm space-x-4">
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.location}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Merchandise Section */}
      <section id="merchandise" className="py-20 bg-matte/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-clash font-bold text-4xl">
              Shop <span className="text-gold">Merchandise</span>
            </h2>
            <Link to="/merchandise" className="text-gold hover:text-gold/80 transition-colors">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMerchandise.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/merchandise/${item.id}`} className="block">
                  <div className="relative overflow-hidden rounded-lg mb-4 bg-white/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-gold text-black px-3 py-1 rounded-md font-semibold text-sm">
                      UGX {item.price.toLocaleString()}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-md text-xs">
                      {item.category}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-gold transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-graytext text-sm">
                    by {item.organization}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-clash font-bold text-4xl mb-6">
            Ready to Start Selling?
          </h2>
          <p className="text-xl text-graytext mb-8 max-w-2xl mx-auto">
            Join thousands of organizers using CEO Bazaar to sell tickets and merchandise
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home