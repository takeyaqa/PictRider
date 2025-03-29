function HeaderArea() {
  return (
    <header>
      <nav className="top-0 left-0 mb-10 flex h-15 w-full border-b bg-white text-black">
        <h1 className="my-auto mr-10 ml-5 text-2xl font-bold">
          <a href="#">PictRider 🚧 Under Construction 🚧</a>
        </h1>
        <ul className="mt-auto mb-auto flex space-x-6 text-lg font-bold">
          <li>
            <a href="#">Home</a>
          </li>
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
        <span className="my-auto mr-10 ml-auto pr-3 pl-3">
          {__APP_VERSION__}
        </span>
      </nav>
    </header>
  )
}

export default HeaderArea
