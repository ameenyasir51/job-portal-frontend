import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
      <div className="text-center py-20 px-6 bg-gradient-to-b from-gray-50 to-transparent">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-muted-foreground mb-6">
          Explore thousands of opportunities from top companies
        </p>

        <div className="flex flex-col md:flex-row gap-3 justify-center max-w-xl mx-auto">
          <Input placeholder="Search jobs (React, Node...)" />
          <Button>Search</Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-10 space-y-4">
        
        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="flex justify-between items-center p-5">
            <div>
              <h2 className="font-semibold text-lg">
                Frontend Developer
              </h2>
              <p className="text-sm text-muted-foreground">
                React • Tailwind • TypeScript
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium">₹10L</p>
              <Button size="sm" className="mt-2">
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="flex justify-between items-center p-5">
            <div>
              <h2 className="font-semibold text-lg">
                Backend Developer
              </h2>
              <p className="text-sm text-muted-foreground">
                Node.js • MongoDB • Express
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium">₹12L</p>
              <Button size="sm" className="mt-2">
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}