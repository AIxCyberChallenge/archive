---
layout: default
title: AIxCC Competition Archive
---

<style>
  @font-face {
    font-family: 'IBM Plex Sans';
    font-style: normal;
    font-weight: 100 700;
    font-stretch: 100%;
    font-display: swap;
    src: url("/assets/fonts/IBMPlexSans-VariableFont_wdth,wght.ttf");
  }
  @font-face {
    font-family: 'IBM Plex Sans';
    font-style: italic;
    font-weight: 100 700;
    font-stretch: 100%;
    font-display: swap;
    src: url("/assets/fonts/IBMPlexSans-Italic-VariableFont_wdth,wght.ttf");
  }

  :root {
    font-family: "IBM Plex Sans", Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "IBM Plex Sans", Helvetica, Arial, sans-serif;
    background: url("/assets/img/bg.jpg") center center / cover;
    color: #FFFFFF;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  p {
    font-size: 16px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  header {
    padding: 20px 0;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #FFFFFF;
    text-decoration: none;
    letter-spacing: -0.02em;
  }

  .logo span {
    color: #FFD700;
  }

  main {
    padding: 60px 0;
  }

  .hero {
    text-align: center;
    margin-bottom: 80px;
  }

  .hero h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .hero .subtitle {
    color: #CCCCCC;
    margin-bottom: 40px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .status-badge {
    display: inline-block;
    background: #1a1a1a;
    border: 1px solid #333333;
    padding: 12px 24px;
    border-radius: 50px;
    font-weight: 500;
    color: white;
    margin-bottom: 40px;
  }

  .coming-soon {
    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
    border: 1px solid #333333;
    border-radius: 12px;
    padding: 60px 40px;
    text-align: center;
    margin-bottom: 60px;
  }

  .coming-soon h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: #FFFFFF;
  }

  .coming-soon p {
    color: #CCCCCC;
    margin-bottom: 32px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .main-site-link {
    text-align: center;
    margin-top: 60px;
  }

  .main-site-link a {
    font-family: "IBM Plex Sans", Sans-serif;
    font-size: 20px;
    font-weight: 700;
    font-style: normal;
    text-decoration: none;
    background: #7488b2;
    color: #FFFFFF;
    border-style: none;
    border-radius: 0px 40px 0px 040px;
    padding: 25px 50px 25px 50px;
    box-shadow: black 6px 6px 0 0;
  }

  .main-site-link a:hover {
    background-color: #343846;
    color: #FFFFFF;
  }

  footer {
    background: #000000;
    border-top: 1px solid #1a1a1a;
    padding: 40px 0;
    text-align: center;
  }

  footer p {
    color: #666666;
    font-size: 0.9rem;
  }

  footer a {
    color: #CCCCCC;
    text-decoration: none;
  }

  footer a:hover {
    color: #FFD700;
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2.5rem;
    }
    
    .coming-soon {
      padding: 40px 20px;
    }
  }
</style>

<main>
  <div class="container">
    <div class="hero">
      <h1><img src="/assets/img/logo.png" alt="AIxCC logo" style="width:500px; margin-bottom: 20px;"/></h1>
      <div class="status-badge">Coming Soon</div>
      <p class="subtitle">The comprehensive archive of DARPA's Artificial Intelligence Cyber Challenge, documenting the competition data, team submissions, and breakthrough cybersecurity innovations.</p>
    </div>
    
    <div class="coming-soon">
      <h2>Archive Under Development</h2>
      <p>We're preparing a comprehensive archive of the AIxCC competition. Check back after DEF CON 33 for access to competition infrastructure, artifacts, team CRSs, and detailed analysis.</p>
    </div>
    
    <div class="main-site-link">
      <a href="https://aicyberchallenge.com">Visit Main AIxCC Site</a>
    </div>
  </div>
</main>

<footer>
  <div class="container">
    <p>
      Copyright 2025 &nbsp;///&nbsp; 
      <a href="https://aicyberchallenge.com/index.php/terms-condition/">Terms and Conditions</a>
    </p>
  </div>
</footer>
