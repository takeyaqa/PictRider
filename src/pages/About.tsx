function About() {
  return (
    <main className="bg-white">
      <section className="mx-2 mb-10 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
        <h2 className="mb-6 text-2xl font-bold">About PictRider</h2>

        <p className="mb-4">
          <img src="/logo.svg" alt="PictRider Logo" width="640" />
        </p>

        <p className="mb-4">
          <strong className="text-xl font-bold">
            Pairwise Testing on the Web
          </strong>
        </p>

        <div className="mb-8">
          <h3 className="mb-3 text-xl font-semibold">What is PictRider?</h3>
          <p className="mb-4">
            <em className="font-semibold italic">PictRider</em> is a modern and
            user-friendly combinatorial testing tool that allows you to easily
            generate test cases using pairwise testing techniques directly on
            the web. It requires no installation and runs entirely in the
            browser, enabling QA engineers and software developers to quickly
            and efficiently design effective test cases.
          </p>
          <p className="mb-4">With PictRider, you can:</p>
          <ul className="mb-4 list-disc pl-8">
            <li>Define test parameters and their possible values</li>
            <li>Create complex constraints between parameters</li>
            <li>
              Generate optimized test cases that cover all pairwise combinations
            </li>
            <li>View and export the generated test cases</li>
            <li>
              And no installation required; get started immediately from your
              browser
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="mb-3 text-xl font-semibold">
            What is Pairwise Testing?
          </h3>
          <p className="mb-4">
            <em className="font-semibold italic">Pairwise testing</em> is a
            combinatorial testing technique used to reduce the number of test
            cases while maintaining high test coverage. It is based on the
            principle that most defects are caused by interactions between two
            parameters rather than multiple simultaneous factors.
          </p>
          <p className="mb-4">
            In this approach, test cases are generated to cover all possible
            combinations of input values for every pair of parameters. This
            greatly reduces the total number of tests needed compared to
            exhaustive testing, while still ensuring that critical interactions
            are evaluated.
          </p>
          <p>Pairwise testing is especially effective when:</p>
          <ul className="mb-4 list-disc pl-8">
            <li>You need to cover a wide range of parameter combinations</li>
            <li>
              Full combinatorial testing is impractical due to time or resource
              constraints
            </li>
            <li>
              You want to systematically reduce redundant test cases without
              sacrificing coverage quality
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="mb-3 text-xl font-semibold">Open Source</h3>
          <p className="mb-4">
            PictRider is an open-source project. The source code is available on
            GitHub:
          </p>
          <p className="mb-4">
            <a
              href="https://github.com/takeyaqa/PictRider"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              https://github.com/takeyaqa/PictRider
            </a>
          </p>
          <p>Contributions, bug reports, and feature requests are welcome!</p>
        </div>

        <div className="mb-8">
          <h3 className="mb-3 text-xl font-semibold">Disclaimer</h3>
          <p className="mb-4">
            PictRider is provided "as is", without warranty of any kind, express
            or implied. In no event shall the authors, contributors, or
            copyright holders be liable for any claim, damages, or other
            liability, whether in an action of contract, tort, or otherwise,
            arising from, out of, or in connection with the software or the use
            or other dealings in the software.
          </p>
          <p className="mb-4">
            The test cases generated by PictRider are intended to assist in your
            testing efforts, but they do
            <em className="font-semibold italic">
              {' '}
              not guarantee complete test coverage{' '}
            </em>
            or
            <em className="font-semibold italic"> the absence of defects </em>
            in your software. Users should always apply professional judgment
            when using testing tools, and are encouraged to supplement pairwise
            testing with additional testing strategies as appropriate for their
            specific use case or risk model.
          </p>
          <p className="mb-4">
            PictRider is an independent project and is not affiliated with
            Microsoft Corporation.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="mb-3 text-xl font-semibold">Third-Party Libraries</h3>
          <p className="mb-4">
            PictRider uses the following third-party libraries:{' '}
            <a
              href="/dependencies.txt"
              className="text-blue-600 hover:underline"
            >
              View third-party dependencies
            </a>
          </p>
        </div>

        <div className="mb-8">
          <h3 className="mb-3 text-xl font-semibold">PictRider License</h3>
          <p className="mb-4">PictRider is licensed under the MIT License:</p>
          <pre className="overflow-auto rounded bg-gray-100 p-4 font-mono text-sm">
            {`MIT License

Copyright (c) 2025 Takeshi Kishi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
          </pre>
        </div>

        <div>
          <h3 className="mb-3 text-xl font-semibold">Acknowledgement</h3>
          <p className="mb-4">
            PictRider is heavily inspired by{' '}
            <a
              href="https://sourceforge.net/projects/pictmaster/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-blue-600 hover:underline"
            >
              <strong className="font-bold">PictMaster</strong>
            </a>
            , a powerful Excel-based tool developed by Iwatsu System & Software
            Co., Ltd..
          </p>
          <p>
            We would like to express our respect and appreciation for the ideas,
            user interface design, and contributions that PictMaster has brought
            to the field of combinatorial testing.
          </p>
        </div>
      </section>
    </main>
  )
}

export default About
