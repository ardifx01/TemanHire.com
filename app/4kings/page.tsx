import Image from 'next/image';

const companyStats = [
  { label: 'Founded', value: '2025' },
  { label: 'Employees', value: '4+' },
  { label: 'Clients', value: '10.000+' },
  { label: 'Success Rate', value: '99%' }
];

const milestones = [
  {
    year: 'August 2025',
    title: 'Company Founded',
    description: 'TemanHire.com didirikan oleh I Gusti Ngurah Agung Hari Vijaya Kusuma'
  },
  {
    year: 'September 2025',
    title: 'AI Integration',
    description: 'Meluncurkan teknologi AI untuk mempercepat proses hiring'
  },
  {
    year: 'October 2025',
    title: 'Market Expansion',
    description: 'Ekspansi ke seluruh Indonesia'
  }
];

export default function FourKingsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section
      <section className="relative h-[60vh] w-full">
        <Image
          src="/company-hero.jpg"
          alt="4Kings Office"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">4Kings Technology</h1>
            <p className="text-xl">Revolutionizing Hiring Through AI</p>
          </div>
        </div>
      </section> */}

      {/* Company Stats */}
      <section className="py-20 bg-gray-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companyStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-[#0097b2]">{stat.value}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px]">
              <Image
                src="/agungs.png"
                alt="Founder"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Founder & CEO</h2>
              <h3 className="text-xl text-[#0097b2] mb-4">
                I Gusti Ngurah Agung Hari Vijaya Kusuma
              </h3>
              <p className="text-gray-600 mb-6">
                Dengan visi untuk merevolusi proses perekrutan di Indonesia, 
                beliau mendirikan 4Kings Technology pada 23 Agustus 2025 saat usia 24, dan waktu itu beliau telat lulus 1 tahun dan nganggur 1 tahun. 
                Fokus utama perusahaan adalah mengembangkan solusi AI untuk 
                mempercepat dan mengoptimalkan proses hiring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-24">
                  <p className="text-xl font-bold text-[#0097b2]">{milestone.year}</p>
                </div>
                <div className="flex-1">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mempercepat dan mengoptimalkan proses hiring di Indonesia melalui 
            teknologi AI yang inovatif, membantu perusahaan menemukan talent 
            terbaik dengan lebih efisien.
          </p>
        </div>
      </section>
    </div>
  );
}