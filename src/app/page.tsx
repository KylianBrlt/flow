import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ui/ModeToggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="m-4">
      <SignedOut>
        <SignInButton mode="modal">
        <Button> Sign In </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <ModeToggle />
      <Button variant={"secondary"}> Click me </Button>
    </div>
  );
}
