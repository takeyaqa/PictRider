function HeaderArea() {
  return (
    <header>
      <nav className="navbar bg-success navbar-expand-lg">
        <div className="container-xxl">
          <a className="navbar-brand" href="#">
            PictRider
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://github.com/takeyaqa/PictRider"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub
                </a>
              </li>
            </ul>
            <span className="navbar-text">
              {__APP_VERSION__ ? __APP_VERSION__ : 'Development'}
            </span>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default HeaderArea
