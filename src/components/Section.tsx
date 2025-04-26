interface SectionProps {
  children: React.ReactNode
}

function Section({ children }: SectionProps) {
  return (
    <section className="mx-2 mt-5 mb-5 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      {children}
    </section>
  )
}

export default Section
