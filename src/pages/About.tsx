export default function About() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-6">About Life Biotech</h1>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        
        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src="/images/ashish-shukla.jpg"
            alt="Mr. Ashish Shukla"
            className="w-80 h-80 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Content Section */}
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground mb-4">
            Life Biotech is a trusted pharmaceutical manufacturing company
            dedicated to delivering safe, reliable, and high-quality medicines
            to communities across India.
          </p>

          <p className="text-lg text-muted-foreground mb-4">
            The company is led by <span className="font-semibold text-primary">Mr. Ashish Shukla</span>,
            a visionary entrepreneur whose dedication and belief in innovation
            has shaped Life Biotech into a respected name in the healthcare sector.
          </p>

          <p className="text-lg text-muted-foreground mb-4">
            Starting from a humble background, Mr. Shukla built this organization
            with pure hard work, countless hours of effort, and a mission to make
            advanced healthcare solutions affordable for everyone.
          </p>

          <p className="text-lg text-muted-foreground">
            At Life Biotech, we believe that every medicine we create is more than
            a product — it’s a promise of better health, care, and a brighter future.
          </p>
        </div>
      </div>
    </div>
  );
}
