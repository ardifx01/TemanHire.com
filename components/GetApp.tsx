import React from 'react'
import Button from './Button'
import Image from 'next/image'

const GetApp = () => {
  return (
    <section id="doc" className="flexCenter w-full flex-col pb-[100px]">
      <div className="get-app">
        <div className="z-20 flex w-full flex-1 flex-col items-start justify-center gap-12">
          <h2 className="bold-40 lg:bold-64 xl:max-w-[320px]">Your trust matters
          </h2>
          <p className="regular-16 text-gray-10">We never exploit your information. Every project is <strong>Open Source</strong>. Check it out on GitHub:</p>
          <div className="flex w-full flex-col gap-3 whitespace-nowrap xl:flex-row">
            <Button 
              type="button"
              title="Github"
              icon="/apple.svg"
              variant="btn_black"
              full
              href="https://github.com/4Kings-Rakamin"
              external
            />
            <Button 
              type="button"
              title="Fork this Project"
              icon="/fork.png"
              variant="btn_dark_green_outline"
              full
              href="https://github.com/4Kings-Rakamin/TemanHire.com"
              external
            />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <Image src="/phone1.png" alt="phones" width={450} height={770} />
        </div>
      </div>
    </section>
  )
}

export default GetApp