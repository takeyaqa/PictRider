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
              className="rounded border border-white px-3 py-2 lg:hidden"
              type="button"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="mb-1 block h-px w-6 bg-white"></span>
              <span className="mb-1 block h-px w-6 bg-white"></span>
              <span className="block h-px w-6 bg-white"></span>
            </button>
            <div
              className="hidden flex-grow items-center lg:flex"
              id="navbarNav"
            >
              <ul className="flex list-none flex-col lg:ml-auto lg:flex-row">
                <li className="py-2 lg:px-3 lg:py-0">
                  <a
                    className="font-medium hover:text-green-200"
                    aria-current="page"
                    href="#"
                  >
                    Home
                  </a>
                </li>
                <li className="py-2 lg:px-3 lg:py-0">
                  <a className="hover:text-green-200" href="#">
                    About
                  </a>
                </li>
                <li className="py-2 lg:px-3 lg:py-0">
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
