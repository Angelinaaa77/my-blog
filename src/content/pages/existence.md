---
title: 'Existence'
description: 'Who am I? Where do I come from? Where am I going?'
updated: 2026-09-06
banner: '/images/signature-03.png'
bannerAlt: 'Angelina Huang’s third handwritten signature'
questions:
  - 'Who am I?'
  - 'Where do I come from?'
  - 'Where am I going?'
---

## Who am I?

<div class="profile-prompts" aria-label="A few things about me">
  <section class="profile-prompt truth-lie-card" data-two-truths data-lie-answer="2">
    <span class="prompt-label">TWO TRUTHS AND A LIE</span>
    <p class="truth-lie-instruction">Which statement do you think is the lie?</p>
    <div class="truth-lie-choices" role="group" aria-label="Choose the statement you think is a lie">
      <button class="truth-lie-choice" type="button" data-truth-lie-guess="1" aria-pressed="false">
        <span class="truth-lie-number">01</span>
        <span>I was an intermediate-level equestrian rider.</span>
      </button>
      <button class="truth-lie-choice" type="button" data-truth-lie-guess="2" aria-pressed="false">
        <span class="truth-lie-number">02</span>
        <span>My original plan was to become a cognitive psychologist.</span>
      </button>
      <button class="truth-lie-choice" type="button" data-truth-lie-guess="3" aria-pressed="false">
        <span class="truth-lie-number">03</span>
        <span>I once scattered peanuts into an air conditioner.</span>
      </button>
    </div>
    <p class="truth-lie-feedback" aria-live="polite"></p>
  </section>
  <section class="profile-prompt profile-facts-card" aria-label="Profile details">
    <div class="profile-facts">
      <div class="profile-fact">
        <span class="prompt-label">LANGUAGES</span>
        <span class="profile-fact-value">English · Mandarin Chinese</span>
      </div>
      <div class="profile-fact">
        <span class="prompt-label">ZODIAC</span>
        <span class="profile-fact-value">Scorpio</span>
      </div>
      <div class="profile-fact">
        <span class="prompt-label">BACKGROUND</span>
        <span class="profile-fact-value">Asian</span>
      </div>
    </div>
  </section>
  <section class="profile-prompt profile-prompt-wide">
    <span class="prompt-label">WHAT MATTERS MOST IN MY LIFE</span>
    <p class="prompt-answer">Game. Romance. The future.</p>
  </section>
  <section class="profile-prompt profile-prompt-wide">
    <span class="prompt-label">QUALITIES I TRY TO CARRY</span>
    <div class="prompt-tags prompt-tags-qualities">
      <span>Preternatural confidence with humility</span>
      <span>Unusual determination with diversified risk</span>
    </div>
  </section>
</div>

## Where do I come from?

<figure class="origin-map" aria-labelledby="origin-map-caption">
  <svg viewBox="0 0 1000 420" role="img" aria-labelledby="map-title map-description">
    <title id="map-title">Flight from Nanjing, China to New York</title>
    <desc id="map-description">A detailed monochrome world map centered on the Pacific, with a great-circle flight route from Nanjing to New York.</desc>
    <defs>
      <pattern id="map-grid" width="50" height="42" patternUnits="userSpaceOnUse">
        <path d="M 50 0 L 0 0 0 42" fill="none" class="map-grid-line" />
      </pattern>
      <marker id="flight-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" class="flight-arrowhead" />
      </marker>
    </defs>
    <rect width="1000" height="420" fill="url(#map-grid)" />
    <g class="map-graticule">
      <path d="M0 70H1000M0 140H1000M0 210H1000M0 280H1000M0 350H1000M139 0V420M222 0V420M306 0V420M389 0V420M472 0V420M556 0V420M639 0V420M722 0V420M806 0V420M889 0V420" />
      <path d="M0 28Q500 88 1000 28M0 392Q500 332 1000 392" />
    </g>
    <g class="map-land"><use href="../images/world-land.svg#world-land" /></g>
    <g class="flight-route">
      <path d="M269 135 C302 111 345 51 427 22 C468 8 529 10 606 25 C658 35 704 71 733 115" marker-end="url(#flight-arrow)" />
    </g>
    <g class="map-marker">
      <circle cx="269" cy="135" r="24" class="map-marker-halo" />
      <path d="M269 135C264 128 249 113 249 101a20 20 0 1 1 40 0c0 12-15 27-20 34Z" class="map-pin-shape" />
      <circle cx="269" cy="101" r="6" class="map-pin-dot" />
      <path d="M269 135L292 160H307" class="map-marker-leader" />
      <text x="314" y="166" class="map-marker-label">NANJING, CHINA</text>
      <text x="314" y="188" class="map-marker-coordinate">32.06° N / 118.80° E</text>
      <circle cx="733" cy="115" r="24" class="map-marker-halo" />
      <path d="M733 115C728 108 713 93 713 81a20 20 0 1 1 40 0c0 12-15 27-20 34Z" class="map-pin-shape" />
      <circle cx="733" cy="81" r="6" class="map-pin-dot" />
      <path d="M733 115L753 150H772" class="map-marker-leader" />
      <text x="780" y="157" class="map-marker-label">NEW YORK, USA</text>
      <text x="780" y="179" class="map-marker-coordinate">40.71° N / 74.01° W</text>
    </g>
    <text x="335" y="96" text-anchor="middle" class="map-continent">ASIA</text>
    <text x="635" y="150" text-anchor="middle" class="map-continent">NORTH AMERICA</text>
    <g class="map-route-card">
      <rect x="16" y="14" width="390" height="56" rx="3" />
      <text x="30" y="38" class="map-route-title">NANJING <tspan>→</tspan> NEW YORK</text>
      <text x="30" y="57" class="map-route-meta">GREAT-CIRCLE FLIGHT / NORTHERN PACIFIC</text>
    </g>
    <text x="20" y="397" class="map-meta">FIG. 02 <tspan>—</tspan> A JOURNEY BETWEEN TWO CITIES</text>
    <text x="980" y="397" text-anchor="end" class="map-meta">LAND DATA: NATURAL EARTH 1:110M</text>
  </svg>
  <figcaption id="origin-map-caption"><span>Nanjing, China</span><span>→</span><span>New York, USA</span><span class="map-caption-note">A flight across the northern Pacific.</span></figcaption>
</figure>

## Where am I going?

<div class="profile-prompts" aria-label="Where I am going">
  <section class="profile-prompt">
    <span class="prompt-label">IDEAL LIFESTYLE</span>
    <p class="prompt-answer">Coffee, game, and money at all hours.</p>
    <p class="prompt-detail">Poker into the night.</p>
  </section>
  <section class="profile-prompt">
    <span class="prompt-label">MY PRINCIPLE OF WEALTH</span>
    <p class="prompt-answer">Value creation.</p>
    <p class="prompt-detail">Build around my niche ability: assets that earn while I sleep — Naval Ravikant's definition of wealth.</p>
  </section>
  <section class="profile-prompt profile-prompt-wide">
    <span class="prompt-label">WHAT KEEPS ME MOVING</span>
    <p class="prompt-answer">New challenges. A bigger canvas.</p>
  </section>
  <section class="profile-prompt profile-prompt-wide">
    <span class="prompt-label">A LINE I RETURN TO</span>
    <p class="prompt-answer">“The hell with it. I am just going to run it myself.”</p>
    <p class="prompt-detail">Jim Simons told a friend.</p>
  </section>
</div>
