import { useEffect, useMemo, useState } from 'react'
import { catalogPriceSnapshot, games } from './data/games.js'
import { steamNews, steamNewsSnapshot } from './data/news.js'
import './Storefront.css'

const genres = ['All games', 'Action', 'Adventure', 'RPG', 'Simulation']
const formatPrice = (price) => `$${price.toFixed(2)}`

function Icon({ name, size = 18 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const shapes = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.4 4.4" /></>,
    bag: <><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  }
  return <svg {...props}>{shapes[name]}</svg>
}

function GameDetails({ game, onClose, onAdd, isOwned, onLibrary }) {
  return (
    <div className="detail-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="detail-sheet" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button className="detail-close" aria-label="Close game details" onClick={onClose}><Icon name="close" /></button>
        <div className="detail-art" style={{ '--detail-image': `url(${game.image})` }}>
          <span className="detail-art-index">STEAM / APP {game.id}</span>
        </div>
        <div className="detail-content">
          <div className="detail-intro">
            <div><span className="detail-eyebrow">{game.category} <span>/</span> PC</span><h2 id="detail-title">{game.title}</h2><p className="detail-byline">Developed by {game.studio}</p></div>
            <div className="detail-purchase"><span><strong>{formatPrice(game.price)}</strong></span>{isOwned ? <button onClick={onLibrary}>Open library <Icon name="arrow" size={16} /></button> : <button onClick={() => onAdd(game)}>Add to cart <Icon name="plus" size={16} /></button>}<a className="steam-source-link" href={game.steamUrl} target="_blank" rel="noreferrer">View on Steam <Icon name="arrow" size={13} /></a></div>
          </div>
          <div className="detail-sections">
            <section><span className="detail-label">01 / THE STORY</span><p>{game.story}</p></section>
            <section><span className="detail-label">02 / THE DEVELOPER</span><p>{game.developer}</p></section>
            <section><span className="detail-label">03 / RELEASE DETAILS</span><dl className="release-data"><div><dt>Release date</dt><dd>{game.release}</dd></div><div><dt>Genre</dt><dd>{game.category}</dd></div><div><dt>Platform</dt><dd>PC</dd></div><div><dt>Steam app ID</dt><dd>{game.id}</dd></div></dl></section>
            <section className="requirements"><span className="detail-label">04 / SYSTEM REQUIREMENTS</span><div className="requirement-columns"><div><h3>Minimum</h3><p>{game.requirements.minimum}</p></div><div><h3>Recommended</h3><p>{game.requirements.recommended}</p></div></div></section>
          </div>
          <p className="detail-disclaimer">{catalogPriceSnapshot}. Prices and availability can change. This demo does not process Steam purchases.</p>
        </div>
      </section>
    </div>
  )
}

function GameCard({ game, index, onDetails, onAdd, isOwned, onLibrary }) {
  return (
    <article className="minimal-game" style={{ '--item-order': index }}>
      <button className="minimal-game-art" onClick={() => onDetails(game)} aria-label={`View ${game.title} details`} style={{ '--cover-image': `url(${game.image})` }}>
        <span className="cover-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="cover-open">View game <Icon name="arrow" size={14} /></span>
      </button>
      <div className="minimal-game-info"><div><h3>{game.title}</h3><p>{game.studio} <span>/</span> {game.category}</p></div><strong className="minimal-price">{formatPrice(game.price)}</strong></div>
      <div className="card-actions"><button className="details-link" onClick={() => onDetails(game)}>Game details <Icon name="arrow" size={14} /></button>{isOwned ? <button className="owned-action" onClick={onLibrary}>In library <Icon name="arrow" size={14} /></button> : <button className="card-add" onClick={() => onAdd(game)} aria-label={`Add ${game.title} to cart`}><Icon name="plus" size={16} /></button>}</div>
    </article>
  )
}

function App() {
  const [view, setView] = useState('discover')
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('All games')
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [selectedGame, setSelectedGame] = useState(null)
  const [cart, setCart] = useState([])
  const [library, setLibrary] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('playfield-library') || '[]')
      return Array.isArray(saved)
        ? saved.map((item) => games.find((game) => game.id === item.id)).filter(Boolean)
        : []
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!selectedGame && !cartOpen && !purchaseSuccess.length) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOverlays = (event) => {
      if (event.key === 'Escape') {
        setSelectedGame(null)
        setCartOpen(false)
        setPurchaseSuccess([])
      }
    }
    window.addEventListener('keydown', closeOverlays)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOverlays)
    }
  }, [selectedGame, cartOpen, purchaseSuccess])

  useEffect(() => {
    window.localStorage.setItem('playfield-library', JSON.stringify(library))
  }, [library])

  const visibleGames = useMemo(() => games.filter((game) => {
    const matchesGenre = genre === 'All games' || game.category === genre
    const matchesQuery = `${game.title} ${game.studio} ${game.category}`.toLowerCase().includes(query.toLowerCase())
    return matchesGenre && matchesQuery
  }), [genre, query])
  const libraryGames = useMemo(() => library.filter((game) => `${game.title} ${game.studio} ${game.category}`.toLowerCase().includes(query.toLowerCase())), [library, query])
  const cartCount = cart.length
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)
  const featuredGames = [games[2], games[0], games[5]]
  const featuredGame = featuredGames[featuredIndex]

  function addToCart(game) {
    if (library.some((item) => item.id === game.id)) return
    setCart((current) => current.some((item) => item.id === game.id) ? current : [...current, game])
  }

  function openLibrary() {
    setView('library')
    setSelectedGame(null)
    setCartOpen(false)
  }

  function completePurchase() {
    const purchased = cart.filter((game) => !library.some((owned) => owned.id === game.id))
    if (!purchased.length) return
    setLibrary((current) => [...current, ...purchased])
    setPurchaseSuccess(purchased)
    setCart([])
    setCartOpen(false)
  }

  return (
    <div className="minimal-store">
      <header className="minimal-header" id="top">
        <a className="minimal-brand" href="#top" aria-label="Playfield home"><span className="brand-symbol">P</span><span>playfield</span></a>
        <button className="minimal-menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}><Icon name="menu" /></button>
        <nav className={menuOpen ? 'minimal-nav nav-open' : 'minimal-nav'} aria-label="Main navigation">
          <button className={view === 'discover' ? 'current' : ''} onClick={() => { setView('discover'); setMenuOpen(false) }}>Discover</button>
          <button className={view === 'games' ? 'current' : ''} onClick={() => { setView('games'); setMenuOpen(false) }}>All games</button>
          <button className={view === 'news' ? 'current' : ''} onClick={() => { setView('news'); setMenuOpen(false) }}>News & upcoming</button>
          <button className={view === 'library' ? 'current' : ''} onClick={() => { setView('library'); setMenuOpen(false) }}>Library <span className="library-count">{library.length}</span></button>
        </nav>
        <div className="minimal-tools">
          <label className="minimal-search" onClick={(event) => { if (event.target.tagName !== 'INPUT') event.currentTarget.querySelector('input').focus() }}><Icon name="search" size={17} /><input aria-label={view === 'library' ? 'Search library' : 'Search games'} placeholder={view === 'library' ? 'Search library' : 'Search games'} value={query} onFocus={() => { if (view !== 'library') setView('games') }} onChange={(event) => { if (view !== 'library') setView('games'); setQuery(event.target.value) }} /></label>
          <button className="minimal-cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} items`}><Icon name="bag" size={18} /><span>Cart</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
        </div>
      </header>

      <main>
        {view === 'discover' && <>
          <section className="minimal-intro">
            <div><span className="minimal-kicker">A STORE FOR YOUR NEXT STORY</span><h1>Find your<br />next world<span>.</span></h1></div>
            <p>Thoughtfully picked games, from the people who made them. Take a look around.</p>
          </section>
          <section className="minimal-feature" aria-label="Featured games slideshow">
            <div className="feature-image" key={featuredGame.id} style={{ '--feature-image': `url(${featuredGame.image})` }} role="img" aria-label={`${featuredGame.title} Steam artwork`} />
            <div className="feature-copy" key={`copy-${featuredGame.id}`}><span className="minimal-kicker">FEATURED / 0{featuredIndex + 1}</span><h2>{featuredGame.title}</h2><p>{featuredGame.story.split('. ')[0].replace(/[.!?]+$/, '')}.</p><button className="plain-link" onClick={() => setSelectedGame(featuredGame)}>Discover the game <Icon name="arrow" size={16} /></button><div className="feature-meta-row"><span className="feature-caption">{featuredGame.title.toUpperCase()} — {featuredGame.studio.toUpperCase()}</span><div className="feature-controls"><div className="feature-dots" aria-label={`Slide ${featuredIndex + 1} of ${featuredGames.length}`}>{featuredGames.map((game, index) => <button key={game.id} aria-label={`Show ${game.title}`} aria-current={index === featuredIndex} onClick={() => setFeaturedIndex(index)} />)}</div><div className="feature-arrows"><button aria-label="Previous featured game" onClick={() => setFeaturedIndex((featuredIndex + featuredGames.length - 1) % featuredGames.length)}>‹</button><button aria-label="Next featured game" onClick={() => setFeaturedIndex((featuredIndex + 1) % featuredGames.length)}>›</button></div></div></div></div>
          </section>
          <section className="discover-picks"><div className="collection-heading"><div><span className="minimal-kicker">A FEW GOOD PLACES TO START</span><h2>Picked for you</h2></div><button className="browse-link" onClick={() => setView('games')}>Browse all games <Icon name="arrow" size={15} /></button></div><div className="minimal-grid discover-grid">{[games[2], games[1], games[5]].map((game, index) => <GameCard key={game.id} game={game} index={index} onDetails={setSelectedGame} onAdd={addToCart} isOwned={library.some((item) => item.id === game.id)} onLibrary={openLibrary} />)}</div></section>
        </>}

        {view === 'games' && <section className="collection games-view" id="collection">
          <div className="collection-heading"><div><span className="minimal-kicker">THE COLLECTION</span><h1>All games</h1></div><span className="collection-total">{String(visibleGames.length).padStart(2, '0')} TITLES</span></div>
          <div className="collection-controls"><div className="genre-list" role="tablist" aria-label="Filter games by genre">{genres.map((item) => <button key={item} role="tab" aria-selected={genre === item} className={genre === item ? 'genre-filter is-selected' : 'genre-filter'} onClick={() => setGenre(item)}>{item}</button>)}</div><span className="sort-label">SORTED BY <strong>OUR PICKS</strong></span></div>
          {visibleGames.length ? <div className="minimal-grid">{visibleGames.map((game, index) => <GameCard key={game.id} game={game} index={index} onDetails={setSelectedGame} onAdd={addToCart} isOwned={library.some((item) => item.id === game.id)} onLibrary={openLibrary} />)}</div> : <div className="minimal-empty"><p>No games match that search.</p><button onClick={() => { setQuery(''); setGenre('All games') }}>Clear filters</button></div>}
        </section>}

        {view === 'library' && <section className="collection library-view"><div className="collection-heading"><div><span className="minimal-kicker">YOUR PURCHASED GAMES</span><h1>My library</h1></div><span className="collection-total">{String(libraryGames.length).padStart(2, '0')} TITLES</span></div>{libraryGames.length ? <div className="library-grid">{libraryGames.map((game) => <article className="library-card" key={game.id}><div className="library-art" style={{ '--cover-image': `url(${game.image})` }} /><div className="library-card-info"><span className="library-owned">OWNED</span><h2>{game.title}</h2><p>{game.studio} · {game.category}</p><button onClick={() => setSelectedGame(game)}>View game details <Icon name="arrow" size={15} /></button></div></article>)}</div> : <div className="library-empty"><span>YOUR LIBRARY IS WAITING</span><h2>{query ? 'No matching games.' : 'No games yet.'}</h2><p>{query ? 'Try another title or clear your search.' : 'Purchased games will appear here, ready for your next session.'}</p><button onClick={() => { setView('games'); setQuery('') }}>Browse all games <Icon name="arrow" size={15} /></button></div>}</section>}

        {view === 'news' && <section className="news-view"><div className="news-heading"><div><span className="minimal-kicker">OFFICIAL STEAM COMMUNITY POSTS</span><h1>News & upcoming<span>.</span></h1></div><p>{steamNewsSnapshot}. These are captured announcement headlines; open Steam for the full post and newest updates.</p></div><div className="news-list">{steamNews.map((item, index) => { const game = games.find((entry) => entry.id === item.appId); return <article className="news-item" key={item.gid}><div className="news-art" style={{ '--news-image': `url(${game.image})` }} /><div className="news-item-copy"><div className="news-meta"><span>STEAM ANNOUNCEMENT · {game.title}</span><time>{item.date}</time></div><h2>{item.title}</h2><p>Posted in the Steam Community feed for {game.title}.</p><a href={`https://steamcommunity.com/games/${item.appId}/announcements/detail/${item.gid}`} target="_blank" rel="noreferrer">Read announcement on Steam <Icon name="arrow" size={14} /></a></div><span className="news-number">{String(index + 1).padStart(2, '0')}</span></article> })}</div></section>}
      </main>

      <footer className="minimal-footer"><a className="minimal-brand" href="#top"><span className="brand-symbol">P</span><span>playfield</span></a><span>Independent games, brought together.</span><span>© 2026 PLAYFIELD</span></footer>

      {selectedGame && <GameDetails game={selectedGame} isOwned={library.some((item) => item.id === selectedGame.id)} onLibrary={openLibrary} onClose={() => setSelectedGame(null)} onAdd={(game) => { addToCart(game); setSelectedGame(null); setCartOpen(true) }} />}
      {cartOpen && <div className="minimal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="minimal-drawer" aria-label="Shopping cart"><div className="drawer-top"><div><span className="minimal-kicker">YOUR SELECTION</span><h2>Your cart <span>({cartCount})</span></h2></div><button className="drawer-close" aria-label="Close cart" onClick={() => setCartOpen(false)}><Icon name="close" /></button></div>{cart.length ? <><div className="minimal-cart-items">{cart.map((item) => <div className="minimal-cart-item" key={item.id}><div className="cart-art" style={{ '--cover-image': `url(${item.image})` }} /><div className="cart-item-data"><strong>{item.title}</strong><span>{formatPrice(item.price)}</span></div><strong>{formatPrice(item.price)}</strong></div>)}</div><div className="minimal-checkout"><div><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div><button onClick={completePurchase}>Purchase games <Icon name="arrow" size={16} /></button><small>Demo storefront. No payment is collected.</small></div></> : <div className="minimal-cart-empty"><Icon name="bag" size={25} /><h3>Your cart is empty.</h3><p>Find something worth playing.</p><button onClick={() => setCartOpen(false)}>Back to the collection</button></div>}</aside></div>}
      {purchaseSuccess.length > 0 && <div className="success-overlay"><section className="success-dialog" role="alertdialog" aria-modal="true" aria-labelledby="purchase-title"><span className="success-check">✓</span><span className="minimal-kicker">ORDER COMPLETE</span><h2 id="purchase-title">Purchase successful</h2><p>{purchaseSuccess.length === 1 ? `${purchaseSuccess[0].title} is now in your library.` : `${purchaseSuccess.length} games are now in your library.`}</p><div className="success-actions"><button className="success-library" onClick={() => { setPurchaseSuccess([]); setView('library') }}>Go to library <Icon name="arrow" size={15} /></button><button className="success-close" onClick={() => setPurchaseSuccess([])}>Continue browsing</button></div></section></div>}
    </div>
  )
}

export default App
