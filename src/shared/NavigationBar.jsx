import React from 'react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";

export default function NavigationBar({isAdmin}) {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuItems = [
      'Administrador'
    ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}
    isBordered
    className='fixed'>
    <NavbarContent>
      <NavbarBrand>
        
        <p className="font-bold text-inherit">CITAS</p>
      </NavbarBrand>
    </NavbarContent>
    <NavbarContent className="hidden sm:flex gap-4" justify="end">
    {
      isAdmin?
      <NavbarItem>
      <Link color="foreground" href="/">
        Volver
      </Link>
    </NavbarItem>
      :
      <NavbarItem>
      <Link color="foreground" href="/admin">
        Administrador
      </Link>
    </NavbarItem>
    }
    </NavbarContent>
    <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
    {/* <NavbarContent justify="end">
      <NavbarItem className="hidden lg:flex">
        <Link href="#">Login</Link>
      </NavbarItem>
      <NavbarItem>
        <Button as={Link} color="primary" href="#" variant="flat">
          Sign Up
        </Button>
      </NavbarItem>
    </NavbarContent> */}
    <NavbarMenu>
        <NavbarMenuItem >
         {isAdmin?
          <Link
          color='secondary'
          className="w-full"
          href="/"
          size="lg"
        >
          Volver
        </Link>:
         <Link
         color='secondary'
         className="w-full"
         href="/admin"
         size="lg"
       >
         Administrador
       </Link>}
        </NavbarMenuItem>
    </NavbarMenu>
  </Navbar>
  )
}
