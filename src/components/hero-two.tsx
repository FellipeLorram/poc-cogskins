import { SendLPEmail } from "@/api/helpers/send-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, BookOpen, Cpu, Network } from "lucide-react";

export default function HeroTwo() {
  return (
    <section
      id="features"
      className="py-20 px-4 md:px-10 lg:px-20 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center bg-white dark:bg-black/60 rounded-full px-4 py-1 border border-gray-300 dark:border-blue-500/30 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-800 dark:text-white">
                Advanced Features
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            YOUR SKILLS, <span className="text-orange-500">CERTIFIED</span>.
            <br />
            NO CLASSROOMS REQUIRED.
          </h2>
          <p className="text-xl mb-2 text-gray-700 dark:text-gray-300">
            Mastered it? Own it.
          </p>
          <p className="text-xl mb-6 text-gray-700 dark:text-gray-300">
            Verified instantly, recognized everywhere.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Not all skills are taught in school. You learn through games, online
            courses, and real-world experience. But how do you prove it?
            CogSkins validates your knowledge—wherever you learned it—and turns
            it into a verifiable credential you control.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in-delay">
          <FeatureCard
            icon={
              <BookOpen className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-4" />
            }
            title="Learn Anywhere"
            description="From YouTube to eSports, all learning matters."
          />

          <FeatureCard
            icon={
              <Cpu className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-4" />
            }
            title="AI-Powered Recognition"
            description="Our AI detects and validates your skills."
          />

          <FeatureCard
            icon={
              <Network className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-4" />
            }
            title="Decentralized Ownership"
            description="Your credentials are secured on blockchain."
          />

          <FeatureCard
            icon={
              <Award className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-4" />
            }
            title="Showcase & Succeed"
            description="Your skills will unlock jobs, promotions, and offers."
          />
        </div>

        <div
          id="signup"
          className="flex flex-col items-center justify-center animate-fade-in-delay-long"
        >
          <h3 className="text-xl font-medium mb-6 text-gray-900 dark:text-white">
            Claim Your Skills Now
          </h3>
          <form
            action={async (formData) => {
              const email = formData.get("email") as string;
              if (!email) return;
              await SendLPEmail(email, "Claim Your Skills Now");
            }}
            className="flex w-full max-w-md space-x-2"
          >
            <Input
              name="email"
              type="email"
              placeholder="Your best email..."
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
            />
            <Button className="bg-blue-500 hover:bg-blue-600 text-white relative overflow-hidden group">
              <span className="relative z-10">Submit</span>
              <span className="absolute inset-0 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-6 flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30 shadow-sm">
      {icon}
      <h3 className="text-blue-500 dark:text-blue-400 font-medium text-lg mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        {description}
      </p>
    </div>
  );
}
