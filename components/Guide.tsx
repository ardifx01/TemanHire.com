import Image from 'next/image'
import React from 'react'

const Guide = () => {
  return (
    <section className="flexCenter flex-col">
      <div className="padding-container max-container w-full pb-24">
        <p className="uppercase regular-18 -mt-1 mb-3 text-[#0097b2]">
          We are here for you
        </p>
        <div className="flex flex-wrap justify-between gap-5 lg:gap-10">
          <h2 className="bold-40 lg:bold-64 xl:max-w-[390px]">Kami ada untukmu <span className='text-[#0097b2]'>Teman.</span></h2>
          <p className="regular-16 text-gray-30 xl:max-w-[520px]">Dengan TemanHire Tim Human Resource tidak lagi menjadi Penilai dan Pembuat Keputusan, tapi menjadi <strong>Pengawas Penilaian dan Pengawas Keputusan</strong>. Hanya dalam beberapa klik, pekerjaan yang bisa memakan waktu berminggu minggu bisa selesai hanya dalam hitungan jam.</p>
        </div>
      </div>

      <div className="flexCenter max-container relative w-full">
        <Image 
          src="/boat.png"
          alt="boat"
          width={1440}
          height={580}
          className="w-full object-cover object-center 2xl:rounded-5xl"
        />

        <div className="absolute flex bg-white py-8 pl-5 pr-7 gap-3 rounded-3xl border shadow-md md:left-[5%] lg:top-20">
        {/* wrapper ukuran khusus gambar */}
        <div className="relative w-8 h-40">
            <Image
            src="/meter2.svg"
            alt="meter"
            fill
            className="object-contain"
            />
        </div>
          <div className="flexBetween flex-col">
            <div className='flex w-full flex-col'>
              <div className="flexBetween w-full">
                <p className="regular-16 text-gray-20 mr-2">Finish</p>
                <p className="bold-16 text-[#0097b2]">1 Hour</p>
              </div>
              <p className="bold-20 mt-2">Hired!</p>
            </div>

            <div className='flex w-full flex-col'>
              <p className="regular-16 text-gray-20">Start</p>
              <h4 className="bold-20 mt-2 whitespace-nowrap">Interview</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Guide