import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Settings, 
  ShoppingBag, 
  Calendar, 
  Search, 
  Sliders, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Check, 
  ChevronRight, 
  Clock, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  User,
  AlertCircle
} from 'lucide-react';
import './App.css';
import heroImg from './assets/hero.png';

// Mock spare parts catalog data
const INITIAL_SPARES = [
  { id: 1, name: 'Brembo Sintered Brake Pads', category: 'Brakes', price: 89.99, stock: 12, rating: 4.9, desc: 'High friction coefficient pads for maximum stopping power.' },
  { id: 2, name: 'NGK Iridium IX Spark Plug (Pack of 4)', category: 'Engine', price: 45.50, stock: 8, rating: 4.8, desc: 'Designed specifically for high-performance motorcycle engines.' },
  { id: 3, name: 'K&N High-Flow Air Filter', category: 'Filters', price: 65.00, stock: 15, rating: 4.7, desc: 'Washable and reusable filter for increased horsepower.' },
  { id: 4, name: 'CNC Adjustable Clutch & Brake Levers', category: 'Controls', price: 110.00, stock: 6, rating: 4.9, desc: '6-position adjustable aluminum levers, black anodized.' },
  { id: 5, name: 'Motul 300V Synthetic Oil (4 Liters)', category: 'Fluids', price: 79.99, stock: 20, rating: 5.0, desc: 'Double Ester technology for racing & high-revving engines.' },
  { id: 6, name: 'LED Sequential Turn Signals (Set of 2)', category: 'Electrical', price: 34.99, stock: 24, rating: 4.6, desc: 'Sequential flowing glow pattern with high brightness LEDs.' },
  { id: 7, name: 'DID 525 VX3 Gold X-Ring Chain', category: 'Drivetrain', price: 135.00, stock: 4, rating: 4.9, desc: 'Top-tier durability and reduced friction chain.' },
  { id: 8, name: 'Yuasa Heavy Duty AGM Battery', category: 'Electrical', price: 95.00, stock: 10, rating: 4.7, desc: 'Maintenance-free high cranking amp battery.' }
];

// Service status categories
const STATUS_STEPS = [
  { key: 'booked', label: 'Booking Confirmed', desc: 'Appointment scheduled successfully', color: 'var(--info)' },
  { key: 'received', label: 'Bike Received', desc: 'Checked in at the workshop garage', color: 'var(--warning)' },
  { key: 'inspecting', label: 'Diagnostic Check', desc: 'Pre-service checks and inspection', color: 'var(--primary)' },
  { key: 'servicing', label: 'Active Repairs', desc: 'Spares replacement & servicing', color: 'var(--primary-hover)' },
  { key: 'testing', label: 'Quality Test', desc: 'Road testing and diagnostic verification', color: 'var(--info)' },
  { key: 'ready', label: 'Ready for Pickup', desc: 'Finished, polished, and ready to ride!', color: 'var(--success)' }
];

// Initial mock bookings seeded to local storage
const INITIAL_BOOKINGS = [
  {
    code: 'SC-77301',
    name: 'Vikram Dev',
    phone: '9876543210',
    bikeModel: 'Yamaha YZF-R1',
    serviceType: 'Performance Tuning & Fluid Flush',
    date: '2026-08-12',
    time: '10:00 AM',
    statusIndex: 3, // Servicing
    notes: 'Please check rear brake feel and adjust chain slack.'
  },
  {
    code: 'SC-12402',
    name: 'John Doe',
    phone: '9988776655',
    bikeModel: 'KTM Duke 390',
    serviceType: 'General Servicing',
    date: '2026-08-13',
    time: '02:30 PM',
    statusIndex: 1, // Received
    notes: 'Standard 10,000 km oil change & service.'
  }
];

function App() {
  // Navigation & Scroll
  const [activeTab, setActiveTab] = useState('home');

  // Bookings state
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('spark_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem('spark_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Booking Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bikeModel: '',
    serviceType: 'General Diagnostics & Tuning',
    date: '',
    time: '09:00 AM',
    notes: ''
  });
  const [bookingSuccessCode, setBookingSuccessCode] = useState('');

  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Catalog State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Tracking Code Input
  const [searchTrackingCode, setSearchTrackingCode] = useState('');
  const [trackedBooking, setTrackedBooking] = useState(null);

  // Cart helper functions
  const addToCart = (part) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === part.id);
      if (existing) {
        return prevCart.map(item => item.id === part.id ? { ...item, qty: Math.min(item.qty + 1, part.stock) } : item);
      }
      return [...prevCart, { ...part, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, change) => {
    setCart((prevCart) => prevCart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + change;
        if (newQty <= 0) return null;
        return { ...item, qty: Math.min(newQty, item.stock) };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const totalCartPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // Submit Booking Form
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newCode = `SC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      code: newCode,
      name: formData.name,
      phone: formData.phone,
      bikeModel: formData.bikeModel,
      serviceType: formData.serviceType,
      date: formData.date,
      time: formData.time,
      statusIndex: 0, // Booked
      notes: formData.notes
    };
    setBookings((prev) => [newBooking, ...prev]);
    setBookingSuccessCode(newCode);
    setSearchTrackingCode(newCode);
    setTrackedBooking(newBooking);
    // Reset Form
    setFormData({
      name: '',
      phone: '',
      bikeModel: '',
      serviceType: 'General Diagnostics & Tuning',
      date: '',
      time: '09:00 AM',
      notes: ''
    });
  };

  // Simulate advancing the status of a tracked booking for demo purposes
  const advanceTrackedStatus = () => {
    if (!trackedBooking) return;
    const currentIdx = trackedBooking.statusIndex;
    const nextIdx = (currentIdx + 1) % STATUS_STEPS.length;
    
    // Update bookings state
    const updatedBookings = bookings.map(b => {
      if (b.code === trackedBooking.code) {
        return { ...b, statusIndex: nextIdx };
      }
      return b;
    });
    setBookings(updatedBookings);

    // Update locally tracked item
    setTrackedBooking(prev => ({ ...prev, statusIndex: nextIdx }));
  };

  // Handle Tracking Search
  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const result = bookings.find(b => b.code.toUpperCase().trim() === searchTrackingCode.toUpperCase().trim());
    if (result) {
      setTrackedBooking(result);
    } else {
      setTrackedBooking(null);
      alert('Tracking Code not found. Please try "SC-77301" for a demo booking!');
    }
  };

  // Checkout simulation
  const handleCheckout = () => {
    alert(`Thank you! Checkout of $${totalCartPrice.toFixed(2)} completed successfully!`);
    setCart([]);
    setIsCartOpen(false);
  };

  // Filter products
  const filteredProducts = INITIAL_SPARES.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          part.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || part.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Engine', 'Brakes', 'Filters', 'Controls', 'Fluids', 'Electrical', 'Drivetrain'];

  return (
    <div className="bg-gradient-wrapper">
      {/* Top Navbar */}
      <nav style={styles.nav}>
        <div className="app-container" style={styles.navContainer}>
          <div style={styles.logoGroup} onClick={() => setActiveTab('home')}>
            <div style={styles.logoIcon}>
              <Wrench size={22} color="#fff" />
            </div>
            <span style={styles.logoText}>SPARK CRAFT</span>
            <span style={styles.logoBadge}>MOTO CLINIC</span>
          </div>

          <div style={styles.navLinks}>
            <a 
              href="#home" 
              onClick={() => setActiveTab('home')} 
              style={activeTab === 'home' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            >
              Garage
            </a>
            <a 
              href="#services" 
              onClick={() => setActiveTab('services')} 
              style={activeTab === 'services' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            >
              Services
            </a>
            <a 
              href="#catalog" 
              onClick={() => setActiveTab('catalog')} 
              style={activeTab === 'catalog' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            >
              Spare Parts
            </a>
            <a 
              href="#tracking" 
              onClick={() => setActiveTab('tracking')} 
              style={activeTab === 'tracking' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            >
              Track Ride
            </a>
          </div>

          <div style={styles.navActions}>
            <button 
              onClick={() => setIsCartOpen(true)} 
              style={styles.cartButton}
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && <span style={styles.cartCount}>{cart.reduce((a, c) => a + c.qty, 0)}</span>}
            </button>
            <a href="#book-service" onClick={() => setActiveTab('book')} style={styles.navCTA}>
              <Calendar size={16} />
              Book Slot
            </a>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="app-container" style={{ padding: '6.5rem 1.5rem 4rem' }}>
        
        {/* TAB: Home / Garage */}
        {activeTab === 'home' && (
          <div className="animate-fade-in-up">
            {/* Hero Section */}
            <div className="glass-panel" style={styles.heroSection}>
              <div style={styles.heroContent}>
                <div style={styles.badgeRow}>
                  <Sparkles size={16} color="var(--primary)" />
                  <span>PREMIUM MOTORCYCLE CARE & SPARE PARTS</span>
                </div>
                <h1 style={styles.heroTitle}>
                  KEEP YOUR MACHINE <br />
                  <span style={{ color: 'var(--primary)' }}>AT PEAK PERFORMANCE</span>
                </h1>
                <p style={styles.heroDescription}>
                  Spark Craft is your absolute destination for high-end track tuning, daily general maintenance, and 100% genuine motorcycle spares. Book your expert slot in seconds.
                </p>
                <div style={styles.heroButtonRow}>
                  <a href="#book-service" onClick={() => setActiveTab('book')} className="btn-primary">
                    <Calendar size={18} />
                    Book Service Now
                  </a>
                  <a href="#catalog" onClick={() => setActiveTab('catalog')} className="btn-secondary">
                    Browse Genuine Spares
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
              <div style={styles.heroImageWrapper}>
                <img 
                  src={heroImg} 
                  alt="Premium custom motorcycle in garage" 
                  style={styles.heroImage}
                />
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={styles.metricGrid}>
              <div className="glass-panel" style={styles.metricCard}>
                <TrendingUp size={24} color="var(--primary)" />
                <h3 style={styles.metricVal}>1,200+</h3>
                <p style={styles.metricLabel}>Machines Tuned</p>
              </div>
              <div className="glass-panel" style={styles.metricCard}>
                <ShieldCheck size={24} color="var(--success)" />
                <h3 style={styles.metricVal}>100%</h3>
                <p style={styles.metricLabel}>Genuine Parts Guaranteed</p>
              </div>
              <div className="glass-panel" style={styles.metricCard}>
                <Clock size={24} color="var(--info)" />
                <h3 style={styles.metricVal}>Same-Day</h3>
                <p style={styles.metricLabel}>Express Fluids & Inspection</p>
              </div>
            </div>

            {/* Fast tracking & shortcut */}
            <div className="glass-panel" style={styles.quickTrackPanel}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Track Current Service Status</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Have a service code (e.g. SC-77301)? Look up diagnostics status instantly.</p>
              </div>
              <form onSubmit={handleTrackSubmit} style={styles.quickTrackForm}>
                <input 
                  type="text" 
                  placeholder="Enter Code (e.g. SC-77301)"
                  value={searchTrackingCode}
                  onChange={(e) => setSearchTrackingCode(e.target.value)}
                  style={styles.quickTrackInput}
                />
                <button type="submit" className="btn-primary" style={{ height: '100%' }}>
                  Track
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: Services */}
        {activeTab === 'services' && (
          <div className="animate-fade-in-up">
            <div style={styles.sectionHeader}>
              <span style={styles.sectionSubtitle}>CLINIC SERVICES</span>
              <h2 style={styles.sectionTitle}>PROFESSIONAL MOTORCYCLE CARE</h2>
              <p style={styles.sectionDesc}>Our certified technicians use cutting edge tools to maintain, diagnose, and repair superbikes and commuter rides alike.</p>
            </div>

            <div style={styles.serviceGrid}>
              <div className="glass-panel" style={styles.serviceCard}>
                <div style={styles.serviceIconContainer}>
                  <Wrench size={24} color="var(--primary)" />
                </div>
                <h3 style={styles.serviceCardTitle}>General Tune-up & Inspection</h3>
                <p style={styles.serviceCardText}>Comprehensive 32-point inspection, chain adjustments, Spark plugs check, oil replacement, filter cleaning, and clutch wire adjustment.</p>
                <span style={styles.serviceCardPrice}>Starting at $49.00</span>
              </div>

              <div className="glass-panel" style={styles.serviceCard}>
                <div style={styles.serviceIconContainer}>
                  <Settings size={24} color="var(--primary)" />
                </div>
                <h3 style={styles.serviceCardTitle}>Performance ECU Tuning</h3>
                <p style={styles.serviceCardText}>Custom fuel mapping, ignition curve optimization, dyno runs, throttle response adjustments, and speed limiter configuration.</p>
                <span style={styles.serviceCardPrice}>Starting at $149.00</span>
              </div>

              <div className="glass-panel" style={styles.serviceCard}>
                <div style={styles.serviceIconContainer}>
                  <ShieldCheck size={24} color="var(--primary)" />
                </div>
                <h3 style={styles.serviceCardTitle}>Brake System Overhaul</h3>
                <p style={styles.serviceCardText}>Brembo pad replacements, rotor resurfacing, brake fluid flush, master cylinder rebuild, and pressure testing for supreme safety.</p>
                <span style={styles.serviceCardPrice}>Starting at $39.00</span>
              </div>

              <div className="glass-panel" style={styles.serviceCard}>
                <div style={styles.serviceIconContainer}>
                  <TrendingUp size={24} color="var(--primary)" />
                </div>
                <h3 style={styles.serviceCardTitle}>Suspension Tuning & Seals</h3>
                <p style={styles.serviceCardText}>Sag calibration for riders weight, rebuild front forks, dust and oil seals replacements, rear shock overhaul, and damping setup.</p>
                <span style={styles.serviceCardPrice}>Starting at $89.00</span>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button onClick={() => setActiveTab('book')} className="btn-primary">
                Book An Appointment
              </button>
            </div>
          </div>
        )}

        {/* TAB: Spare Parts Shop */}
        {activeTab === 'catalog' && (
          <div className="animate-fade-in-up">
            <div style={styles.sectionHeader}>
              <span style={styles.sectionSubtitle}>SPARK STORE</span>
              <h2 style={styles.sectionTitle}>GENUINE SPARES CATALOG</h2>
              <p style={styles.sectionDesc}>Search or filter our catalog of race-tested and manufacturer-approved components to keep your machine authentic.</p>
            </div>

            {/* Filter controls */}
            <div className="glass-panel" style={styles.filterControls}>
              <div style={styles.searchBox}>
                <Search size={18} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="Search parts, brands, keywords..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.categoryFilters}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={categoryFilter === cat ? styles.filterTabActive : styles.filterTab}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="glass-panel" style={styles.emptyCatalog}>
                <AlertCircle size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3>No Spare Parts Found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search queries or filter categories.</p>
              </div>
            ) : (
              <div style={styles.catalogGrid}>
                {filteredProducts.map(part => (
                  <div key={part.id} className="glass-panel" style={styles.productCard}>
                    <div style={styles.productBadge}>{part.category}</div>
                    <div style={styles.productDetails}>
                      <h3 style={styles.productName}>{part.name}</h3>
                      <p style={styles.productDesc}>{part.desc}</p>
                      <div style={styles.productFooter}>
                        <div>
                          <span style={styles.productPrice}>${part.price.toFixed(2)}</span>
                          <span style={styles.productStock}>In Stock: {part.stock}</span>
                        </div>
                        <button 
                          onClick={() => addToCart(part)}
                          className="btn-primary" 
                          style={styles.addToCartBtn}
                        >
                          <Plus size={16} />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Book Service Slot */}
        {activeTab === 'book' && (
          <div className="animate-fade-in-up" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionSubtitle}>RESERVATION</span>
              <h2 style={styles.sectionTitle}>BOOK A SERVICE SLOT</h2>
              <p style={styles.sectionDesc}>Fill in your details below. We will assign you a tracking code immediately to watch updates in real time.</p>
            </div>

            {bookingSuccessCode ? (
              <div className="glass-panel animate-fade-in-up" style={styles.bookingSuccessPanel}>
                <div style={styles.successCircle}>
                  <Check size={36} color="var(--success)" />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Booking Confirmed!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Your appointment slot has been successfully locked. Use the tracking code below in the 'Track Ride' panel to watch real-time diagnostics.
                </p>
                <div style={styles.codeBanner}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>TRACKING CODE</span>
                  <span style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: '800', color: 'var(--primary)' }}>{bookingSuccessCode}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <button onClick={() => { setActiveTab('tracking'); setBookingSuccessCode(''); }} className="btn-primary">
                    Track Live Progress
                  </button>
                  <button onClick={() => setBookingSuccessCode('')} className="btn-secondary">
                    Book Another Slot
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="glass-panel" style={styles.bookingForm}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Vikram Dev"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Motorcycle Model</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Yamaha YZF-R1 or Duke 390"
                      value={formData.bikeModel}
                      onChange={(e) => setFormData({...formData, bikeModel: e.target.value})}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Service Category</label>
                    <select 
                      value={formData.serviceType}
                      onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    >
                      <option>General Diagnostics & Tuning</option>
                      <option>Performance ECU Tuning</option>
                      <option>Suspension Tuning & Fork seals</option>
                      <option>Braking System Overhaul</option>
                      <option>Complete Fluid & Engine Flush</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Preferred Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Preferred Time Slot</label>
                    <select 
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    >
                      <option>09:00 AM - 11:30 AM</option>
                      <option>11:30 AM - 02:00 PM</option>
                      <option>02:30 PM - 05:00 PM</option>
                      <option>05:00 PM - 07:30 PM</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Special Notes / Diagnostics Symptoms</label>
                  <textarea 
                    rows="3" 
                    placeholder="Provide any details e.g. front brake squeaks, check transmission fluid, hard cold start..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Calendar size={18} />
                  Confirm and Book Appointment
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB: Live Tracking */}
        {activeTab === 'tracking' && (
          <div className="animate-fade-in-up">
            <div style={styles.sectionHeader}>
              <span style={styles.sectionSubtitle}>TRACKER</span>
              <h2 style={styles.sectionTitle}>LIVE GARAGE STATUS</h2>
              <p style={styles.sectionDesc}>Watch the status of your machine live as technicians work. Search using your unique Spark Craft booking code.</p>
            </div>

            <div style={{ maxWidth: '640px', margin: '0 auto 2.5rem' }}>
              <form onSubmit={handleTrackSubmit} style={styles.trackFormLarge}>
                <input 
                  type="text" 
                  placeholder="Enter Code (try: SC-77301)"
                  value={searchTrackingCode}
                  onChange={(e) => setSearchTrackingCode(e.target.value)}
                  style={styles.trackInputLarge}
                />
                <button type="submit" className="btn-primary">
                  Track Ride
                </button>
              </form>
            </div>

            {trackedBooking ? (
              <div className="glass-panel animate-fade-in-up" style={styles.trackerContainer}>
                {/* Developer Demo Tooltip */}
                <div style={styles.demoBanner}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={16} color="var(--primary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>DEMO SIMULATION TOOL</span>
                  </div>
                  <button onClick={advanceTrackedStatus} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Simulate Status Step Forward
                  </button>
                </div>

                <div style={styles.trackerHeader}>
                  <div>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{trackedBooking.code}</span>
                    <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>{trackedBooking.bikeModel}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Owner</span>
                    <p style={{ fontWeight: '600' }}>{trackedBooking.name}</p>
                  </div>
                </div>

                <div style={styles.trackerMetaRow}>
                  <div>
                    <span style={styles.metaLabel}>SERVICE TYPE</span>
                    <p style={styles.metaValue}>{trackedBooking.serviceType}</p>
                  </div>
                  <div>
                    <span style={styles.metaLabel}>APPOINTMENT SLOT</span>
                    <p style={styles.metaValue}>{trackedBooking.date} at {trackedBooking.time}</p>
                  </div>
                </div>

                {trackedBooking.notes && (
                  <div style={styles.notesBlock}>
                    <span style={styles.metaLabel}>SYMPTOMS & NOTES</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>"{trackedBooking.notes}"</p>
                  </div>
                )}

                {/* Progress bar and nodes */}
                <div style={styles.timelineContainer}>
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= trackedBooking.statusIndex;
                    const isActive = idx === trackedBooking.statusIndex;
                    return (
                      <div key={step.key} style={styles.timelineStep}>
                        <div style={{
                          ...styles.timelineDot,
                          backgroundColor: isCompleted ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                          borderColor: isActive ? 'var(--primary)' : isCompleted ? 'var(--primary)' : 'var(--border)',
                          boxShadow: isActive ? '0 0 16px var(--primary)' : 'none'
                        }}>
                          {isCompleted ? <Check size={14} color="#fff" /> : <span>{idx + 1}</span>}
                        </div>
                        <div style={styles.timelineLabel}>{step.label}</div>
                        <div style={styles.timelineDesc}>{step.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={styles.noSearchPanel}>
                <AlertCircle size={36} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                <h3>No active tracking lookup.</h3>
                <p style={{ color: 'var(--text-muted)' }}>Enter one of the demo booking codes (like <strong>SC-77301</strong> or <strong>SC-12402</strong>) above to test the interactive status simulation!</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div style={styles.cartOverlay} onClick={() => setIsCartOpen(false)}>
          <div style={styles.cartDrawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.cartDrawerHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem' }}>Spare Parts Cart</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={styles.closeDrawerBtn}>
                <X size={20} />
              </button>
            </div>

            <div style={styles.cartDrawerBody}>
              {cart.length === 0 ? (
                <div style={styles.emptyCartMessage}>
                  <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                  <p>Your cart is empty.</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Browse spares to add genuine parts.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cart.map(item => (
                    <div key={item.id} style={styles.cartItemCard}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{item.name}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>${item.price.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => updateQty(item.id, -1)} style={styles.qtyBtn}>
                          <Minus size={12} />
                        </button>
                        <span style={{ width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={styles.qtyBtn}>
                          <Plus size={12} />
                        </button>
                        <button onClick={() => removeFromCart(item.id)} style={styles.deleteCartItemBtn}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={styles.cartDrawerFooter}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>${totalCartPrice.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Checkout & Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer style={styles.footer}>
        <div className="app-container" style={styles.footerGrid}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={styles.logoGroup}>
              <div style={styles.logoIcon}>
                <Wrench size={20} color="#fff" />
              </div>
              <span style={styles.logoText}>SPARK CRAFT</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Futuristic diagnostics, high-performance repairs, and premium motorcycle spares under one garage.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1rem' }}>Workshop Timings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={14} color="var(--primary)" />
                <span>Mon - Sat: 9:00 AM - 7:30 PM</span>
              </div>
              <div>Sunday: Closed for Track Riding</div>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1rem' }}>Contact Clinic</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} color="var(--primary)" />
                <span>+1 (555) 019-2834</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} color="var(--primary)" />
                <span>482 Gearbox Alley, Speedville</span>
              </div>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2026 Spark Craft Inc. All Rights Reserved. Crafted for precision rides.</p>
        </div>
      </footer>
    </div>
  );
}

// Complete inline JavaScript styles for layout customization
const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '4.5rem',
    background: 'rgba(7, 10, 19, 0.8)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center'
  },
  navContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  },
  logoIcon: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px var(--primary-glow)'
  },
  logoText: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '0.05em',
    color: '#fff'
  },
  logoBadge: {
    fontSize: '0.65rem',
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'var(--primary)',
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    border: '1px solid rgba(249, 115, 22, 0.3)'
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem'
  },
  navLink: {
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.3s ease'
  },
  navLinkActive: {
    color: 'var(--primary)'
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  cartButton: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border)',
    color: 'var(--text-main)',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  },
  cartCount: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: 'var(--primary)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  navCTA: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    boxShadow: '0 4px 10px var(--primary-glow)',
    transition: 'all 0.3s ease'
  },
  heroSection: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '2.5rem',
    padding: '3rem',
    alignItems: 'center',
    marginBottom: '2.5rem',
    textAlign: 'left',
    overflow: 'hidden',
    position: 'relative'
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  badgeRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(249, 115, 22, 0.1)',
    border: '1px solid rgba(249, 115, 22, 0.25)',
    color: 'var(--primary)',
    padding: '0.35rem 0.75rem',
    borderRadius: '50px',
    fontSize: '0.75rem',
    fontWeight: 600,
    width: 'fit-content'
  },
  heroTitle: {
    fontSize: '3rem',
    lineHeight: 1.1,
    fontWeight: 900
  },
  heroDescription: {
    color: 'var(--text-muted)',
    fontSize: '1.05rem',
    maxWidth: '540px'
  },
  heroButtonRow: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem'
  },
  heroImageWrapper: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroImage: {
    width: '100%',
    borderRadius: '12px',
    objectFit: 'cover',
    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
    border: '1px solid var(--border)'
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    marginBottom: '2.5rem'
  },
  metricCard: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  metricVal: {
    fontSize: '2rem',
    fontWeight: 800,
    fontFamily: 'var(--font-heading)'
  },
  metricLabel: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem'
  },
  quickTrackPanel: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    gap: '2rem',
    marginBottom: '2.5rem'
  },
  quickTrackForm: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  },
  quickTrackInput: {
    minWidth: '240px'
  },
  sectionHeader: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto 3rem'
  },
  sectionSubtitle: {
    color: 'var(--primary)',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.15em'
  },
  sectionTitle: {
    fontSize: '2.25rem',
    marginTop: '0.25rem',
    marginBottom: '0.75rem'
  },
  sectionDesc: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem'
  },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2rem'
  },
  serviceCard: {
    padding: '2.5rem',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'all 0.3s ease'
  },
  serviceIconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: 'rgba(249, 115, 22, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(249, 115, 22, 0.15)'
  },
  serviceCardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700
  },
  serviceCardText: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    flex: 1
  },
  serviceCardPrice: {
    color: 'var(--primary)',
    fontWeight: 600,
    fontSize: '0.95rem'
  },
  filterControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '1.5rem',
    marginBottom: '2rem'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    paddingLeft: '1rem',
    width: '100%'
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    width: '100%',
    padding: '0.75rem 0.5rem'
  },
  categoryFilters: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  filterTab: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.85rem'
  },
  filterTabActive: {
    background: 'var(--primary)',
    border: '1px solid var(--primary)',
    color: '#fff',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600
  },
  emptyCatalog: {
    padding: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  catalogGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem'
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    position: 'relative'
  },
  productBadge: {
    position: 'absolute',
    top: '0.75rem',
    left: '0.75rem',
    background: 'rgba(249, 115, 22, 0.1)',
    border: '1px solid rgba(249, 115, 22, 0.3)',
    color: 'var(--primary)',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    zIndex: 2
  },
  productDetails: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    gap: '1rem',
    textAlign: 'left'
  },
  productName: {
    fontSize: '1rem',
    fontWeight: 700,
    marginTop: '0.5rem'
  },
  productDesc: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    lineHeight: 1.4,
    flex: 1
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  productPrice: {
    display: 'block',
    fontSize: '1.15rem',
    fontWeight: 'bold',
    color: '#fff'
  },
  productStock: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--text-muted)'
  },
  addToCartBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.8rem'
  },
  bookingForm: {
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    textAlign: 'left'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  formLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-muted)'
  },
  bookingSuccessPanel: {
    padding: '3rem 2rem',
    textAlign: 'center'
  },
  successCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem'
  },
  codeBanner: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '0.25rem',
    minWidth: '280px'
  },
  trackFormLarge: {
    display: 'flex',
    gap: '0.75rem',
    width: '100%'
  },
  trackInputLarge: {
    width: '100%',
    fontSize: '1.05rem',
    padding: '0.85rem'
  },
  trackerContainer: {
    padding: '2.5rem',
    textAlign: 'left',
    maxWidth: '850px',
    margin: '0 auto'
  },
  demoBanner: {
    background: 'rgba(249, 115, 22, 0.05)',
    border: '1px solid rgba(249, 115, 22, 0.2)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  trackerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1.5rem',
    marginBottom: '1.5rem'
  },
  trackerMetaRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  metaLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 'bold',
    letterSpacing: '0.05em'
  },
  metaValue: {
    fontSize: '1.05rem',
    fontWeight: '600',
    marginTop: '0.15rem'
  },
  notesBlock: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '2.5rem'
  },
  timelineContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '0.5rem',
    position: 'relative',
    marginTop: '1rem'
  },
  timelineStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 2
  },
  timelineDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#fff',
    border: '2px solid transparent',
    transition: 'all 0.3s ease',
    marginBottom: '0.75rem'
  },
  timelineLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    marginBottom: '0.25rem'
  },
  timelineDesc: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    lineHeight: 1.3
  },
  noSearchPanel: {
    padding: '4rem 2rem',
    textAlign: 'center',
    maxWidth: '540px',
    margin: '0 auto'
  },
  cartOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 110,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  cartDrawer: {
    width: '420px',
    maxWidth: '100%',
    height: '100%',
    background: 'var(--bg-darker)',
    borderLeft: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
  },
  cartDrawerHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeDrawerBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer'
  },
  cartDrawerBody: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto'
  },
  emptyCartMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60%',
    color: 'var(--text-muted)'
  },
  cartItemCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  qtyBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteCartItemBtn: {
    background: 'none',
    border: 'none',
    color: '#EF4444',
    cursor: 'pointer',
    marginLeft: '0.5rem',
    padding: '0.25rem'
  },
  cartDrawerFooter: {
    padding: '1.5rem',
    borderTop: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.01)'
  },
  footer: {
    borderTop: '1px solid var(--border)',
    padding: '4rem 0 2rem',
    background: '#070A13',
    marginTop: '6rem'
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr',
    gap: '3rem',
    textAlign: 'left',
    marginBottom: '3rem'
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '2rem',
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  }
};

export default App;
