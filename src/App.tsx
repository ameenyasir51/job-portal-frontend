import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">HireHub</h1>
        <Button>Post Job</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition-all cursor-pointer">
          <CardHeader>
            <CardTitle>Frontend Developer</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              React • Tailwind • TypeScript
            </p>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">₹8L - ₹12L</span>
              <Button size="sm">Apply</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all cursor-pointer">
          <CardHeader>
            <CardTitle>Backend Developer</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Node.js • MongoDB • Express
            </p>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">₹10L - ₹15L</span>
              <Button>Apply</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all cursor-pointer">
          <CardHeader>
            <CardTitle>Full Stack Developer</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              MERN • Next.js • AWS
            </p>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">₹12L - ₹18L</span>
              <Button variant="default">Apply</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}