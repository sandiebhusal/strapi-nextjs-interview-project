import React from 'react';
import styles from '../../styles/Layout.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/">MyWebsite</a>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/blogs">Blogs</a></li>
          <li><a href="/videos">Videos</a></li>
        </ul>
      </nav>
      <div className={`${styles.cta} d-none d-md-block`}>
        <a href="/" className={styles.button}>Contact US</a>
      </div>
    </header>
  );
}
