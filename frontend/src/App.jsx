import { useEffect, useMemo, useState } from 'react'

const CREATORS_API_URL = 'http://127.0.0.1:8000/api/creators'
const creatorColors = ['peach', 'blue', 'violet', 'mint', 'rose', 'gold']

function formatRate(rate) {
  if (typeof rate === 'number') {
    return new Intl.NumberFormat('en').format(rate)
  }

  return rate
}

function normalizeCreator(record, index) {
  const requiredStrings = ['name', 'specialization', 'content_type', 'bio']
  const isObject = record !== null && typeof record === 'object' && !Array.isArray(record)

  if (
    !isObject ||
    requiredStrings.some((field) => typeof record[field] !== 'string' || !record[field].trim()) ||
    !Array.isArray(record.skills) ||
    !record.skills.every((skill) => typeof skill === 'string') ||
    !Array.isArray(record.tools) ||
    !record.tools.every((tool) => typeof tool === 'string') ||
    !(
      (typeof record.rate === 'number' && Number.isFinite(record.rate)) ||
      (typeof record.rate === 'string' && record.rate.trim())
    )
  ) {
    throw new Error(`Creator record ${index + 1} is missing one or more expected fields.`)
  }

  return {
    id: record.id ?? `${record.name}-${index}`,
    name: record.name,
    specialization: record.specialization,
    skills: record.skills,
    tools: record.tools,
    contentType: record.content_type,
    rate: formatRate(record.rate),
    bio: record.bio,
    initials: record.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase(),
    color: creatorColors[index % creatorColors.length],
  }
}

function formatContentType(contentType) {
  return contentType
    .split(/[_\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const steps = [
  {
    number: '01',
    title: 'Find your people',
    description: 'Explore independent AI creators by craft, content type, or the tools they love.',
  },
  {
    number: '02',
    title: 'Make the connection',
    description: 'Get inspired by their work and find the creative partner behind your next big idea.',
  },
  {
    number: '03',
    title: 'Create something good',
    description: 'Bring your brief to life with human imagination and a little help from AI.',
  },
]

function SparkleIcon({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"
        fill="currentColor"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  )
}

function App() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [search, setSearch] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [contentType, setContentType] = useState('')
  const [selectedCreator, setSelectedCreator] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const specializations = useMemo(
    () => [...new Set(creators.map((creator) => creator.specialization))],
    [creators],
  )
  const contentTypes = useMemo(
    () => [...new Set(creators.map((creator) => creator.contentType))],
    [creators],
  )

  const filteredCreators = useMemo(() => {
    const query = search.trim().toLowerCase()

    return creators.filter((creator) => {
      const matchesSearch =
        !query ||
        [creator.name, creator.specialization, creator.contentType, ...creator.skills, ...creator.tools]
          .some((value) => value.toLowerCase().includes(query))

      return (
        matchesSearch &&
        (!specialization || creator.specialization === specialization) &&
        (!contentType || creator.contentType === contentType)
      )
    })
  }, [creators, search, specialization, contentType])

  useEffect(() => {
    const controller = new AbortController()

    async function loadCreators() {
      setLoading(true)
      setLoadError('')

      try {
        const response = await fetch(CREATORS_API_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`The server responded with status ${response.status}.`)
        }

        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('The API response should be a list of creator records.')
        }

        setCreators(data.map(normalizeCreator))
      } catch (error) {
        if (controller.signal.aborted) return

        setCreators([])
        setLoadError(
          `Could not load creators. Check that the FastAPI server is running at ${CREATORS_API_URL} and try again. ${
            error instanceof Error ? error.message : 'An unexpected network error occurred.'
          }`,
        )
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadCreators()
    return () => controller.abort()
  }, [retryCount])

  useEffect(() => {
    if (!selectedCreator) return undefined

    function closeOnEscape(event) {
      if (event.key === 'Escape') setSelectedCreator(null)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedCreator])

  function clearFilters() {
    setSearch('')
    setSpecialization('')
    setContentType('')
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a aria-label="CreativAI home" className="brand" href="#home">
          <span className="brand-mark"><SparkleIcon /></span>
          <span>Creativ<span className="brand-accent">AI</span></span>
        </a>
        <nav aria-label="Main navigation" className={`main-nav${mobileNavOpen ? ' is-open' : ''}`} id="main-navigation">
          <a href="#creators" onClick={() => setMobileNavOpen(false)}>Discover Creators</a>
          <a href="#how-it-works" onClick={() => setMobileNavOpen(false)}>Find Projects</a>
        </nav>
        <button
          aria-controls="main-navigation"
          aria-expanded={mobileNavOpen}
          aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
          className="mobile-menu"
          onClick={() => setMobileNavOpen((open) => !open)}
          type="button"
        >
          <span />
          <span />
        </button>
        <a className="button button-nav" href="#creators">Get started <span aria-hidden="true">↗</span></a>
      </header>

      <main>
        <section aria-labelledby="hero-title" className="hero-section" id="home">
          <div className="hero-glow hero-glow-purple" />
          <div className="hero-glow hero-glow-cyan" />
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-dot" /> THE CREATIVE MARKETPLACE, REIMAGINED</div>
            <h1 id="hero-title">Where Brands Meet<br /><span>AI Creativity</span></h1>
            <p className="hero-copy">
              Big ideas deserve brilliant collaborators. Meet the independent creators blending human imagination with the power of AI.
            </p>
            <form
              className="hero-search"
              onSubmit={(event) => {
                event.preventDefault()
                document.querySelector('#creators')?.scrollIntoView({ behavior: 'smooth' })
              }}
              role="search"
            >
              <SearchIcon />
              <label className="sr-only" htmlFor="creator-search">Search creators, skills, or AI tools</label>
              <input
                id="creator-search"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Try “3D artist” or “Midjourney”"
                type="search"
                value={search}
              />
              <button className="button search-button" type="submit">Find your creator <span aria-hidden="true">→</span></button>
            </form>
            <div className="hero-note">
              <div aria-hidden="true" className="avatar-stack">
                <span className="stack-avatar stack-one">M</span>
                <span className="stack-avatar stack-two">J</span>
                <span className="stack-avatar stack-three">A</span>
              </div>
              <span>Made for creative teams who think <em>a little differently.</em></span>
            </div>
          </div>
          <div aria-hidden="true" className="hero-orbit">
            <div className="orbit-ring orbit-ring-one" />
            <div className="orbit-ring orbit-ring-two" />
            <div className="orbit-core"><SparkleIcon /></div>
            <span className="orbit-chip orbit-chip-one">✳ Visuals</span>
            <span className="orbit-chip orbit-chip-two">♪ Sound</span>
            <span className="orbit-chip orbit-chip-three">◈ Motion</span>
            <span className="orbit-spark orbit-spark-one">✦</span>
            <span className="orbit-spark orbit-spark-two">✧</span>
          </div>
          <a className="scroll-cue" href="#creators"><span /> SCROLL TO EXPLORE</a>
        </section>

        <section aria-labelledby="creators-title" className="creators-section section-wrap" id="creators">
          <div className="section-heading">
            <div>
              <p className="section-kicker">A NEW KIND OF CREATIVE PARTNER</p>
              <h2 id="creators-title">Meet your next <span>co-creator.</span></h2>
              <p className="section-description">Independent minds. Imaginative work. A whole new way to make things happen.</p>
            </div>
            <div aria-live="polite" className="creator-count">
              <span>{loading ? '…' : filteredCreators.length.toString().padStart(2, '0')}</span>
              {loading ? ' loading creators' : ' creators to explore'}
            </div>
          </div>

          <div aria-label="Filter creators" className="filter-bar">
            <label className="filter-search">
              <SearchIcon />
              <span className="sr-only">Search creators</span>
              <input
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search names, skills, tools..."
                type="search"
                value={search}
              />
            </label>
            <label className="select-wrap">
              <span className="sr-only">Filter by specialization</span>
              <select onChange={(event) => setSpecialization(event.target.value)} value={specialization}>
                <option value="">All specializations</option>
                {specializations.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="select-wrap">
              <span className="sr-only">Filter by content type</span>
              <select onChange={(event) => setContentType(event.target.value)} value={contentType}>
                <option value="">All content types</option>
                {contentTypes.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <button className="clear-button" onClick={clearFilters} type="button">Clear filters <span aria-hidden="true">↺</span></button>
          </div>

          {loading ? (
            <div aria-live="polite" className="creator-state" role="status">
              <span aria-hidden="true" className="loading-spinner" />
              <span>Finding your creative collaborators…</span>
            </div>
          ) : loadError ? (
            <div aria-live="assertive" className="creator-state load-error" role="alert">
              <span aria-hidden="true" className="error-mark">!</span>
              <h3>Creators couldn’t be loaded</h3>
              <p>{loadError}</p>
              <button className="button empty-button" onClick={() => setRetryCount((count) => count + 1)} type="button">
                Retry <span aria-hidden="true">↻</span>
              </button>
            </div>
          ) : filteredCreators.length > 0 ? (
            <div aria-live="polite" className="creator-grid">
              {filteredCreators.map((creator) => (
                <article className="creator-card" key={creator.id}>
                  <div className={`creator-art art-${creator.color}`}>
                    <span className="art-orb art-orb-one" />
                    <span className="art-orb art-orb-two" />
                    <span className="art-label">CREATIVAI CREATOR</span>
                    <span aria-hidden="true" className="creator-initials">{creator.initials}</span>
                    <span aria-hidden="true" className="art-sparkle">✳</span>
                  </div>
                  <div className="creator-card-content">
                    <div className="creator-heading">
                      <h3>{creator.name}</h3>
                    </div>
                    <span className="specialty-tag">{creator.specialization}</span>
                    <p className="creator-bio">{creator.bio}</p>
                    <div className="creator-detail">
                      <span className="detail-label">AI TOOLKIT</span>
                      <div className="tag-list">
                        {creator.tools.map((tool) => <span className="tool-tag" key={tool}>{tool}</span>)}
                      </div>
                    </div>
                    <div className="creator-detail">
                      <span className="detail-label">SKILLS</span>
                      <div className="skill-list">
                        {creator.skills.map((skill) => <span key={skill}>{skill}</span>)}
                      </div>
                    </div>
                    <div className="card-footer">
                      <div>
                        <span className="detail-label">CREATES</span>
                        <span className="content-type">{formatContentType(creator.contentType)}</span>
                      </div>
                      <div className="rate-block">
                        <span className="detail-label">RATE</span>
                        <span className="creator-rate">{creator.rate}</span>
                      </div>
                    </div>
                    <button
                      className="portfolio-button"
                      onClick={() => setSelectedCreator(creator)}
                      type="button"
                    >
                      View portfolio <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div aria-live="polite" className="empty-state">
              <span aria-hidden="true" className="empty-icon"><SearchIcon /></span>
              <h3>{creators.length === 0 ? 'No creators are available yet' : 'No creators found just yet'}</h3>
              <p>
                {creators.length === 0
                  ? 'The backend returned an empty creator list. Check back when profiles are available.'
                  : 'Try another search or clear your filters to meet all our creators.'}
              </p>
              {creators.length > 0 && (
                <button className="button empty-button" onClick={clearFilters} type="button">Clear all filters</button>
              )}
            </div>
          )}
        </section>

        <section aria-labelledby="how-title" className="how-section" id="how-it-works">
          <div className="section-wrap">
            <div className="how-heading">
              <p className="section-kicker">LESS SCROLLING. MORE MAKING.</p>
              <h2 id="how-title">Good things happen <span>together.</span></h2>
              <p className="section-description">The right collaboration can change everything. Here's how to find yours.</p>
            </div>
            <div className="steps-grid">
              {steps.map((step) => (
                <article className="step-card" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <span aria-hidden="true" className="step-arrow">↗</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
            <div className="how-cta">
              <span>Ready to make something that matters?</span>
              <a className="button" href="#creators">Meet the creators <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a aria-label="CreativAI home" className="brand" href="#home">
          <span className="brand-mark"><SparkleIcon /></span>
          <span>Creativ<span className="brand-accent">AI</span></span>
        </a>
        <p>Discover Talent. Create Impact.</p>
        <span className="footer-note">A marketplace for what's next <span aria-hidden="true">✳</span></span>
      </footer>

      {selectedCreator && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedCreator(null)
          }}
        >
          <section aria-labelledby="portfolio-title" aria-modal="true" className="portfolio-modal" role="dialog">
            <button
              aria-label="Close portfolio"
              className="modal-close"
              onClick={() => setSelectedCreator(null)}
              type="button"
            >×</button>
            <div className={`modal-art art-${selectedCreator.color}`}>
              <span aria-hidden="true" className="creator-initials">{selectedCreator.initials}</span>
              <SparkleIcon />
            </div>
            <div className="profile-heading">
              <div>
                <p className="section-kicker">{formatContentType(selectedCreator.contentType)} CREATOR</p>
                <h2 id="portfolio-title">{selectedCreator.name}</h2>
              </div>
              <span className="specialty-tag">{selectedCreator.specialization}</span>
            </div>
            <div className="profile-intro">
              <p>{selectedCreator.bio}</p>
            </div>

            <div className="profile-details">
              <div className="profile-detail-group">
                <span className="detail-label">AI TOOLKIT</span>
                <div className="tag-list">
                  {selectedCreator.tools.map((tool) => <span className="tool-tag" key={tool}>{tool}</span>)}
                </div>
              </div>
              <div className="profile-detail-group">
                <span className="detail-label">SKILLS</span>
                <div className="profile-skills">
                  {selectedCreator.skills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </div>
              <div className="profile-rate">
                <span className="detail-label">RATE</span>
                <strong>{selectedCreator.rate}</strong>
              </div>
            </div>

            <div className="portfolio-heading">
              <div>
                <p className="section-kicker">PORTFOLIO PREVIEW</p>
                <h3>Creator profile</h3>
              </div>
              <span>From live backend data</span>
            </div>
            <div className={`portfolio-data-preview art-${selectedCreator.color}`}>
              <span aria-hidden="true" className="preview-shape" />
              <div>
                <span className="preview-content-type">{formatContentType(selectedCreator.contentType)}</span>
                <strong>{selectedCreator.specialization}</strong>
                <span>{selectedCreator.name} · {selectedCreator.rate}</span>
              </div>
            </div>
            <p className="modal-note">Project samples will appear here when portfolio details are added to the backend creator data.</p>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
