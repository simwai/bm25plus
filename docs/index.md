---
layout: home
hero:
  name: bm25plus
  text: A Modern BM25+ Search Library
  tagline: Fast, typed, and respectful of your main thread.
  image:
    src: /banner.svg
    alt: bm25plus banner
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: API Reference
      link: /api/
features:
  - title: Algorithmically Superior
    details: Okapi BM25 with a delta constant. No more penalizing long documents.
  - title: Thread-Friendly
    details: Offload the heavy lifting to Web Workers with a built-in executor.
  - title: Persistent
    details: Keep your index alive across reloads with IndexedDB (powered by Dexie).
---

## Why BM25+?

Standard BM25 can be a bit of a bully to long documents. **bm25plus** fixes that with a simple `delta` parameter that levels the playing field. It's the search algorithm you deserve, implemented in a way that makes sense in 2024.

[Quick Start Guide](/guide/) | [Read the README](https://github.com/simwai/bm25plus)
