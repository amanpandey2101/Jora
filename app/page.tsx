

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CompanyCarousel from "@/components/ui/CompanyCarousel";
import { ArrowRight, BarChart, Calendar, ChevronRight, Layout } from "lucide-react";
import Link from "next/link";
import React from "react";
import faqs from "@/data/faqs.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const features = [
  {
    title: "Intuitive Kanban Boards",
    description:
      "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
    icon: Layout,
  },
  {
    title: "Powerful Sprint Planning",
    description:
      "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
    icon: Calendar,
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain insights into your team's performance with detailed, customizable reports and analytics.",
    icon: BarChart,
  },
];

const Home = () => {
  return (
    <div>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="container mx-auto py-32  text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
            Streamline Your Workflow <br />
            <span className="flex mx-auto gap-3 sm:gap-4 items-center">
              with
              <span className="text-black font-bold">Zora</span>
            </span>
          </h1>
          <p className="text-lg sm:text-2xl text-red-800 mb-10 max-w-3xl mx-auto mt-10">
            Empower your team with our intuitive project management solution.
          </p>
          <p className="text-base sm:text-xl mb-12 max-w-2xl mx-auto"></p>
          <Link href="/onboarding">
            <Button size="lg" className="mr-4">
              Get Started <ChevronRight size={18} className="ml-1" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-[#D62828]  py-20  px-5">
          <div className="container mx-auto">
            <h3 className="text-3xl sm:text-6xl font-bold mb-12 text-white text-center">
              Key Features
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-[#EAE2B7] ">
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 mb-4 text-blue-800" />
                    <h4 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-orange-800">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* carousel */}
        <section className="py-20">
          <div className="container mx-auto">
            <h3 className="text-5xl font-bold mb-12 text-center">
              Trusted by Industry Leaders
            </h3>
            <CompanyCarousel />
          </div>
        </section>


         {/* faq */}
        <section className="bg-[#F77F00] py-20 px-5">
          <div className="container mx-auto">
            <h3 className="text-4xl font-normal mb-10 text-center text-white tracking-wider">
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border border-[#F77F00] rounded-xl transition-shadow duration-300"
                >
                  <AccordionTrigger className="text-lg text-[#333] font-medium p-6 hover:text-white hover:bg-[#F77F00] transition-all duration-300 ease-in-out ">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 p-6 bg-[#F9F9F9] rounded-b-xl">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>


              {/* CTA Section */}
      <section className="py-20 text-center px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-xl mb-12">
            Join thousands of teams already using Zora to streamline their
            projects and boost productivity.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="animate-bounce">
              Start For Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      </div>
    </div>
  );
};

export default Home;
