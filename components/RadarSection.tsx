// Blog. PLACEHOLDER posts — production: Shopify blog `articles` query
// (free CMS the client edits from Shopify admin).
import Link from 'next/link';
import { DICT, ROUTES, type Lang } from '@/lib/i18n';
import { POSTS, type Post } from '@/lib/content';
import { Icon } from './Icons';

function PostItem({ post }: { post: Post }) {
  return (
    <a className="ed-item reveal" href="#">
      <span className="tag">
        <Icon name={post.icon} />
        {post.tag}
      </span>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
    </a>
  );
}

export default function RadarSection({ lang, full = false }: { lang: Lang; full?: boolean }) {
  const t = DICT[lang];
  const posts = full ? POSTS[lang] : POSTS[lang].slice(0, 3);

  if (full) {
    return (
      <section className="editorial">
        <div className="container posts-wrap">
          <p className="section-label reveal" style={{ color: 'var(--hueso)' }}>
            {t.radarLabel}
          </p>
          <div className="posts-grid">
            {posts.map((p) => (
              <PostItem key={p.title} post={p} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="editorial" id="radar">
      <div className="container">
        <div className="ed-grid">
          <div className="ed-sticky">
            <p className="section-label reveal" style={{ color: 'var(--hueso)' }}>
              {t.radarLabel}
            </p>
            <h2 className="reveal d1" style={{ marginTop: 40 }}>
              {t.radarH2}
            </h2>
            <p className="reveal d2">{t.radarSub}</p>
            <Link className="more-link light reveal d3" href={ROUTES[lang].radar}>
              {t.radarMore}
            </Link>
          </div>
          <div className="ed-items">
            {posts.map((p) => (
              <PostItem key={p.title} post={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
