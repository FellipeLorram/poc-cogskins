import { DollarSign, CheckCircle, Unlock, Zap } from "lucide-react";

export default function HeroThree() {
  return (
    <section
      id="benefits"
      className="py-20 px-4 md:px-10 lg:px-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center bg-gray-100 dark:bg-black/60 rounded-full px-4 py-1 border border-gray-300 dark:border-blue-500/30 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-sm text-gray-800 dark:text-white">
                Benefits
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            BREAK THE MOLD.{" "}
            <span className="text-blue-500">OWN YOUR SKILLS</span>.
          </h2>
          <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
            Forget outdated degrees—it&apos;s time for a new kind of credential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16 animate-fade-in-delay">
          <BenefitCard
            icon={<DollarSign className="w-10 h-10 text-orange-500" />}
            title="Skills = Currency"
            description="Your knowledge should be as valuable as a diploma."
          />
          <BenefitCard
            icon={<CheckCircle className="w-10 h-10 text-orange-500" />}
            title="Proof, Not Promises"
            description='No more "I swear I know this." Your skills are certified.'
          />
          <BenefitCard
            icon={<Unlock className="w-10 h-10 text-orange-500" />}
            title="No Gatekeepers"
            description="You own your achievements—no institutions required."
          />
          <BenefitCard
            icon={<Zap className="w-10 h-10 text-orange-500" />}
            title="Instant Validation"
            description="Skip years of education bureaucracy. Get recognized today."
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-8 border border-gray-200 dark:border-gray-800 animate-fade-in-delay-long">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            What People Are Saying
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="The job market is full of self-taught talent. Finally, someone is building a fair way to validate these skills."
              author="Zander, Product Manager"
              type="group"
            />
            <TestimonialCard
              quote="If this delivers on its promise, it'll be a game-changer for freelancers and self-learners. Companies need this."
              author="Felipe, Software Developer"
            />
            <TestimonialCard
              quote="I built my career learning from the internet. The idea of a system that recognizes that makes total sense."
              author="Paty, Entrepreneur"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  type?: string;
}

function TestimonialCard({ quote, author, type = "" }: TestimonialCardProps) {
  return (
    <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <svg
            className="h-6 w-6 text-blue-500 dark:text-blue-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-300 flex-grow mb-4">
          {quote}
        </p>
        <div className="flex items-center mt-auto">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 font-medium">
            {author.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {author}
            </p>
            {type && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{type}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
