import { useEffect, useState } from "react";
import "./App.css";

function HeaderLogo() {
  return (
    <img className="site-logo" src="/logo.svg" alt="XSUFE" />
  );
}

function HomePage() {
  return (
    <main className="home">
      <section className="hero">
        <HeaderLogo />
        <p className="hero-eyebrow">Products</p>
        <h1>XSUFE</h1>
      </section>

      <section className="product-grid" aria-label="products">
        <a
          className="product-card product-link"
          href="https://docs.xsufe.com"
          target="_blank"
          rel="noreferrer"
        >
          <div className="product-tag">文档平台</div>
          <h2>SUFEDocs</h2>
          <p>
            一个资料分享平台，旨在使校内学生更方便地获取与课程有关的学习资源
          </p>
          <span className="cta">访问 docs.xsufe.com</span>
        </a>

        <a className="product-card product-link" href="/coursedeck">
          <div className="product-tag">Firefox 扩展</div>
          <h2>Coursedeck</h2>
          <p>空中课堂点播问答 Agent，支持安装到 Firefox 侧边栏</p>
          <br />
          <span className="cta">查看</span>
        </a>
      </section>
    </main>
  );
}

function CoursedeckPage({ downloadUrl }: { downloadUrl: string }) {
  return (
    <main className="home">
      <section className="hero">
        <HeaderLogo />
        <p className="hero-eyebrow">Products</p>
        <h1>Coursedeck</h1>
        <p className="hero-description">空中课堂点播问答 Agent</p>
      </section>

      <section className="detail-layout" aria-label="coursedeck-detail">
        <article className="product-card">
          <div className="product-tag">Firefox 扩展</div>
          <h2>Coursedeck</h2>
          <a
            className="download-link"
            href={downloadUrl}
          >
            点此安装到 Firefox 侧边栏
          </a>
          <img
            className="coursedeck-preview"
            src="/coursedeck.png"
            alt="Coursedeck 示例界面"
          />
          <a className="back-link" href="/">
            返回主页
          </a>
        </article>
      </section>
    </main>
  );
}

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank") return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      event.preventDefault();
      window.history.pushState({}, "", href);
      setPath(href);
    };

    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onDocumentClick);

    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  if (path === "/coursedeck") {
    return (
      <CoursedeckPage downloadUrl="https://www.xsufe.com/downloads/coursedeck-latest.xpi" />
    );
  }

  return <HomePage />;
}

export default App;
