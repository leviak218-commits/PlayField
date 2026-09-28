import { useMemo, useState } from 'react'
import './App.css'

const games = [
  { id: 1, title: 'Ashenfall', studio: 'Northstar Works', category: 'Adventure', price: 39.99, oldPrice: 59.99, rating: '9.2', tag: 'BEST SELLER', image: 'photo-1518709268805-4e9042af9f23', color: '#a25c3a' },
  { id: 2, title: 'Neon Divide', studio: 'Afterglow Interactive', category: 'Action', price: 29.99, rating: '8.8', tag: 'NEW RELEASE', image: 'photo-1519608487953-e999c86e7455', color: '#576eb4' },
  { id: 3, title: 'The Last Meridian', studio: 'Fieldwork', category: 'RPG', price: 49.99, oldPrice: 69.99, rating: '9.5', tag: '−28%', image: 'photo-1470770841072-f978cf4d019e', color: '#628451' },
  { id: 4, title: 'Ironbound', studio: 'Copperhead Studio', category: 'Strategy', price: 24.99, rating: '8.4', tag: 'POPULAR', image: 'photo-1511497584788-876760111969', color: '#896b54' },
  { id: 5, title: 'Wild Current', studio: 'Blue Hour Games', category: 'Adventure', price: 34.99, rating: '8.9', tag: 'JUST ADDED', image: 'photo-1500530855697-b586d89ba3ee', color: '#527b83' },
  { id: 6, title: 'Starward', studio: 'Orbit Assembly', category: 'RPG', price: 44.99, oldPrice: 54.99, rating: '9.0', tag: '−18%', image: 'photo-1462331940025-496dfbfc7564', color: '#5b5a83' },
  { id: 7, title: 'Breakwater', studio: 'Lowtide', category: 'Action', price: 19.99, rating: '8.1', tag: 'UNDER $20', image: 'photo-1518837695005-2083093ee35b', color: '#436777' },
  { id: 8, title: 'Greenhouse Zero', studio: 'Small Hours', category: 'Strategy', price: 14.99, rating: '8.7', tag: 'PLAYER FAVORITE', image: 'photo-1448375240586-882707db888b', color: '#668052' },
]

const featured = [
  { title: 'A world left behind.', name: 'ASHENFALL', copy: 'The old roads are gone. Find your own way home.', price: '$39.99', image: 'photo-1470770841072-f978cf4d019e', badge: 'OUT NOW · NORTHSTAR WORKS' },
  { title: 'The city never sleeps.', name: 'NEON DIVIDE', copy: 'One last job. A thousand ways it can go wrong.', price: '$29.99', image: 'photo-1519608487953-e999c86e7455', badge: 'NEW RELEASE · AFTERGLOW INTERACTIVE' },
  { title: 'Beyond the known.', name: 'STARWARD', copy: 'Build a future worth coming back to.', price: '$44.99', image: 'photo-1462331940025-496dfbfc7564', badge: 'EDITOR’S PICK · ORBIT ASSEMBLY' },
]

const categories = ['All games', 'Action', 'Adventure', 'RPG', 'Strategy']

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.4 4.4" /></>,
    bag: <><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    left: <><path d="m15 18-6-6 6-6" /></>,
    right: <><path d="m9 18 6-6-6-6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All games')
  const [slide, setSlide] = useState(0)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filteredGames = useMemo(() => games.filter((game) => {
    const matchesCategory = category === 'All games' || game.category === category
    const matchesQuery = `${game.title} ${game.studio} ${game.category}`.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  }), [category, query])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  function addToCart(game) {
    setOrderPlaced(false)
    setCart((current) => {
      const existing = current.find((item) => item.id === game.id)
      return existing
        ? current.map((item) => item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...game, quantity: 1 }]
    })
  }

  function changeQuantity(id, amount) {
    setCart((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0))
  }

  const activeFeature = featured[slide]

  return (
    <div className="store-shell">
      <div className="announcement"><span>THE WEEKEND EDIT</span> Fresh finds for your next long session <a href="#catalog">Explore deals <Icon name="arrow" size={14} /></a></div>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Playfield home"><span className="mark">P</span><span>playfield<span className="wordmark-dot">.</span></span></a>
        <button className="mobile-menu icon-button" aria-label="Toggle navigation" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Icon name="menu" /></button>
        <nav className={mobileMenuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a className="nav-link active" href="#catalog" onClick={() => setMobileMenuOpen(false)}>Discover</a>
          <a className="nav-link" href="#catalog" onClick={() => setMobileMenuOpen(false)}>Browse</a>
          <a className="nav-link" href="#deals" onClick={() => setMobileMenuOpen(false)}>Deals <span className="nav-new">-30%</span></a>
          <a className="nav-link" href="#footer" onClick={() => setMobileMenuOpen(false)}>Community</a>
        </nav>
        <div className="header-tools">
          <label className="header-search"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find your next game" aria-label="Search games" /></label>
          <button className="cart-trigger" aria-label={`Open cart, ${cartCount} items`} onClick={() => setCartOpen(true)}><Icon name="bag" size={19} /><span className="cart-label">Cart</span>{cartCount > 0 && <span className="cart-count">{cartCount}</span>}</button>
          <button className="profile-button" aria-label="Your profile">JD</button>
        </div>
      </header>

      <main id="top">
        <section className="hero-wrap" aria-label="Featured games">
          <div className="hero" style={{ '--hero-image': `url(https://images.unsplash.com/${activeFeature.image}?auto=format&fit=crop&w=2000&q=85)` }}>
            <div className="hero-shade" />
            <div className="hero-copy" key={slide}>
              <span className="eyebrow"><span className="live-dot" /> {activeFeature.badge}</span>
              <p className="hero-kicker">{activeFeature.title}</p>
              <h1>{activeFeature.name}</h1>
              <p className="hero-description">{activeFeature.copy}</p>
              <div className="hero-actions"><a className="button button-bright" href="#catalog">Explore the game <Icon name="arrow" size={17} /></a><span className="hero-price">From <strong>{activeFeature.price}</strong></span></div>
            </div>
            <div className="hero-controls"><div className="slide-count"><span>0{slide + 1}</span><i />03</div><div className="hero-arrows"><button aria-label="Previous featured game" className="icon-button" onClick={() => setSlide((slide + featured.length - 1) % featured.length)}><Icon name="left" /></button><button aria-label="Next featured game" className="icon-button" onClick={() => setSlide((slide + 1) % featured.length)}><Icon name="right" /></button></div></div>
          </div>
          <div className="hero-caption"><span>IN THE SPOTLIGHT</span><span>Hand-picked for your next adventure <b>↗</b></span></div>
        </section>

        <section className="quick-picks" aria-label="Store highlights">
          <a href="#catalog" className="quick-pick"><span className="pick-number">01</span><span><strong>Good games, good prices</strong><small>Deals worth your time</small></span><Icon name="arrow" size={16} /></a>
          <a href="#catalog" className="quick-pick"><span className="pick-number">02</span><span><strong>Find your next favorite</strong><small>Curated, not crowded</small></span><Icon name="arrow" size={16} /></a>
          <a href="#footer" className="quick-pick"><span className="pick-number">03</span><span><strong>Made for your library</strong><small>Play on your terms</small></span><Icon name="arrow" size={16} /></a>
        </section>

        <section className="catalog-section" id="catalog">
          <div className="section-heading"><div><span className="section-overline">A GOOD PLACE TO START</span><h2>Worth a closer look<span>.</span></h2></div><a className="text-link" href="#catalog">View all games <Icon name="arrow" size={15} /></a></div>
          <div className="catalog-toolbar"><div className="category-tabs" role="tablist" aria-label="Filter by genre">{categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'category-tab selected' : 'category-tab'} onClick={() => setCategory(item)}>{item}</button>)}</div><span className="result-count">{filteredGames.length} GAMES</span></div>
          {filteredGames.length ? <div className="game-grid">{filteredGames.map((game) => <article className="game-card" key={game.id}>
            <a className="game-art" href="#catalog" style={{ '--art-image': `url(https://images.unsplash.com/${game.image}?auto=format&fit=crop&w=900&q=80)`, '--art-color': game.color }} aria-label={`View ${game.title}`}><span className="game-tag">{game.tag}</span><span className="platform-mark">PC</span></a>
            <div className="game-details"><div className="game-meta"><span>{game.category}</span><span className="game-rating"><b>✳</b> {game.rating}</span></div><h3>{game.title}</h3><p className="game-studio">{game.studio}</p><div className="game-buy"><div className="game-price">{game.oldPrice && <del>${game.oldPrice.toFixed(2)}</del>}<strong>${game.price.toFixed(2)}</strong></div><button className="add-button" onClick={() => addToCart(game)} aria-label={`Add ${game.title} to cart`}><Icon name="plus" size={17} /></button></div></div>
          </article>)}</div> : <div className="empty-results"><span>NO MATCHES THIS TIME</span><p>Try another title or genre.</p><button onClick={() => { setQuery(''); setCategory('All games') }}>Clear filters</button></div>}
        </section>

        <section className="deals-banner" id="deals"><div className="deal-graphic"><span>PLAY</span><span>MORE</span></div><div className="deal-copy"><span className="section-overline">A LITTLE EXTRA PLAYTIME</span><h2>More game.<br /><em>Less spend.</em></h2><p>Fresh prices on a few worlds we think you’ll love.</p><a href="#catalog" className="button button-dark">See what’s on sale <Icon name="arrow" size={16} /></a></div><div className="deal-side-note">THE WEEKEND EDIT<br /><b>VOL. 04 / 2026</b></div></section>
      </main>

      <footer id="footer" className="footer"><a className="wordmark footer-mark" href="#top"><span className="mark">P</span><span>playfield<span className="wordmark-dot">.</span></span></a><span className="footer-note">Good games. No noise.</span><span className="footer-copy">© 2025 PLAYFIELD DIGITAL</span></footer>

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()} aria-label="Shopping cart"><div className="drawer-heading"><div><span className="section-overline">YOUR NEXT ADVENTURE</span><h2>Your cart<span>.</span></h2></div><button className="icon-button" aria-label="Close cart" onClick={() => setCartOpen(false)}><Icon name="close" /></button></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><div className="cart-thumb" style={{ '--art-image': `url(https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=180&q=75)` }} /><div className="cart-item-copy"><strong>{item.title}</strong><span>${item.price.toFixed(2)}</span><div className="quantity-control"><button aria-label={`Remove one ${item.title}`} onClick={() => changeQuantity(item.id, -1)}><Icon name="minus" size={14} /></button><span>{item.quantity}</span><button aria-label={`Add one ${item.title}`} onClick={() => changeQuantity(item.id, 1)}><Icon name="plus" size={14} /></button></div></div><strong className="cart-line-total">${(item.price * item.quantity).toFixed(2)}</strong></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>${cartTotal.toFixed(2)}</strong></div><button className="button button-dark checkout-button" onClick={() => { setCart([]); setOrderPlaced(true) }}>Complete demo order <Icon name="arrow" size={16} /></button><p>Demo only. No payment is collected.</p></div></> : <div className="cart-empty"><span className="empty-bag"><Icon name="bag" size={26} /></span><h3>{orderPlaced ? 'You’re all set.' : 'Nothing in here yet.'}</h3><p>{orderPlaced ? 'Your demo order is confirmed. Happy gaming.' : 'Your next favorite is out there.'}</p><button className="button button-dark" onClick={() => { setOrderPlaced(false); setCartOpen(false) }}>{orderPlaced ? 'Back to the store' : 'Explore games'} <Icon name="arrow" size={16} /></button></div>}</aside></div>}
    </div>
  )
}

export default App
