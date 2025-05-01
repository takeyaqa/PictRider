interface SectionProps {
  children: React.ReactNode
}

function Section({ children }: SectionProps) {
  return (
    <section className="mx-2 mt-2 mb-5 rounded-md border-2 bg-gray-50 px-7 py-3 shadow-md md:mx-10 dark:border-gray-600 dark:bg-gray-900">
      {children}
    </section>
  )
}

export default Section
