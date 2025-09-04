import { NAV_LINKS } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Button from './Button'

const Navbar = () => {
  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-5">
        <Link href={"/"}>
            <Image src="/TemanHire.svg" alt="logo" width={148} height={50}/>
        </Link>
        <ul className="hidden h-full gap-12 lg:flex">
            {NAV_LINKS.map((link) => (
                <Link href={link.href} key={link.key} className="relative regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold
             after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#0097b2] after:transition-all after:duration-300 hover:after:w-full">
                    {link.label}
                </Link>
            ))}
        </ul>

        <div className="lg:flexCenter hidden">
            <Button 
                type="button"
                title="Login"
                icon='/user.svg'
                variant='btn_dark_green'
            />
        </div>

        <Image
            src="/menu.svg"
            alt="menu"
            width={32}
            height={32}
            className='inline-block lg:hidden cursor-pointer'
        />
    </nav>
  )
}

export default Navbar