import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Wrench, 
  Calendar, 
  Plus, 
  Trash2, 
  X, 
  Check, 
  Lock, 
  Unlock, 
  LogOut, 
  DollarSign, 
  Package, 
  Layers, 
  Inbox,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import './index.css';

// INITIAL BIKE DATA DEFINITION
const INITIAL_BRAND_LOGOS = {
  'ROYAL ENFIELD': '',
  'TVS': '',
  'BMW': '',
  'KTM': '',
  'YAMAHA': '',
  'HUSQVARNA': '',
  'BAJAJ': '',
  'KAWASAKI': '',
  'BENELLI': '',
  'PIAGGIO': '',
  'HERO': '',
  'DUCATI': '',
  'HONDA': '',
  'OLA': '',
  'Harley davidson': '',
  'Suzuki': '',
  'Triumph': '',
  'Ather': '',
  'Jawa': ''
};

const INITIAL_BIKE_BRANDS = {
  'ROYAL ENFIELD': [
    'Classic 350', 'Classic 500', 'Meteor 350', 'Himalayan 450', 
    'Guerrilla 450', 'Super Meteor 650', 'Himalayan 411', 'Scram 411', 
    'Interceptor 650', 'Continental GT 650', 'Hunter 350', 'Thunderbird 350',
    'Thunderbird 500', 'Classic reborn 350'
  ],
  'TVS': [
    'Apachr RTX 300', 'Apache RR 310', 'Apache RTR 310', 'Apache RTR 200', 'Apache 160'
  ],
  'BMW': [
    'GS 310', '310 R', 'S 1000 RR', 'F 450 GS'
  ],
  'KTM': [
    'Duke 125', 'Duke 200', 'Duke 250', 'Duke 390', 'RC 125', 'RC 200', 
    'RC 390', 'Adventure 250', 'Adventure 390', 'Adventure 390 (2025)', 'DUKE 250 (GEN 3)'
  ],
  'YAMAHA': [
    'XSR 155', 'Aerox', 'R15 V1', 'R15 V2', 'R15 V3', 'R15 V4', 
    'MT 15', 'MT 09', 'FZ 16', 'FZ-X', 'FZ 250', 'FZ V2',
    'YZF-R1M', 'YZF-R1', 'YZF-R3'
  ],
  'HUSQVARNA': [
    'Svartpilen 401', 'Vitpilen 401'
  ],
  'BAJAJ': [
    'Pulsar NS 200', 'Pulsar RS 200', 'Pulsar NS 160', 'Dominar 400', 
    'Dominar 250', 'Pulsar 220F', 'Pulsar NS 400', 'Pulsar N160'
  ],
  'KAWASAKI': [
    'Ninja 650', 'Ninja 400', 'Ninja ZX-14R', 'Ninja ZX-10R', 'Ninja ZX-6R', 
    'Ninja H2R', 'Vulcan S', 'Vulcan 900 Classic', 'Versys 650', 'Versys 1000', 
    'Z400', 'Z650', 'Z800', 'Z900', 'Z1000'
  ],
  'BENELLI': [
    'TNT 300', 'TNT 600i', 'TNT 899', 'TRK 502', 'TRK 502X', 'Imperiale 400'
  ],
  'PIAGGIO': [
    'Aprilia SR 125', 'Aprilia SR 150', 'Aprilia SR 160', 'Aprilia SXR', 
    'Aprilia storm 125', 'Aprilia Storm 150', 'Aprilia Storm 160', 
    'Vespa SXL 125', 'Vespa VXL 125', 'Aprilia RS 457'
  ],
  'HERO': [
    'Xpulse 200', 'Xpulse 210'
  ],
  'DUCATI': [
    'Panigale', 'Scrambler 800', 'Monster', 'Multistrada', 'Diavel 1260'
  ],
  'HONDA': [
    'H\'ness 350', 'CBR 150', 'CBR 250', 'CBR 650', 'CB 350RS', 'CB 300', 'CBR 1000 RR'
  ],
  'OLA': [],
  'Harley davidson': [],
  'Suzuki': [
    'V strom SX 250', 'Gixxer SF 250', 'Burgman'
  ],
  'Triumph': [
    'Speed 400', 'Scrambler 400X'
  ],
  'Ather': [],
  'Jawa': [
    'JAWA 42', 'Jawa bobber'
  ]
};

// Initial Mock spare parts catalog data
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
  { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', subject: 'Bulk Order Discount', message: 'Looking to purchase 10 packs of NGK Iridium spark plugs. Do you offer bulk trade discounts?', resolved: true }
];

function AdminPortal() {
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

  // Bike Brands state
  const [bikeBrands, setBikeBrands] = useState(() => {
    const saved = localStorage.getItem('spark_bike_brands');
    const parsed = saved ? JSON.parse(saved) : {};
    const merged = { ...INITIAL_BIKE_BRANDS };
    for (const [brand, models] of Object.entries(parsed)) {
      if (merged[brand]) {
        merged[brand] = [...new Set([...merged[brand], ...models])];
      } else {
        merged[brand] = models;
      }
    }
    localStorage.setItem('spark_bike_brands', JSON.stringify(merged));
    return merged;
  });

  useEffect(() => {
    localStorage.setItem('spark_bike_brands', JSON.stringify(bikeBrands));
  }, [bikeBrands]);

  // Brand Management State
  const [brandLogos, setBrandLogos] = useState(() => {
    const saved = localStorage.getItem('spark_brand_logos');
    const parsed = saved ? JSON.parse(saved) : {};
    const merged = { ...INITIAL_BRAND_LOGOS, ...parsed };
    localStorage.setItem('spark_brand_logos', JSON.stringify(merged));
    return merged;
  });

  useEffect(() => {
    localStorage.setItem('spark_brand_logos', JSON.stringify(brandLogos));
  }, [brandLogos]);

  const [brandOrder, setBrandOrder] = useState(() => {
    const saved = localStorage.getItem('spark_brand_order');
    if (saved) return JSON.parse(saved);
    const defaultOrder = Object.keys(INITIAL_BIKE_BRANDS);
    localStorage.setItem('spark_brand_order', JSON.stringify(defaultOrder));
    return defaultOrder;
  });

  useEffect(() => {
    localStorage.setItem('spark_brand_order', JSON.stringify(brandOrder));
  }, [brandOrder]);

  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandModel, setNewBrandModel] = useState('');
  const [newModelInputs, setNewModelInputs] = useState({});

  // Add Product State
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', price: '', stock: '', desc: '', images: ''
  });

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (!newBrandName.trim() || !newBrandModel.trim()) return;
    const brandName = newBrandName.toUpperCase();
    if (bikeBrands[brandName]) {
      alert('Brand already exists!');
      return;
    }
    setBikeBrands(prev => ({
      ...prev,
      [brandName]: [newBrandModel]
    }));
    setBrandOrder(prev => {
      if (prev.includes(brandName)) return prev;
      return [...prev, brandName];
    });
    setNewBrandName('');
    setNewBrandModel('');
  };

  const handleDeleteBrand = (brand) => {
    if (confirm(`Are you sure you want to delete ${brand}? This removes all its models.`)) {
      const newBrands = { ...bikeBrands };
      delete newBrands[brand];
      setBikeBrands(newBrands);
      setBrandOrder(prev => prev.filter(b => b !== brand));
    }
  };

  const handleMoveBrandUp = (index) => {
    if (index === 0) return;
    const newOrder = [...brandOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setBrandOrder(newOrder);
  };

  const handleMoveBrandDown = (index) => {
    if (index === brandOrder.length - 1) return;
    const newOrder = [...brandOrder];
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    setBrandOrder(newOrder);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const newId = Date.now();
    const imageList = newProduct.images ? newProduct.images.split(',').map(url => url.trim()).filter(url => url !== '') : [];
    const product = {
      id: newId,
      name: newProduct.name,
      category: newProduct.category || 'General',
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
      desc: newProduct.desc || '',
      images: imageList,
      rating: 5.0,
      compatibility: [] // Can be edited later
    };
    setSpares(prev => [product, ...prev]);
    setNewProduct({ name: '', category: '', price: '', stock: '', desc: '', images: '' });
  };

  const handleAddModel = (brand) => {
    const model = newModelInputs[brand];
    if (!model || !model.trim()) return;
    if (bikeBrands[brand].includes(model)) return;
    setBikeBrands(prev => ({
      ...prev,
      [brand]: [...prev[brand], model]
    }));
    setNewModelInputs(prev => ({ ...prev, [brand]: '' }));
  };

  const handleDeleteModel = (brand, model) => {
    if (confirm(`Remove ${model} from ${brand}?`)) {
      setBikeBrands(prev => ({
        ...prev,
        [brand]: prev[brand].filter(m => m !== model)
      }));
    }
  };

  const handleUpdateLogo = (brand, url) => {
    setBrandLogos(prev => ({
      ...prev,
      [brand]: url
    }));
  };

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

  // Admin New Part Form State
  const [newPartData, setNewPartData] = useState({
    name: '',
    category: 'Engine',
    price: '',
    stock: '',
    desc: ''
  });
  const [compatCheckboxes, setCompatCheckboxes] = useState([]);

  // Admin login handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCredentials.email === 'admin@sparkcraft.com' && adminCredentials.password === 'admin123') {
      setIsAdminLoggedIn(true);
      setAdminLoginError('');
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
      desc: newPartData.desc,
      compatibility: compatCheckboxes
    };
    const updated = [...spares, newPart];
    setSpares(updated);
    setNewPartData({ name: '', category: 'Engine', price: '', stock: '', desc: '' });
    setCompatCheckboxes([]);
    alert('New Spare Part successfully added to inventory catalog!');
  };

  // Toggle compatibility checkbox
  const handleToggleCompat = (bike) => {
    if (compatCheckboxes.includes(bike)) {
      setCompatCheckboxes(prev => prev.filter(b => b !== bike));
    } else {
      setCompatCheckboxes(prev => [...prev, bike]);
    }
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

  const categories = ['Engine', 'Brakes', 'Filters', 'Controls', 'Fluids', 'Electrical', 'Drivetrain'];

  return (
    <>
      <nav style={styles.nav}>
        <div className="app-container" style={styles.navContainer}>
          <div style={styles.logoGroup} onClick={() => window.location.href = '/'}>
            <div style={styles.logoIcon}>
              <Wrench size={22} color="#fff" />
            </div>
            <span style={styles.logoText}>SPARK CRAFT</span>
            <span style={styles.logoBadge}>OPERATIONS PORTAL</span>
          </div>

          <div style={styles.navActions}>
            {isAdminLoggedIn && (
              <button 
                onClick={() => { setIsAdminLoggedIn(false); window.location.href = '/'; }} 
                className="btn-secondary" 
                style={{ padding: '0.5rem 0.8rem', display: 'flex', gap: '0.25rem', height: '40px', alignItems: 'center' }}
              >
                <LogOut size={16} />
                Sign Out & Exit
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="app-container" style={{ padding: '6.5rem 1.5rem 4rem', minHeight: 'calc(100vh - 20rem)' }}>
        {!isAdminLoggedIn ? (
          <section className="animate-fade-in-up" style={{ maxWidth: '440px', margin: '4rem auto' }}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionSubtitle}>PORTAL LOCK</span>
              <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>AUTHENTICATE OPERATOR</h2>
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
            </div>
          </section>
        ) : (
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
                  
                  {/* Add Product Form */}
                  <div style={{ marginBottom: '2rem', background: 'rgba(17,24,39,0.02)', padding: '1.5rem', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Add New Product</h4>
                    <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Name</label>
                          <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Category</label>
                          <input type="text" required value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Price ($)</label>
                          <input type="number" step="0.01" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Stock Quantity</label>
                          <input type="number" required value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Description</label>
                        <textarea value={newProduct.desc} onChange={(e) => setNewProduct({...newProduct, desc: e.target.value})} rows="2" style={{ padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }}></textarea>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Images (Comma-separated URLs)</label>
                        <input type="text" placeholder="https://image1.jpg, https://image2.jpg" value={newProduct.images} onChange={(e) => setNewProduct({...newProduct, images: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }} />
                      </div>
                      <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.6rem 1.5rem', marginTop: '0.5rem' }}>Add Product</button>
                    </form>
                  </div>
                  
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
                        {(spares || []).map(part => (
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
                          {(categories || []).map(cat => (
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

                    {/* Bike Compatibility checklist */}
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Bike Compatibility</label>
                      <div style={styles.checkboxGrid}>
                        {Object.entries(bikeBrands).map(([brand, bikes]) => (
                          <div key={brand} style={{ marginBottom: '0.75rem' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem' }}>{brand}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              {(bikes || []).map(bike => (
                                <label key={bike} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                                  <input 
                                    type="checkbox"
                                    checked={compatCheckboxes.includes(bike)}
                                    onChange={() => handleToggleCompat(bike)}
                                  />
                                  <span>{bike}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
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

                <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>Manage Bike Brands & Models</h3>
                  
                  {/* Add Brand Form */}
                  <form onSubmit={handleAddBrand} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem', background: 'rgba(17,24,39,0.02)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>New Brand Name</label>
                      <input 
                        type="text" required placeholder="e.g. DUCATI" 
                        value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} 
                        style={{ padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }} 
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Initial Model</label>
                      <input 
                        type="text" required placeholder="e.g. Panigale V4" 
                        value={newBrandModel} onChange={(e) => setNewBrandModel(e.target.value)} 
                        style={{ padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }} 
                      />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1rem' }}><Plus size={16} /> Add Brand</button>
                  </form>

                  {/* Existing Brands List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {(brandOrder || []).filter(b => bikeBrands && bikeBrands[b]).map((brand, index) => {
                      const models = bikeBrands[brand] || [];
                      return (
                      <div key={brand} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {brandLogos[brand] ? (
                              <img src={brandLogos[brand]} alt={brand} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            ) : (
                              <div style={{ width: '40px', height: '40px', background: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#999' }}>No Logo</div>
                            )}
                            <h4 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{brand}</h4>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button onClick={() => handleMoveBrandUp(index)} disabled={index === 0} style={{ background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }} title="Move Up"><ChevronUp size={16} /></button>
                            <button onClick={() => handleMoveBrandDown(index)} disabled={index === brandOrder.length - 1} style={{ background: 'none', border: 'none', cursor: index === brandOrder.length - 1 ? 'not-allowed' : 'pointer', opacity: index === brandOrder.length - 1 ? 0.3 : 1 }} title="Move Down"><ChevronDown size={16} /></button>
                            <button onClick={() => handleDeleteBrand(brand)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '1rem' }}><Trash2 size={14} /> Delete</button>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Logo URL:</label>
                          <input 
                            type="text" placeholder="https://..." 
                            value={brandLogos[brand] || ''} 
                            onChange={(e) => handleUpdateLogo(brand, e.target.value)}
                            style={{ flex: 1, padding: '0.4rem', border: '1px solid #eee', borderRadius: '4px', fontSize: '0.8rem' }}
                          />
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                          {(models || []).map(model => (
                            <span key={model} style={{ background: '#f5f5f5', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {model} 
                              <button onClick={() => handleDeleteModel(brand, model)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                            </span>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="text" placeholder="Add new model..." 
                            value={newModelInputs[brand] || ''} 
                            onChange={(e) => setNewModelInputs(prev => ({ ...prev, [brand]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddModel(brand)}
                            style={{ flex: 1, padding: '0.4rem', border: '1px solid #eee', borderRadius: '4px', fontSize: '0.85rem' }}
                          />
                          <button onClick={() => handleAddModel(brand)} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 0.75rem', cursor: 'pointer' }}><Plus size={14} /></button>
                        </div>
                      </div>
                      );
                    })}
                  </div>
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
                      {(bookings || []).map(b => (
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
                      {(enquiries || []).map(enq => (
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

      <footer style={styles.footer}>
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
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
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
  formLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-muted)'
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
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    padding: '1rem',
    borderRadius: '8px'
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
    padding: '2rem 0',
    background: '#FFFFFF',
    marginTop: '6rem'
  },
  footerBottom: {
    paddingTop: '1rem',
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  }
};

createRoot(document.getElementById('admin-root')).render(
  <StrictMode>
    <AdminPortal />
  </StrictMode>
);
