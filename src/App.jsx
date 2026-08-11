import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Settings, 
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
  Lock,
  Unlock,
  LogOut,
  Sliders,
  DollarSign,
  Package,
  Layers,
  Inbox
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

// Mock initial enquiries
const INITIAL_ENQUIRIES = [
  { id: 1, name: 'Alex Hunter', email: 'alex@example.com', subject: 'Parts Availability Inquiry', message: 'Do you have fork seals for a 2021 Kawasaki Ninja 400 in stock?', resolved: false },
  { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', subject: 'Bulk Order Discount', message: 'Looking to purchase 10 packs of NGK Iridium spark plugs. Do you offer bulk trade discounts?', resolved: true }
];

function App() {
  // Navigation active tab (highlighter)
  const [activeTab, setActiveTab] = useState('home');

  // SHOW_GARAGE_SERVICES state (controlled by admin dashboard!)
  const [showGarage, setShowGarage] = useState(() => {
    const saved = localStorage.getItem('spark_show_garage');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('spark_show_garage', JSON.stringify(showGarage));
  }, [showGarage]);

  // Spares store inventory state
  const [spares, setSpares] = useState(() => {
    const saved = localStorage.getItem('spark_spares');
    return saved ? JSON.parse(saved) : INITIAL_SPARES;
  });

  useEffect(() => {
    localStorage.setItem('spark_spares', JSON.stringify(spares));
  }, [spares]);

  // Bookings state
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('spark_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem('spark_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Customer enquiries state
  const [enquiries, setEnquiries] = useState(() => {
    const saved = localStorage.getItem('spark_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  useEffect(() => {
    localStorage.setItem('spark_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const saved = sessionStorage.getItem('spark_admin_auth');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    sessionStorage.setItem('spark_admin_auth', JSON.stringify(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [adminLoginError, setAdminLoginError] = useState('');

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

  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Catalog State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Tracking Code Input
  const [searchTrackingCode, setSearchTrackingCode] = useState('SC-77301');
  const [trackedBooking, setTrackedBooking] = useState(bookings[0]);

  // Admin New Part Form State
  const [newPartData, setNewPartData] = useState({
    name: '',
    category: 'Engine',
    price: '',
    stock: '',
    desc: ''
  });

  // Listen to secret URL hash changes for admin privacy
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setActiveTab(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login');
      } else if (hash === '#home' || hash === '') {
        setActiveTab('home');
      } else if (hash === '#catalog') {
        setActiveTab('catalog');
      } else if (hash === '#services' && showGarage) {
        setActiveTab('services');
      } else if (hash === '#tracking' && showGarage) {
        setActiveTab('tracking');
      } else if (hash === '#contact') {
        setActiveTab('contact');
      } else if (hash === '#book' && showGarage) {
        setActiveTab('book');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check initial hash on mount
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminLoggedIn, showGarage]);

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
    setEnquiries(prev => [newEnquiry, ...prev]);
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
  const filteredProducts = spares.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          part.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || part.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Engine', 'Brakes', 'Filters', 'Controls', 'Fluids', 'Electrical', 'Drivetrain'];

  // Switch Screen logic
  const switchScreen = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'admin-login' || tabName === 'admin-dashboard') {
      window.location.hash = 'admin';
    } else {
      window.location.hash = tabName;
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Admin login handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCredentials.email === 'admin@sparkcraft.com' && adminCredentials.password === 'admin123') {
      setIsAdminLoggedIn(true);
      setAdminLoginError('');
      switchScreen('admin-dashboard');
    } else {
      setAdminLoginError('Invalid admin credentials.');
    }
  };

  // Add Part handler
  const handleAddPart = (e) => {
    e.preventDefault();
    const newPart = {
      id: Date.now(),
      name: newPartData.name,
      category: newPartData.category,
      price: parseFloat(newPartData.price),
      stock: parseInt(newPartData.stock),
      rating: 5.0,
      desc: newPartData.desc
    };
    setSpares(prev => [...prev, newPart]);
    setNewPartData({ name: '', category: 'Engine', price: '', stock: '', desc: '' });
    alert('New Spare Part successfully added to inventory catalog!');
  };

  // Update spares values directly
  const handleUpdateStock = (id, newStock) => {
    setSpares(prev => prev.map(item => item.id === id ? { ...item, stock: Math.max(0, parseInt(newStock)) } : item));
  };

  const handleUpdatePrice = (id, newPrice) => {
    setSpares(prev => prev.map(item => item.id === id ? { ...item, price: Math.max(0, parseFloat(newPrice)) } : item));
  };

  // Delete spare part
  const handleDeletePart = (id) => {
    if (confirm('Are you sure you want to delete this part from inventory?')) {
      setSpares(prev => prev.filter(item => item.id !== id));
    }
  };

  // Update Booking Status index
  const handleUpdateStatus = (code, index) => {
    const updated = bookings.map(b => b.code === code ? { ...b, statusIndex: parseInt(index) } : b);
    setBookings(updated);
    if (trackedBooking && trackedBooking.code === code) {
      setTrackedBooking(prev => ({ ...prev, statusIndex: parseInt(index) }));
    }
  };

  // Delete Booking
  const handleDeleteBooking = (code) => {
    if (confirm(`Cancel and delete booking ${code}?`)) {
      setBookings(prev => prev.filter(b => b.code !== code));
    }
  };

  // Resolve Enquiry
  const handleResolveEnquiry = (id) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, resolved: !e.resolved } : e));
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
            
            {/* Admin panel link is hidden from navbar entirely for privacy, but remains in local state if authenticated */}
            {isAdminLoggedIn && (
              <button 
                onClick={() => switchScreen('admin-dashboard')} 
                style={activeTab === 'admin-dashboard' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}
              >
                Admin Panel
              </button>
            )}
          </div>

          <div style={styles.navActions}>
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
            {isAdminLoggedIn && (
              <button 
                onClick={() => { setIsAdminLoggedIn(false); switchScreen('home'); }} 
                className="btn-secondary" 
                style={{ padding: '0.5rem 0.8rem', display: 'flex', gap: '0.25rem', height: '40px', alignItems: 'center' }}
              >
                <LogOut size={16} />
                Exit
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

        {/* SCREEN 2: Services (Only shown if Garage is Active) */}
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
                <h3 style={styles.serviceCardTitle}>Suspension Tuning & Seals</h3>
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

        {/* SCREEN 4: Live Status Tracker (Only shown if Garage is Active) */}
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
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8.0rem' }}>Toll Free parts line</p>
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

        {/* SCREEN 7: Admin Login */}
        {activeTab === 'admin-login' && (
          <section className="animate-fade-in-up" style={{ maxWidth: '440px', margin: '2rem auto 4rem' }}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionSubtitle}>PORTAL</span>
              <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>ADMIN LOGIN</h2>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ ...styles.contactIconCircle, width: '48px', height: '48px' }}>
                  <Lock size={22} color="var(--primary)" />
                </div>
              </div>

              {adminLoginError && (
                <div style={styles.errorAlert}>
                  <AlertCircle size={16} />
                  <span>{adminLoginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                  <label style={styles.formLabel}>Admin Email</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="admin@sparkcraft.com"
                    value={adminCredentials.email}
                    onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                  <label style={styles.formLabel}>Password</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                  <Unlock size={16} />
                  Authenticate
                </button>
              </form>

              <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                <strong>Access Instruction:</strong><br />
                To access this page privately in the future, type <code>#admin</code> at the end of the website URL.
              </div>
            </div>
          </section>
        )}

        {/* SCREEN 8: Admin Dashboard Panel */}
        {isAdminLoggedIn && activeTab === 'admin-dashboard' && (
          <section className="animate-fade-in-up">
            <div style={styles.adminDashboardHeader}>
              <div>
                <span style={styles.sectionSubtitle}>CONTROL BOARD</span>
                <h2 style={{ fontSize: '2rem', textAlign: 'left' }}>SPARK CRAFT OPERATIONS</h2>
              </div>
              
              {/* Garage toggle controller */}
              <div className="glass-panel" style={styles.adminTogglePanel}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wrench size={18} color={showGarage ? 'var(--success)' : 'var(--text-muted)'} />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Garage Services Clinic</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status: {showGarage ? 'LIVE ON STORE' : 'HIDDEN / COMING SOON'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowGarage(!showGarage)}
                  className="btn-primary" 
                  style={{ 
                    padding: '0.4rem 0.8rem', 
                    fontSize: '0.8rem',
                    background: showGarage ? 'var(--success)' : 'var(--primary)'
                  }}
                >
                  {showGarage ? 'Deactivate Garage' : 'Activate Garage Live'}
                </button>
              </div>
            </div>

            {/* Dashboard metrics grid */}
            <div style={styles.adminMetricsGrid}>
              <div className="glass-panel" style={styles.adminMetricCard}>
                <DollarSign size={20} color="var(--primary)" />
                <div>
                  <span style={styles.adminMetricLabel}>SIMULATED SALES</span>
                  <h4 style={styles.adminMetricVal}>$14,849.20</h4>
                </div>
              </div>

              <div className="glass-panel" style={styles.adminMetricCard}>
                <Package size={20} color="var(--info)" />
                <div>
                  <span style={styles.adminMetricLabel}>INVENTORY PARTS</span>
                  <h4 style={styles.adminMetricVal}>{spares.length} Items</h4>
                </div>
              </div>

              <div className="glass-panel" style={styles.adminMetricCard}>
                <Inbox size={20} color="var(--warning)" />
                <div>
                  <span style={styles.adminMetricLabel}>CONTACT INQUIRIES</span>
                  <h4 style={styles.adminMetricVal}>{enquiries.filter(e => !e.resolved).length} Pending</h4>
                </div>
              </div>

              <div className="glass-panel" style={styles.adminMetricCard}>
                <Layers size={20} color="var(--success)" />
                <div>
                  <span style={styles.adminMetricLabel}>ACTIVE BOOKINGS</span>
                  <h4 style={styles.adminMetricVal}>{bookings.length} Reservation Slots</h4>
                </div>
              </div>
            </div>

            {/* Main Admin Section Grid */}
            <div style={styles.adminSectionLayout}>
              
              {/* Left Column: Inventory list & Add Spares form */}
              <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>Store Catalog Inventory</h3>
                  
                  <div style={styles.adminTableContainer}>
                    <table style={styles.adminTable}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Category</th>
                          <th style={styles.th}>Price ($)</th>
                          <th style={styles.th}>Stock</th>
                          <th style={styles.th}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {spares.map(part => (
                          <tr key={part.id} style={styles.tr}>
                            <td style={{ ...styles.td, fontWeight: 'bold' }}>{part.name}</td>
                            <td style={styles.td}>{part.category}</td>
                            <td style={styles.td}>
                              <input 
                                type="number" 
                                step="0.01"
                                value={part.price}
                                onChange={(e) => handleUpdatePrice(part.id, e.target.value)}
                                style={styles.adminTableInput}
                              />
                            </td>
                            <td style={styles.td}>
                              <input 
                                type="number" 
                                value={part.stock}
                                onChange={(e) => handleUpdateStock(part.id, e.target.value)}
                                style={styles.adminTableInput}
                              />
                            </td>
                            <td style={styles.td}>
                              <button onClick={() => handleDeletePart(part.id)} style={styles.deleteBtn}>
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>Add New Spare Part</h3>
                  <form onSubmit={handleAddPart} style={styles.adminAddForm}>
                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Part Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Ohlins Rear Shock"
                          value={newPartData.name}
                          onChange={(e) => setNewPartData({...newPartData, name: e.target.value})}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Category</label>
                        <select 
                          value={newPartData.category}
                          onChange={(e) => setNewPartData({...newPartData, category: e.target.value})}
                        >
                          {categories.filter(c => c !== 'All').map(cat => (
                            <option key={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Price ($)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          required 
                          placeholder="e.g. 299.99"
                          value={newPartData.price}
                          onChange={(e) => setNewPartData({...newPartData, price: e.target.value})}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Stock Count</label>
                        <input 
                          type="number" 
                          required 
                          placeholder="e.g. 5"
                          value={newPartData.stock}
                          onChange={(e) => setNewPartData({...newPartData, stock: e.target.value})}
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Description</label>
                      <textarea 
                        required 
                        rows="2" 
                        placeholder="Description of the spare part and compatibility..."
                        value={newPartData.desc}
                        onChange={(e) => setNewPartData({...newPartData, desc: e.target.value})}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                      <Plus size={16} />
                      Add Part to Live Catalog
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Bookings list & Enquiries */}
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Bookings panel */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>Bike Service Reservations</h3>
                  {bookings.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'left' }}>No bookings reserved.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {bookings.map(b => (
                        <div key={b.code} style={styles.adminBookingCard}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>{b.code}</span>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{b.bikeModel}</h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Owner: {b.name} ({b.phone})</p>
                            </div>
                            <button onClick={() => handleDeleteBooking(b.code)} style={styles.deleteBtn}>
                              <X size={16} />
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem', background: 'rgba(17,24,39,0.02)', padding: '0.5rem', borderRadius: '4px' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Update Live Status:</p>
                            <select 
                              value={b.statusIndex}
                              onChange={(e) => handleUpdateStatus(b.code, e.target.value)}
                              style={{ padding: '0.25rem', fontSize: '0.8rem', background: '#fff' }}
                            >
                              {STATUS_STEPS.map((step, idx) => (
                                <option key={step.key} value={idx}>{step.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer messages panel */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>Customer Inbox</h3>
                  {enquiries.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'left' }}>No emails or enquiries in inbox.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {enquiries.map(enq => (
                        <div key={enq.id} style={{
                          ...styles.adminEnquiryCard,
                          borderLeftColor: enq.resolved ? 'var(--success)' : 'var(--warning)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>{enq.subject}</span>
                            <button 
                              onClick={() => handleResolveEnquiry(enq.id)} 
                              style={{
                                background: 'none', 
                                border: 'none', 
                                color: enq.resolved ? 'var(--success)' : 'var(--text-muted)', 
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <Check size={14} />
                              {enq.resolved ? 'Resolved' : 'Mark Resolved'}
                            </button>
                          </div>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{enq.name}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{enq.email}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.5rem', background: '#fff', padding: '0.5rem', borderRadius: '4px' }}>"{enq.message}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#EF4444',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    textAlign: 'left',
    marginBottom: '1rem'
  },
  adminDashboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1.5rem'
  },
  adminTogglePanel: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '12px'
  },
  adminMetricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    marginBottom: '2.5rem',
    textAlign: 'left'
  },
  adminMetricCard: {
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  adminMetricLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: 'bold',
    letterSpacing: '0.05em'
  },
  adminMetricVal: {
    fontSize: '1.35rem',
    fontWeight: 'bold',
    color: '#111827',
    marginTop: '0.15rem'
  },
  adminSectionLayout: {
    display: 'flex',
    gap: '2.5rem'
  },
  adminTableContainer: {
    overflowX: 'auto',
    marginTop: '0.5rem'
  },
  adminTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.85rem'
  },
  th: {
    borderBottom: '2px solid var(--border)',
    padding: '0.75rem 0.5rem',
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  tr: {
    borderBottom: '1px solid var(--border)'
  },
  td: {
    padding: '0.75rem 0.5rem',
    color: 'var(--text-main)'
  },
  adminTableInput: {
    width: '70px',
    padding: '0.35rem',
    fontSize: '0.8rem',
    background: '#fff'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#EF4444',
    cursor: 'pointer',
    padding: '0.25rem',
    transition: 'color 0.2s'
  },
  adminAddForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    textAlign: 'left'
  },
  adminBookingCard: {
    background: 'rgba(17,24,39,0.01)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'left'
  },
  adminEnquiryCard: {
    background: 'rgba(17,24,39,0.01)',
    border: '1px solid var(--border)',
    borderLeftWidth: '4px',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'left'
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
