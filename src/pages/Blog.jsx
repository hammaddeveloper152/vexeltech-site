import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SecondaryLayout from '../components/SecondaryLayout.jsx';

/* ─────────────────────────────────────────────────────────────────
   BLOG DATA  —  5 pillar posts, long-tail SEO keyword titles
───────────────────────────────────────────────────────────────── */
const POSTS = [
  {
    id: 1,
    slug: 'how-much-does-a-website-cost-for-small-business',
    featured: true,
    category: 'Web Dev Tips',
    title: 'How Much Does a Website Cost for a Small Business in 2025?',
    excerpt:
      'Templates, freelancers, agencies, or a custom build — the real answer depends on what your business actually needs to convert visitors into paying clients.',
    author: 'VexelTech Team',
    date: 'Aug 15, 2026',
    readTime: '7 min read',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    tags: ['Web Development', 'Pricing', 'Small Business']
  },
  {
    id: 2,
    slug: 'branding-vs-logo-design-difference',
    featured: true,
    category: 'Branding Tips',
    title: 'Branding vs. Logo Design: What Is the Actual Difference?',
    excerpt:
      'A logo is one file. A brand is the repeatable visual and messaging system that makes a company recognizable everywhere buyers encounter it.',
    author: 'VexelTech Team',
    date: 'Aug 10, 2026',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    tags: ['Branding', 'Identity', 'Design Strategy']
  },
  {
    id: 3,
    slug: 'why-your-website-is-not-converting',
    featured: true,
    category: 'Business Growth',
    title: 'Why Your Website Is Not Converting (And How to Fix It Fast)',
    excerpt:
      'The credibility gaps, slow load times, and missing follow-up paths that make a polished homepage underperform in production.',
    author: 'VexelTech Team',
    date: 'Aug 5, 2026',
    readTime: '8 min read',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['CRO', 'Web Strategy', 'Growth']
  },
  {
    id: 4,
    slug: 'what-is-marketing-automation-for-small-business',
    featured: false,
    category: 'Business Growth',
    title: 'What Is Marketing Automation and Do Small Businesses Actually Need It?',
    excerpt:
      'A plain-language breakdown of which automation tools deliver ROI in the first 90 days versus which ones just add complexity.',
    author: 'VexelTech Team',
    date: 'Jul 28, 2026',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80',
    tags: ['Automation', 'Marketing', 'Efficiency']
  },
  {
    id: 5,
    slug: 'how-to-pick-a-web-design-agency-small-business',
    featured: false,
    category: 'Web Dev Tips',
    title: 'How to Pick a Web Design Agency as a Small Business Owner',
    excerpt:
      'The five questions you must ask before signing any contract — and the red flags that signal you are about to spend money on the wrong partner.',
    author: 'VexelTech Team',
    date: 'Jul 20, 2026',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    tags: ['Agency Selection', 'Web Development']
  },
  {
    id: 6,
    slug: 'local-seo-strategy-small-business',
    featured: false,
    category: 'Business Growth',
    title: 'Local SEO Strategy for Small Business: Rank in Your City Without Paying for Ads',
    excerpt:
      'The organic search levers every local service business should pull before spending a single dollar on Google Ads.',
    author: 'VexelTech Team',
    date: 'Jul 14, 2026',
    readTime: '9 min read',
    img: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=800&q=80',
    tags: ['SEO', 'Local Business', 'Marketing']
  },
  {
    id: 7,
    slug: 'rebrand-case-study-conversion-lift',
    featured: false,
    category: 'Case Studies',
    title: 'Case Study: How a Full Rebrand Lifted Inbound Leads by 3x in 90 Days',
    excerpt:
      'A behind-the-scenes breakdown of the strategy, design decisions, and technical execution that drove measurable growth for a Houston-based service company.',
    author: 'VexelTech Team',
    date: 'Jul 5, 2026',
    readTime: '10 min read',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
    tags: ['Case Study', 'Branding', 'Results']
  },
  {
    id: 8,
    slug: 'best-cms-platform-small-business-2025',
    featured: false,
    category: 'Web Dev Tips',
    title: 'WordPress vs. Webflow vs. Custom Build: Which Is Best for a Small Business?',
    excerpt:
      'An honest comparison of the three major CMS approaches with specific guidance on which fits your budget, team size, and growth stage.',
    author: 'VexelTech Team',
    date: 'Jun 28, 2026',
    readTime: '7 min read',
    img: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80',
    tags: ['CMS', 'WordPress', 'Webflow']
  }
];

const CATEGORIES = ['All', 'Web Dev Tips', 'Branding Tips', 'Business Growth', 'Case Studies'];

const CATEGORY_COLORS = {
  'Web Dev Tips':    { bg: '#e8f0fe', color: '#1a56db' },
  'Branding Tips':  { bg: '#fdf4e7', color: '#b45309' },
  'Business Growth':{ bg: '#ecfdf5', color: '#047857' },
  'Case Studies':   { bg: '#f5f3ff', color: '#6d28d9' },
};

/* ─────────────────────────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────────────────────────── */
function CategoryPill({ cat }) {
  const style = CATEGORY_COLORS[cat] || { bg: 'var(--concrete)', color: 'var(--steel)' };
  return (
    <span style={{
      display: 'inline-block',
      background: style.bg,
      color: style.color,
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: '4px',
      fontFamily: 'var(--mono)'
    }}>
      {cat}
    </span>
  );
}

function PostCard({ post, large = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        border: '1px solid var(--line)',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 48px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
        cursor: 'pointer'
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '100%',
        height: large ? '260px' : '200px',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        background: 'var(--concrete)'
      }}>
        <img
          src={post.img}
          alt={post.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'scale(1.06)' : 'scale(1)'
          }}
        />
        {/* Category overlay badge */}
        <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
          <CategoryPill cat={post.category} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: large ? '28px 28px 24px' : '22px 22px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          className={large ? 'h-md' : ''}
          style={{
            fontSize: large ? '22px' : '17px',
            fontFamily: 'var(--disp)',
            fontWeight: '700',
            color: 'var(--ink)',
            lineHeight: '1.3',
            marginBottom: '10px',
            transition: 'color 0.2s',
            color: hovered ? 'var(--amber)' : 'var(--ink)'
          }}
        >
          {post.title}
        </h3>
        <p style={{
          color: 'var(--steel)',
          fontSize: large ? '15px' : '13.5px',
          lineHeight: '1.6',
          margin: '0 0 auto 0',
          paddingBottom: '20px'
        }}>
          {post.excerpt}
        </p>

        {/* Meta footer */}
        <div style={{
          borderTop: '1px solid var(--line)',
          paddingTop: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Author avatar placeholder */}
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ color: 'var(--amber)', fontSize: '11px', fontWeight: '800', fontFamily: 'var(--mono)' }}>V</span>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--ink)', fontFamily: 'var(--mono)', lineHeight: 1 }}>{post.author}</div>
              <div style={{ fontSize: '11px', color: 'var(--steel)', marginTop: '2px' }}>{post.date}</div>
            </div>
          </div>
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: '11px',
            color: 'var(--steel)',
            background: 'var(--concrete)',
            padding: '3px 8px',
            borderRadius: '3px'
          }}>
            {post.readTime}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────────── */
export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [emailVal, setEmailVal] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filtered = activeCategory === 'All'
    ? POSTS
    : POSTS.filter(p => p.category === activeCategory);

  const featuredPosts = filtered.filter(p => p.featured);
  const restPosts = filtered.filter(p => !p.featured);

  return (
    <SecondaryLayout
      title="Ideas Worth Sharing — VexelTech Blog"
      description="Practical ideas about website cost, branding vs logo design, marketing automation, and conversion strategy for startup founders and small business owners."
    >

      {/* ══════════════════════════════════════════════════════
          1. DARK HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: 'clamp(72px,10vw,112px) 0 clamp(60px,8vw,88px)' }}>
        <div className="wrap">
          {/* Badge pill */}
          <div style={{ display: 'flex', marginBottom: '24px' }}>
            <span style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--beacon)',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: '50px',
              fontFamily: 'var(--mono)'
            }}>
              ✓ FOUNDER RESOURCES &nbsp;•&nbsp; FIELD NOTES
            </span>
          </div>

          <h1 className="h-xl" style={{ color: '#ffffff', marginBottom: '20px', maxWidth: '900px' }}>
            IDEAS WORTH SHARING<span style={{ color: 'var(--beacon)' }}>.</span>
          </h1>

          <p className="lede" style={{ color: 'var(--text-d)', maxWidth: '680px', fontSize: '19px', lineHeight: '1.65', marginBottom: '40px' }}>
            Short, specific guidance on website costs, brand strategy, marketing automation, and conversion — written for founders who build in public.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
            {[
              { num: '8+', label: 'Published Articles' },
              { num: '4',  label: 'Content Categories' },
              { num: '5m', label: 'Avg. Read Time' }
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--disp)', fontWeight: '800', fontSize: '28px', color: '#fff', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--steel)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. CATEGORY FILTER BAR
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid var(--line)', position: 'sticky', top: '72px', zIndex: 50 }}>
        <div className="wrap" style={{ padding: '0' }}>
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '18px 22px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '2px solid var(--amber)' : '2px solid transparent',
                    fontFamily: 'var(--mono)',
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--ink)' : 'var(--steel)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s, border-color 0.2s'
                  }}
                >
                  {cat}
                  <span style={{
                    marginLeft: '7px',
                    background: isActive ? 'var(--amber)' : 'var(--concrete)',
                    color: isActive ? 'var(--ink)' : 'var(--steel)',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '1px 6px',
                    borderRadius: '20px',
                    transition: 'background 0.2s, color 0.2s'
                  }}>
                    {cat === 'All' ? POSTS.length : POSTS.filter(p => p.category === cat).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. FEATURED POSTS GRID
      ══════════════════════════════════════════════════════ */}
      {featuredPosts.length > 0 && (
        <section className="band" style={{ background: '#ffffff', padding: 'clamp(56px,8vw,96px) 0 clamp(40px,6vw,64px)' }}>
          <div className="wrap">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="label">Featured Articles</span>
                <h2 className="h-lg" style={{ marginBottom: 0 }}>
                  Pillar posts for founders<span style={{ color: 'var(--amber)' }}>.</span>
                </h2>
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--steel)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {featuredPosts.length} article{featuredPosts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Featured: 1 large hero post + 2 sidebar posts */}
            {activeCategory === 'All' && featuredPosts.length >= 3 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {/* Large featured card spanning 2 cols on desktop */}
                <div style={{ gridColumn: 'span 2' }}>
                  <PostCard post={featuredPosts[0]} large />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {featuredPosts.slice(1, 3).map(p => <PostCard key={p.id} post={p} />)}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {featuredPosts.map(p => <PostCard key={p.id} post={p} large />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          4. ALL / RECENT POSTS GRID
      ══════════════════════════════════════════════════════ */}
      {restPosts.length > 0 && (
        <section className="band band--concrete" style={{ background: 'var(--concrete)', padding: 'clamp(56px,8vw,96px) 0' }}>
          <div className="wrap">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="label">Recent Articles</span>
                <h2 className="h-lg" style={{ marginBottom: 0 }}>
                  More from the field<span style={{ color: 'var(--amber)' }}>.</span>
                </h2>
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--steel)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {restPosts.length} article{restPosts.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {restPosts.map(p => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Empty state when filtered to 0 */}
      {filtered.length === 0 && (
        <section className="band" style={{ padding: '96px 0', textAlign: 'center' }}>
          <div className="wrap">
            <span style={{ fontSize: '48px' }}>✍️</span>
            <h2 className="h-md" style={{ marginTop: '16px', marginBottom: '8px' }}>Articles in this category are coming soon</h2>
            <p style={{ color: 'var(--steel)' }}>Check back shortly — we publish weekly.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="btn btn--go"
              style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', padding: '14px 28px' }}
            >
              View All Articles
            </button>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          5. NEWSLETTER SIGNUP — mid-page authority block
      ══════════════════════════════════════════════════════ */}
      <section className="band band--ink" style={{ background: 'var(--ink)', padding: 'clamp(56px,8vw,96px) 0' }}>
        <div className="wrap">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            {/* Copy */}
            <div>
              <span style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--beacon)',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '5px 12px',
                borderRadius: '50px',
                fontFamily: 'var(--mono)',
                marginBottom: '20px'
              }}>
                ✓ WEEKLY DISPATCH
              </span>
              <h2 className="h-lg" style={{ color: '#ffffff', marginBottom: '12px' }}>
                One idea, four expressions<span style={{ color: 'var(--beacon)' }}>.</span>
              </h2>
              <p style={{ color: 'var(--text-d)', fontSize: '16px', lineHeight: '1.65', maxWidth: '420px' }}>
                Every week we publish one strategic insight on brand, web, or growth — written to repurpose directly into your LinkedIn posts, Instagram captions, and email newsletters.
              </p>
              <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
                {['No spam', 'Unsubscribe any time', 'Founder-authored'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--beacon)', fontWeight: '800' }}>✓</span>
                    <span style={{ color: 'var(--steel)', fontSize: '13px', fontFamily: 'var(--mono)' }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div style={{
              background: 'var(--ink-2)',
              border: '1px solid var(--line-d)',
              borderRadius: '4px',
              padding: '36px'
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🎉</span>
                  <h3 className="h-md" style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>You're in.</h3>
                  <p style={{ color: 'var(--text-d)', fontSize: '14px' }}>Expect your first dispatch this week.</p>
                </div>
              ) : (
                <>
                  <h3 className="h-md" style={{ color: '#ffffff', fontSize: '20px', marginBottom: '6px' }}>Get the weekly dispatch</h3>
                  <p style={{ color: 'var(--steel)', fontSize: '13px', marginBottom: '24px' }}>Join 400+ founders reading VexelTech's weekly brief.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="Your first name"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--line-d)',
                        borderRadius: '3px',
                        padding: '13px 16px',
                        color: '#fff',
                        fontSize: '14px',
                        fontFamily: 'var(--body)',
                        outline: 'none',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                    <input
                      type="email"
                      value={emailVal}
                      onChange={e => setEmailVal(e.target.value)}
                      placeholder="Your email address"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--line-d)',
                        borderRadius: '3px',
                        padding: '13px 16px',
                        color: '#fff',
                        fontSize: '14px',
                        fontFamily: 'var(--body)',
                        outline: 'none',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      onClick={() => { if (emailVal) setSubmitted(true); }}
                      className="btn btn--go"
                      style={{ width: '100%', padding: '14px', fontWeight: '700', justifyContent: 'center', marginTop: '4px' }}
                    >
                      Subscribe — It's Free
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. TOPIC CLUSTER CARDS — what we cover
      ══════════════════════════════════════════════════════ */}
      <section className="band" style={{ background: '#ffffff', padding: 'clamp(56px,8vw,96px) 0' }}>
        <div className="wrap">
          <span className="label">Content Categories</span>
          <h2 className="h-lg" style={{ marginBottom: '36px' }}>
            What we write about<span style={{ color: 'var(--amber)' }}>.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
            {[
              {
                cat: 'Web Dev Tips',
                icon: '⚙️',
                desc: 'Website costs, CMS comparisons, performance tuning, and technical architecture for non-technical founders.',
                count: POSTS.filter(p => p.category === 'Web Dev Tips').length
              },
              {
                cat: 'Branding Tips',
                icon: '🎨',
                desc: 'Brand identity, logo systems, typography, color strategy, and the measurable ROI of consistent visual design.',
                count: POSTS.filter(p => p.category === 'Branding Tips').length
              },
              {
                cat: 'Business Growth',
                icon: '📈',
                desc: 'Conversion rate strategy, SEO for local businesses, marketing automation, and lead funnel optimization.',
                count: POSTS.filter(p => p.category === 'Business Growth').length
              },
              {
                cat: 'Case Studies',
                icon: '📋',
                desc: 'Real numbers and behind-the-scenes breakdowns of client projects that delivered measurable results.',
                count: POSTS.filter(p => p.category === 'Case Studies').length
              }
            ].map(item => (
              <button
                key={item.cat}
                onClick={() => { setActiveCategory(item.cat); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  padding: '28px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }}>{item.icon}</span>
                <h3 style={{ fontFamily: 'var(--disp)', fontWeight: '700', fontSize: '17px', color: 'var(--ink)', marginBottom: '8px' }}>{item.cat}</h3>
                <p style={{ color: 'var(--steel)', fontSize: '13px', lineHeight: '1.55', margin: '0 0 16px 0' }}>{item.desc}</p>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--amber)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {item.count} article{item.count !== 1 ? 's' : ''} →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. CTA BLOCK
      ══════════════════════════════════════════════════════ */}
      <section className="band band--ink" style={{ background: 'var(--ink)', padding: 'clamp(64px,8vw,96px) 0' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <span className="label" style={{ color: 'var(--beacon)' }}>START A PROJECT</span>
            <h2 className="h-lg" style={{ color: '#ffffff', marginBottom: '8px' }}>
              Ready to put these ideas into practice<span style={{ color: 'var(--beacon)' }}>?</span>
            </h2>
            <p className="lede" style={{ color: 'var(--text-d)', margin: 0, maxWidth: '520px' }}>
              Bring us your homepage, your offer, or just your problem. We will tell you what we would fix first — no pitch deck required.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/contact-us" className="btn btn--go" style={{ padding: '16px 32px', fontWeight: '700' }}>
              Get a Free Site Review
            </Link>
            <Link to="/services" className="btn btn--line" style={{ padding: '16px 32px', border: '1px solid var(--line-d)', color: '#fff' }}>
              View Services
            </Link>
          </div>
        </div>
      </section>

    </SecondaryLayout>
  );
}
