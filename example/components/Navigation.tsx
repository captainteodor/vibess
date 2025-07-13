import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";
import { Icon } from '@iconify/react';

export const Navigation: React.FC = () => {
  return (
    <Navbar isBordered className="bg-background/50 backdrop-blur-md">
      <NavbarBrand>
        <Icon icon="lucide:sparkles" className="text-primary-500 mr-2" />
        <p className="font-bold text-inherit">VibeMatch Advisor</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Align Vibes
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Vibe Vault
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Cosmic Community
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="primary" variant="flat">
            Enter the Nexus
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};