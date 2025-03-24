function HeaderArea() {
  return (
    <header>
      <nav className="bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between py-3">
            <a className="text-xl font-bold" href="#">
              PictRider
            </a>
            <button
              className="lg:hidden border border-white rounded px-3 py-2"
              type="button"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="block w-6 h-px bg-white mb-1"></span>
              <span className="block w-6 h-px bg-white mb-1"></span>
              <span className="block w-6 h-px bg-white"></span>
            </button>
            <div
              className="hidden lg:flex flex-grow items-center"
              id="navbarNav"
            >
              <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                <li className="py-2 lg:py-0 lg:px-3">
                  <a
                    className="font-medium hover:text-green-200"
                    aria-current="page"
                    href="#"
                  >
                    Home
                  </a>
                </li>
                <li className="py-2 lg:py-0 lg:px-3">
                  <a className="hover:text-green-200" href="#">
                    About
                  </a>
                </li>
                <li className="py-2 lg:py-0 lg:px-3">
                  <a
                    className="hover:text-green-200"
                    href="https://github.com/takeyaqa/PictRider"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
              <span className="ml-auto text-sm">
                {__APP_VERSION__ ? __APP_VERSION__ : 'Development'}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default HeaderArea
