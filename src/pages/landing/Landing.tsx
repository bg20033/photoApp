import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Capture & Share Your Memories
        </h1>
        <p className="text-lg text-muted-foreground">
          The easiest way to organize, edit, and share your photos with friends
          and family.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
