function HeaderSection() {
  return (
    <header>
      <nav className="top-0 left-0 mb-10 flex h-15 w-full bg-gray-50 shadow-sm dark:bg-gray-800">
        <h1 className="my-auto mr-5 ml-5 flex items-center text-2xl font-bold">
          <img
            src="/PictRider_icon.svg"
            alt="logo"
            width="30"
            height="30"
            className="mr-1 hidden md:inline"
          />
          PictRider
        </h1>
        <ul className="mt-auto mb-auto flex space-x-6 text-lg font-bold">
          <li>
            <a href="/about.html" target="_blank">
              About
            </a>
          </li>
          <li>
            <a
              href="https://github.com/takeyaqa/PictMCP#readme"
              target="_blank"
              rel="noopener noreferrer"
            >
              PictMCP
            </a>
          </li>
        </ul>
        <ul className="ml-auto flex items-center justify-end gap-3 pr-5">
          <li>
            <a
              href="https://github.com/takeyaqa/PictRider"
              target="_blank"
              rel="noopener noreferrer"
            >
              <picture>
                <source
                  srcSet="/github-mark-white.svg"
                  type="image/svg+xml"
                  media="(prefers-color-scheme: dark)"
                />
                <source
                  srcSet="/github-mark.svg"
                  type="image/svg+xml"
                  media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
                />
                <img
                  src="/github-mark.svg"
                  alt="GitHub"
                  width="25"
                  height="25"
                />
              </picture>
            </a>
          </li>
          <li>
            <a
              href={`https://github.com/takeyaqa/PictRider/releases/tag/${import.meta.env.VITE_APP_VERSION}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {import.meta.env.VITE_APP_VERSION}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default HeaderSection
