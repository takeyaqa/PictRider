function HeaderArea() {
  return (
    <header>
      <nav className="top-0 left-0 mb-10 flex h-15 w-full bg-white text-black shadow-sm">
        <h1 className="my-auto mr-5 ml-5 text-2xl font-bold">
          <a href="#">
            <img
              src="/favicon.svg"
              alt="logo"
              width="20"
              height="20"
              className="mr-1 hidden md:inline"
            />
            PictRider
          </a>
        </h1>
        <ul className="mt-auto mb-auto flex space-x-6 text-lg font-bold">
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a
              href="https://github.com/takeyaqa/PictRider"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </a>
          </li>
        </ul>
        <span className="my-auto ml-auto px-3">{__APP_VERSION__}</span>
      </nav>
    </header>
  )
}

export default HeaderArea
