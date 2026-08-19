import React, { useState, useEffect, useRef } from 'react';
import { 
  Wrench, 
  ShoppingBag, 
  Calendar, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Check, 
  Clock, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  AlertCircle,
  Mail,
  Send,
  Sliders,
  ChevronRight,
  CheckCircle2,
  Info,
  Star,
  Heart,
  ChevronUp
} from 'lucide-react';
import './App.css';
import heroImg from './assets/hero.png';

// BIKE DATA DEFINITION
const BIKE_BRANDS = {
  'Yamaha': ['Yamaha YZF-R15', 'Yamaha MT-15', 'Yamaha FZ-S'],
  'KTM': ['KTM RC 390', 'KTM Duke 250', 'KTM Adventure 390'],
  'Royal Enfield': ['RE Classic 350', 'RE Himalayan 450', 'RE Continental GT 650'],
  'Honda': ['Honda CB350 H\'ness', 'Honda CBR650R', 'Honda Hornet 2.0']
};

// Mock spare parts catalog data
const INITIAL_SPARES = [
  { id: 1, name: 'Brembo Sintered Brake Pads', category: 'Brakes', price: 89.99, stock: 12, rating: 4.9, desc: 'High friction coefficient pads for maximum stopping power.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'Honda CBR650R'] },
  { id: 2, name: 'NGK Iridium IX Spark Plug (Pack of 4)', category: 'Engine', price: 45.50, stock: 8, rating: 4.8, desc: 'Designed specifically for high-performance motorcycle engines.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'RE Classic 350', 'RE Himalayan 450', 'RE Continental GT 650'] },
  { id: 3, name: 'K&N High-Flow Air Filter', category: 'Filters', price: 65.00, stock: 15, rating: 4.7, desc: 'Washable and reusable filter for increased horsepower.', compatibility: ['KTM RC 390', 'KTM Adventure 390', 'RE Himalayan 450'] },
  { id: 4, name: 'CNC Adjustable Clutch & Brake Levers', category: 'Controls', price: 110.00, stock: 6, rating: 4.9, desc: '6-position adjustable aluminum levers, black anodized.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM Duke 250', 'KTM RC 390'] },
  { id: 5, name: 'Motul 300V Synthetic Oil (4 Liters)', category: 'Fluids', price: 79.99, stock: 20, rating: 5.0, desc: 'Double Ester technology for racing & high-revving engines.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'RE Classic 350', 'RE Himalayan 450', 'RE Continental GT 650', 'Honda CB350 H\'ness', 'Honda CBR650R', 'Honda Hornet 2.0', 'KTM Adventure 390'] },
  { id: 6, name: 'LED Sequential Turn Signals (Set of 2)', category: 'Electrical', price: 34.99, stock: 24, rating: 4.6, desc: 'Sequential flowing glow pattern with high brightness LEDs.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'RE Classic 350', 'RE Himalayan 450', 'RE Continental GT 650', 'Honda CB350 H\'ness', 'Honda CBR650R', 'Honda Hornet 2.0', 'KTM Adventure 390'] },
  { id: 7, name: 'DID 525 VX3 Gold X-Ring Chain', category: 'Drivetrain', price: 135.00, stock: 4, rating: 4.9, desc: 'Top-tier durability and reduced friction chain.', compatibility: ['RE Continental GT 650', 'Honda CBR650R'] },
  { id: 8, name: 'Yuasa Heavy Duty AGM Battery', category: 'Electrical', price: 95.00, stock: 10, rating: 4.7, desc: 'Maintenance-free high cranking amp battery.', compatibility: ['RE Classic 350', 'RE Himalayan 450', 'Honda CB350 H\'ness'] }
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

// Mock initial enquiries
const INITIAL_ENQUIRIES = [
  { id: 1, name: 'Alex Hunter', email: 'alex@example.com', subject: 'Parts Availability Inquiry', message: 'Do you have fork seals for a 2021 Kawasaki Ninja 400 in stock?', resolved: false },
  { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', subject: 'Bulk Order Discount', message: 'Looking to purchase 10 packs of NGK Iridium spark plugs. Do you offer bulk trade discounts?', resolved: true }];

// ─────────────────────────────────────────────
// TOAST NOTIFICATION COMPONENT
// ─────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div
          key={t.id}
          className="animate-fade-in-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: t.type === 'success' ? 'rgba(16,185,129,0.95)'
              : t.type === 'error' ? 'rgba(239,68,68,0.95)'
              : 'rgba(17,24,39,0.95)',
            color: '#fff',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            fontSize: '0.9rem',
            fontWeight: 500,
            backdropFilter: 'blur(8px)',
            pointerEvents: 'all',
            maxWidth: '340px',
            border: '1px solid rgba(255,255,255,0.15)'
          }}
        >
          {t.type === 'success' ? <CheckCircle2 size={18} /> : t.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, padding: '0 0.25rem' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// STAR RATING DISPLAY COMPONENT
// ─────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          fill={i <= Math.round(rating) ? '#F59E0B' : 'transparent'}
          color={i <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
        />
      ))}
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function App() {
  // Navigation active tab (highlighter)
  const [activeTab, setActiveTab] = useState('home');

  // SHOW_GARAGE_SERVICES state (controlled by admin dashboard!)
  const [showGarage, setShowGarage] = useState(() => {
    const saved = localStorage.getItem('spark_show_garage');
    return saved ? JSON.parse(saved) : false;
  });

  // Pull latest spares inventory from local storage (synced with admin panel)
  const [spares, setSpares] = useState(() => {
    const saved = localStorage.getItem('spark_spares');
    return saved ? JSON.parse(saved) : INITIAL_SPARES;
  });

  // Pull latest bookings from local storage (synced with admin panel)
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('spark_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Pull enquiries from local storage (synced with admin panel)
  const [enquiries, setEnquiries] = useState(() => {
    const saved = localStorage.getItem('spark_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  // Spare By Bike State Finder
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedBike, setSelectedBike] = useState('');

  // Keep local states synchronized with changes made in other tabs (Admin panel)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedGarage = localStorage.getItem('spark_show_garage');
      if (savedGarage) setShowGarage(JSON.parse(savedGarage));

      const savedSpares = localStorage.getItem('spark_spares');
      if (savedSpares) setSpares(JSON.parse(savedSpares));

      const savedBookings = localStorage.getItem('spark_bookings');
      if (savedBookings) setBookings(JSON.parse(savedBookings));

      const savedEnquiries = localStorage.getItem('spark_enquiries');
      if (savedEnquiries) setEnquiries(JSON.parse(savedEnquiries));
    };

    window.addEventListener('storage', handleStorageChange);
    // Periodically sync in case storage events don't fire on the same tab
    const interval = setInterval(handleStorageChange, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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

  // Contact Form State
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: 'Parts Availability Inquiry',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Toast Notification State
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const showToast = (message, type = 'info') => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // Back-to-top visibility state
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('spark_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const toggleWishlist = (part) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === part.id);
      const updated = exists ? prev.filter(i => i.id !== part.id) : [...prev, part];
      localStorage.setItem('spark_wishlist', JSON.stringify(updated));
      showToast(exists ? 'Removed from wishlist' : `${part.name} saved to wishlist!`, exists ? 'info' : 'success');
      return updated;
    });
  };
  const isWishlisted = (id) => wishlist.some(i => i.id === id);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Catalog State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Tracking Code Input
  const [searchTrackingCode, setSearchTrackingCode] = useState('SC-77301');
  const [trackedBooking, setTrackedBooking] = useState(bookings[0]);

  // Sync tracked booking when bookings state updates
  useEffect(() => {
    if (trackedBooking) {
      const match = bookings.find(b => b.code === trackedBooking.code);
      if (match) setTrackedBooking(match);
    }
  }, [bookings]);

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
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('spark_bookings', JSON.stringify(updatedBookings));

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

    // Switch view to tracking screen
    switchScreen('tracking');
  };

  // Submit Contact Form
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const newEnquiry = {
      id: Date.now(),
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      resolved: false
    };
    const updatedEnquiries = [newEnquiry, ...enquiries];
    setEnquiries(updatedEnquiries);
    localStorage.setItem('spark_enquiries', JSON.stringify(updatedEnquiries));

    setContactSuccess(true);
    setContactData({
      name: '',
      email: '',
      subject: 'Parts Availability Inquiry',
      message: ''
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
    localStorage.setItem('spark_bookings', JSON.stringify(updatedBookings));

    // Update locally tracked item
    setTrackedBooking(prev => ({ ...prev, statusIndex: nextIdx }));
  };

  // Handle Tracking Search
  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const result = bookings.find(b => b.code.toUpperCase().trim() === searchTrackingCode.toUpperCase().trim());
    if (result) {
      setTrackedBooking(result);
      showToast(`Booking ${result.code} found!`, 'success');
    } else {
      setTrackedBooking(null);
      showToast('Tracking code not found. Try "SC-77301" for a demo!', 'error');
    }
  };

  // Checkout simulation
  const handleCheckout = () => {
    showToast(`🎉 Order placed! Total $${totalCartPrice.toFixed(2)} — Thank you!`, 'success');
    setCart([]);
    setIsCartOpen(false);
  };

  // Filter products based on search, category AND bike compatibility
  const filteredProducts = spares.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          part.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || part.category === categoryFilter;
    
    // If a bike model is selected, check if it's compatible
    let matchesBike = true;
    if (selectedBike) {
      matchesBike = part.compatibility && part.compatibility.includes(selectedBike);
    } else if (selectedBrand) {
      // If only brand is selected, check if compatible with ANY bike in that brand
      const brandBikes = BIKE_BRANDS[selectedBrand] || [];
      matchesBike = part.compatibility && part.compatibility.some(bike => brandBikes.includes(bike));
    }
    
    return matchesSearch && matchesCategory && matchesBike;
  });

  const categories = ['All', 'Engine', 'Brakes', 'Filters', 'Controls', 'Fluids', 'Electrical', 'Drivetrain'];

  // Switch Screen logic
  const switchScreen = (tabName) => {
    setActiveTab(tabName);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div className="bg-gradient-wrapper"></div>
      {/* Top Navbar */}
      <nav style={styles.nav}>
        <div className="app-container" style={styles.navContainer}>
          <div style={styles.logoGroup} onClick={() => switchScreen('home')}>
            <div style={styles.logoIcon}>
              <Wrench size={22} color="#fff" />
            </div>
            <span style={styles.logoText}>SPARK CRAFT</span>
            <span style={styles.logoBadge}>MOTO CLINIC</span>
          </div>

          <div style={styles.navLinks}>
            <button 
              onClick={() => switchScreen('home')} 
              style={activeTab === 'home' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            >
              Store
            </button>
            {showGarage && (
              <button 
                onClick={() => switchScreen('services')} 
                style={activeTab === 'services' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
              >
                Services
              </button>
            )}
            <button 
              onClick={() => switchScreen('catalog')} 
              style={activeTab === 'catalog' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            >
              Spare Parts
            </button>
            {showGarage && (
              <button 
                onClick={() => switchScreen('tracking')} 
                style={activeTab === 'tracking' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
              >
                Track Ride
              </button>
            )}
            <button 
              onClick={() => switchScreen('contact')} 
              style={activeTab === 'contact' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
            >
              Contact Us
            </button>
          </div>

          <div style={styles.navActions}>
            {/* Wishlist Heart Button in Navbar */}
            <button
              onClick={() => switchScreen('wishlist')}
              style={{ ...styles.cartButton, position: 'relative' }}
              title="My Wishlist"
            >
              <Heart size={20} fill={wishlist.length > 0 ? '#EF4444' : 'none'} color={wishlist.length > 0 ? '#EF4444' : 'var(--text-main)'} />
              {wishlist.length > 0 && <span style={styles.cartCount}>{wishlist.length}</span>}
            </button>
            <button 
              onClick={() => setIsCartOpen(true)} 
              style={styles.cartButton}
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && <span style={styles.cartCount}>{cart.reduce((a, c) => a + c.qty, 0)}</span>}
            </button>
            {showGarage && (
              <button onClick={() => switchScreen('book')} style={styles.navCTA}>
                <Calendar size={16} />
                Book Slot
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area containing separate screen/tab components */}
      <main className="app-container" style={{ padding: '6.5rem 1.5rem 4rem', minHeight: 'calc(100vh - 20rem)' }}>
        
        {/* SCREEN 1: Home / Landing */}
        {activeTab === 'home' && (
          <section className="animate-fade-in-up" style={styles.sectionSpacing}>
            {/* Hero Section */}
            <div className="glass-panel" style={styles.heroSection}>
              <div style={styles.heroContent}>
                <div style={styles.badgeRow}>
                  <Sparkles size={16} color="var(--primary)" />
                  <span>{showGarage ? 'PREMIUM MOTORCYCLE CARE & SPARE PARTS' : '100% GENUINE MOTORCYCLE SPARE PARTS'}</span>
                </div>
                <h1 style={styles.heroTitle}>
                  {showGarage ? (
                    <>
                      KEEP YOUR MACHINE <br />
                      <span style={{ color: 'var(--primary)' }}>AT PEAK PERFORMANCE</span>
                    </>
                  ) : (
                    <>
                      PREMIUM GENUINE <br />
                      <span style={{ color: 'var(--primary)' }}>MOTORCYCLE SPARES</span>
                    </>
                  )}
                </h1>
                <p style={styles.heroDescription}>
                  {showGarage 
                    ? 'Spark Craft is your absolute destination for high-end track tuning, daily general maintenance, and 100% genuine motorcycle spares. Book your expert slot in seconds.'
                    : 'Spark Craft is your destination for premium quality, factory-approved motorcycle spares and accessories. Keep your ride authentic and running at maximum potential.'}
                </p>
                <div style={styles.heroButtonRow}>
                  {showGarage ? (
                    <button onClick={() => switchScreen('book')} className="btn-primary">
                      <Calendar size={18} />
                      Book Service Now
                    </button>
                  ) : (
                    <button onClick={() => switchScreen('catalog')} className="btn-primary">
                      <ShoppingBag size={18} />
                      Explore Spares Catalog
                    </button>
                  )}
                  <button onClick={showGarage ? () => switchScreen('catalog') : () => setIsCartOpen(true)} className="btn-secondary">
                    {showGarage ? 'Browse Genuine Spares' : 'View Shopping Cart'}
                    <ArrowRight size={18} />
                  </button>
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
                <h3 style={styles.metricVal}>{showGarage ? '1,200+' : '4,500+'}</h3>
                <p style={styles.metricLabel}>{showGarage ? 'Machines Tuned' : 'Orders Shipped'}</p>
              </div>
              <div className="glass-panel" style={styles.metricCard}>
                <ShieldCheck size={24} color="var(--success)" />
                <h3 style={styles.metricVal}>100%</h3>
                <p style={styles.metricLabel}>Genuine Parts Guaranteed</p>
              </div>
              <div className="glass-panel" style={styles.metricCard}>
                <Clock size={24} color="var(--info)" />
                <h3 style={styles.metricVal}>{showGarage ? 'Same-Day' : 'Fast-Track'}</h3>
                <p style={styles.metricLabel}>{showGarage ? 'Express Fluids & Inspection' : 'Delivery & Secure Dispatch'}</p>
              </div>
            </div>

            {/* Fast tracking shortcut (Only shown if Garage is Active) */}
            {showGarage && (
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
            )}
          </section>
        )}

        {/* SCREEN 2: Services */}
        {showGarage && activeTab === 'services' && (
          <section className="animate-fade-in-up" style={styles.sectionSpacing}>
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Suspension Tuning & Seals</h3>
                <p style={styles.serviceCardText}>Sag calibration for riders weight, rebuild front forks, dust and oil seals replacements, rear shock overhaul, and damping setup.</p>
                <span style={styles.serviceCardPrice}>Starting at $89.00</span>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button onClick={() => switchScreen('book')} className="btn-primary">
                Book An Appointment
              </button>
            </div>
          </section>
        )}

        {/* SCREEN 3: Spare Parts Shop */}
        {activeTab === 'catalog' && (
          <section className="animate-fade-in-up" style={styles.sectionSpacing}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionSubtitle}>SPARK STORE</span>
              <h2 style={styles.sectionTitle}>GENUINE SPARES CATALOG</h2>
              <p style={styles.sectionDesc}>Search or filter our catalog of race-tested and manufacturer-approved components to keep your machine authentic.</p>
            </div>

            {/* Find spares by Bike Model Finder (eauto.co.in design style) */}
            <div className="glass-panel" style={styles.bikeFinderPanel}>
              <div style={styles.bikeFinderHeader}>
                <ShoppingBag size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Find Spares by Bike Model</h3>
              </div>
              <div style={styles.bikeFinderControls}>
                {/* Select Brand */}
                <div style={styles.finderField}>
                  <label style={styles.finderLabel}>1. Select Brand</label>
                  <select 
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setSelectedBike('');
                    }}
                    style={styles.finderSelect}
                  >
                    <option value="">-- All Brands --</option>
                    {Object.keys(BIKE_BRANDS).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Select Bike Model */}
                <div style={styles.finderField}>
                  <label style={styles.finderLabel}>2. Select Bike Model</label>
                  <select 
                    value={selectedBike}
                    disabled={!selectedBrand}
                    onChange={(e) => setSelectedBike(e.target.value)}
                    style={styles.finderSelect}
                  >
                    <option value="">-- All Bikes --</option>
                    {selectedBrand && BIKE_BRANDS[selectedBrand].map(bike => (
                      <option key={bike} value={bike}>{bike}</option>
                    ))}
                  </select>
                </div>

                {/* Reset button */}
                <button 
                  onClick={() => {
                    setSelectedBrand('');
                    setSelectedBike('');
                  }}
                  className="btn-secondary"
                  style={{ alignSelf: 'flex-end', height: '42px', display: 'flex', alignItems: 'center' }}
                >
                  Clear Selection
                </button>
              </div>
              
              {/* Selected Compatibility Feedback */}
              {(selectedBrand || selectedBike) && (
                <div style={styles.compatibilityFeedback}>
                  <Check size={14} color="var(--success)" />
                  <span style={{ fontSize: '0.85rem' }}>
                    Showing spare parts compatible with {selectedBike ? <strong>{selectedBike}</strong> : <strong>all {selectedBrand} models</strong>}
                  </span>
                </div>
              )}
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
                <h3>No Compatible Spare Parts Found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search queries or selecting a different bike model.</p>
              </div>
            ) : (
              <div style={styles.catalogGrid}>
                {filteredProducts.map(part => (
                  <div key={part.id} className="glass-panel" style={styles.productCard}>
                    <div style={styles.productBadge}>{part.category}</div>
                    <div style={styles.productDetails}>
                      <h3 style={styles.productName}>{part.name}</h3>
                      <p style={styles.productDesc}>{part.desc}</p>
                      
                      {/* Compatibility model badges list */}
                      {part.compatibility && (
                        <div style={styles.compatibilityList}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fits: </span>
                          {part.compatibility.map(b => (
                            <span key={b} style={styles.compatBadge}>{b}</span>
                          ))}
                        </div>
                      )}

                      {/* Star Rating */}
                      <StarRating rating={part.rating} />

                      <div style={styles.productFooter}>
                        <div>
                          <span style={styles.productPrice}>${part.price.toFixed(2)}</span>
                          <span style={styles.productStock}>In Stock: {part.stock}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => toggleWishlist(part)}
                            title={isWishlisted(part.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              padding: '0.4rem 0.5rem', borderRadius: '8px', cursor: 'pointer',
                              background: isWishlisted(part.id) ? 'rgba(239,68,68,0.08)' : 'rgba(17,24,39,0.04)',
                              border: isWishlisted(part.id) ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border)',
                              color: isWishlisted(part.id) ? '#EF4444' : 'var(--text-muted)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Heart size={14} fill={isWishlisted(part.id) ? '#EF4444' : 'none'} />
                          </button>
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
                  </div>
                ))}
              </div>
            )}

            {/* Moto Clinic / Garage Services teaser banner (Only shown if Garage is INACTIVE) */}
            {!showGarage && (
              <div className="glass-panel animate-fade-in-up" style={styles.teaserBanner}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <div style={{ ...styles.logoIcon, width: '48px', height: '48px' }}>
                    <Wrench size={24} color="#fff" />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Spark Craft Clinic & Garage Servicing</h3>
                <span style={{ fontSize: '0.8rem', background: 'rgba(17, 24, 39, 0.04)', color: 'var(--text-muted)', border: '1px solid rgba(17,24,39,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold' }}>COMING SOON</span>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '1rem auto 0', lineHeight: '1.6' }}>
                  We are expanding our store! Professional diagnostic evaluations, suspension setups, and high-performance ECU mappings will be available in our clinic soon. Stay tuned!
                </p>
              </div>
            )}
          </section>
        )}

        {/* SCREEN 4: Live Status Tracker */}
        {showGarage && activeTab === 'tracking' && (
          <section className="animate-fade-in-up" style={styles.sectionSpacing}>
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
          </section>
        )}

        {/* SECTION 5: Book Service Slot */}
        {showGarage && activeTab === 'book' && (
          <section className="animate-fade-in-up" style={{ ...styles.sectionSpacing, maxWidth: '720px', margin: '0 auto' }}>
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
                  <button onClick={() => { switchScreen('tracking'); setBookingSuccessCode(''); }} className="btn-primary">
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
          </section>
        )}

        {/* SCREEN 6: Contact Us */}
        {activeTab === 'contact' && (
          <section className="animate-fade-in-up" style={{ ...styles.sectionSpacing, maxWidth: '900px', margin: '0 auto' }}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionSubtitle}>CONTACT US</span>
              <h2 style={styles.sectionTitle}>GET IN TOUCH WITH SPARK CRAFT</h2>
              <p style={styles.sectionDesc}>Have inquiries about specific spare parts, stock levels, or order tracking? Drop us a message.</p>
            </div>

            <div style={styles.contactContainer}>
              {/* Contact Information Cards */}
              <div style={styles.contactInfoCol}>
                <div className="glass-panel" style={styles.contactInfoCard}>
                  <div style={styles.contactIconCircle}>
                    <Phone size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Phone Support</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>+1 (555) 019-2834</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.80rem' }}>Toll Free parts line</p>
                  </div>
                </div>

                <div className="glass-panel" style={styles.contactInfoCard}>
                  <div style={styles.contactIconCircle}>
                    <Mail size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Email Address</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>parts@sparkcraft.com</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Response in 24 hours</p>
                  </div>
                </div>

                <div className="glass-panel" style={styles.contactInfoCard}>
                  <div style={styles.contactIconCircle}>
                    <MapPin size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>HQ Warehouse</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>482 Gearbox Alley, Speedville</p>
                  </div>
                </div>
              </div>

              {/* Contact Form Panel */}
              <div className="glass-panel" style={{ flex: 1.3, padding: '2rem' }}>
                {contactSuccess ? (
                  <div className="animate-fade-in-up" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <div style={{ ...styles.successCircle, marginBottom: '1rem' }}>
                      <Check size={30} color="var(--success)" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Message Sent!</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                      Thank you for contacting Spark Craft. Our parts department will get back to you shortly.
                    </p>
                    <button onClick={() => setContactSuccess(false)} className="btn-secondary">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', textAlign: 'left' }}>Send Us a Message</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                      <label style={styles.formLabel}>Your Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Vikram Dev"
                        value={contactData.name}
                        onChange={(e) => setContactData({...contactData, name: e.target.value})}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                      <label style={styles.formLabel}>Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="e.g. vikram@example.com"
                        value={contactData.email}
                        onChange={(e) => setContactData({...contactData, email: e.target.value})}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                      <label style={styles.formLabel}>Subject</label>
                      <select 
                        value={contactData.subject}
                        onChange={(e) => setContactData({...contactData, subject: e.target.value})}
                      >
                        <option>Parts Availability Inquiry</option>
                        <option>Bulk Order Discount</option>
                        <option>Shipping & Delivery Status</option>
                        <option>General Feedback</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                      <label style={styles.formLabel}>Message</label>
                      <textarea 
                        required 
                        rows="4" 
                        placeholder="Write your request details here..."
                        value={contactData.message}
                        onChange={(e) => setContactData({...contactData, message: e.target.value})}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                      <Send size={16} />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
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
            <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1rem' }}>Store Timings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={14} color="var(--primary)" />
                <span>Mon - Sat: 9:00 AM - 7:30 PM</span>
              </div>
              <div>Sunday: Closed</div>
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

      {/* WISHLIST OVERLAY PANEL */}
      {activeTab === 'wishlist' && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => switchScreen('catalog')}
        >
          <div
            className="glass-panel animate-fade-in-up"
            style={{ width: '90%', maxWidth: '760px', maxHeight: '80vh', overflowY: 'auto', padding: '2.5rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Heart size={22} color="#EF4444" fill="#EF4444" />
                <h2 style={{ fontSize: '1.5rem' }}>My Wishlist</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(17,24,39,0.05)', border: '1px solid var(--border)', padding: '0.15rem 0.5rem', borderRadius: '20px' }}>{wishlist.length} saved</span>
              </div>
              <button onClick={() => switchScreen('catalog')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={22} /></button>
            </div>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <Heart size={48} style={{ marginBottom: '1rem', opacity: 0.25 }} />
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>No saved items yet.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Tap the ♡ on any part in the catalog to save it here.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {wishlist.map(part => (
                  <div key={part.id} style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.05em' }}>{part.category}</span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.15rem' }}>{part.name}</h4>
                      </div>
                      <button onClick={() => toggleWishlist(part)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '0.25rem' }}><X size={14} /></button>
                    </div>
                    <StarRating rating={part.rating} />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{part.desc}</p>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>${part.price.toFixed(2)}</span>
                    <button
                      onClick={() => { addToCart(part); showToast(`${part.name} moved to cart!`, 'success'); }}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.55rem 1rem' }}
                    >
                      <ShoppingBag size={14} /> Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back to Top Floating Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="animate-fade-in-up"
          title="Back to top"
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '1.5rem',
            zIndex: 150,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          <ChevronUp size={20} />
        </button>
      )}

      {/* Toast Notification Renderer */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
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
    background: 'rgba(255, 255, 255, 0.8)',
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
    color: 'var(--text-main)'
  },
  logoBadge: {
    fontSize: '0.65rem',
    background: 'rgba(17, 24, 39, 0.04)',
    color: 'var(--text-muted)',
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    border: '1px solid rgba(17, 24, 39, 0.12)'
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem'
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    outline: 'none'
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
    background: 'rgba(17, 24, 39, 0.02)',
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
    border: 'none',
    fontWeight: 600,
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    boxShadow: '0 4px 10px var(--primary-glow)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  sectionSpacing: {
    paddingTop: '1rem',
    marginBottom: '2rem'
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
    background: 'rgba(17, 24, 39, 0.04)',
    border: '1px solid rgba(17, 24, 39, 0.12)',
    color: 'var(--text-muted)',
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
    background: 'rgba(17, 24, 39, 0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(17, 24, 39, 0.08)'
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
  bikeFinderPanel: {
    padding: '2rem',
    textAlign: 'left',
    marginBottom: '2rem'
  },
  bikeFinderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '0.75rem'
  },
  bikeFinderControls: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: '1.5rem',
    alignItems: 'center'
  },
  finderField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  finderLabel: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: 'var(--text-muted)'
  },
  finderSelect: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid rgba(17, 24, 39, 0.1)',
    background: '#FFFFFF',
    fontSize: '0.9rem',
    width: '100%'
  },
  compatibilityFeedback: {
    marginTop: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    color: 'var(--success-dark)'
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
    background: '#FFFFFF',
    border: '1px solid rgba(17, 24, 39, 0.1)',
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
    background: 'rgba(17, 24, 39, 0.05)',
    border: '1px solid rgba(17, 24, 39, 0.12)',
    color: 'var(--text-muted)',
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
  compatibilityList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.25rem',
    alignItems: 'center',
    margin: '0.5rem 0'
  },
  compatBadge: {
    fontSize: '0.65rem',
    background: 'rgba(17,24,39,0.03)',
    border: '1px solid rgba(17,24,39,0.08)',
    padding: '0.1rem 0.35rem',
    borderRadius: '4px',
    color: 'var(--text-muted)'
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
    color: 'var(--text-main)'
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
    background: 'rgba(17, 24, 39, 0.03)',
    border: '1px solid rgba(17, 24, 39, 0.08)',
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
  timelineDotActive: {
    boxShadow: '0 0 16px var(--primary)',
    borderColor: 'var(--primary)'
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
  teaserBanner: {
    background: 'rgba(17, 24, 39, 0.02)',
    border: '1px dashed rgba(17, 24, 39, 0.12)',
    borderRadius: '16px',
    padding: '3rem 2rem',
    textAlign: 'center',
    marginTop: '4rem'
  },
  contactContainer: {
    display: 'flex',
    gap: '2.5rem',
    marginTop: '2rem'
  },
  contactInfoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    flex: 1,
    textAlign: 'left'
  },
  contactInfoCard: {
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  contactIconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(17, 24, 39, 0.04)',
    border: '1px solid rgba(17, 24, 39, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    borderTop: '1px solid var(--border)',
    padding: '4rem 0 2rem',
    background: '#FFFFFF',
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
