function notFoundPage({ slug, missingFile }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Not found — rootcloud</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *{ box-sizing:border-box; }
  body{
    margin:0;
    background:#FFFFFF;
    color:#1F1F1F;
    font-family:'Inter', sans-serif;
    display:flex;
    align-items:center;
    justify-content:center;
    min-height:100vh;
    padding:24px;
  }
  .box{ max-width:420px; text-align:center; }
  .code{
    font-size:13px;
    font-weight:600;
    color:#2563EB;
    letter-spacing:0.04em;
    margin-bottom:14px;
  }
  h1{ font-size:22px; margin:0 0 10px; }
  p{ color:#555; font-size:14.5px; line-height:1.55; margin:0 0 22px; }
  code{
    background:#F5F5F5;
    border:1px solid #E5E5E5;
    border-radius:4px;
    padding:2px 6px;
    font-size:13px;
  }
  a.btn{
    display:inline-block;
    font-size:14px;
    font-weight:600;
    padding:10px 18px;
    border-radius:6px;
    background:#2563EB;
    color:#fff;
    text-decoration:none;
  }
  a.btn:hover{ background:#1D4ED8; }
</style>
</head>
<body>
  <div class="box">
    <div class="code">404 — SITE NOT FOUND</div>
    <h1>Nothing here yet.</h1>
    <p>
      This deploy (<code>${slug}</code>) doesn't have an
      <code>${missingFile}</code> file. Every static site needs an
      <code>index.html</code> at its root so rootcloud knows what to show first.
    </p>
    <a class="btn" href="/">Back to rootcloud</a>
  </div>
</body>
</html>`;
}

export { notFoundPage };
