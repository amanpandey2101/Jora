import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CompanyCarousel from "@/components/ui/CompanyCarousel";
import { ArrowRight, BarChart, Calendar, ChevronRight, Layout, Brain, Sparkles, Zap, Bot } from "lucide-react";
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

const aiFeatures = [
  {
    title: "AI Task Generation",
    description:
      "Generate intelligent task suggestions based on your project description and existing workflow.",
    icon: Sparkles,
    color: "text-purple-400",
  },
  {
    title: "Smart Descriptions",
    description:
      "Automatically generate detailed task descriptions with acceptance criteria and considerations.",
    icon: Brain,
    color: "text-cyan-400",
  },
  {
    title: "Sprint Analytics",
    description:
      "Get AI-powered insights about your sprint performance, bottlenecks, and recommendations.",
    icon: Zap,
    color: "text-emerald-400",
  },
  {
    title: "Intelligent Automation",
    description:
      "Leverage AI to automate routine tasks and optimize your project management workflow.",
    icon: Bot,
    color: "text-orange-400",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="container mx-auto py-32 text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-glow" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="space-y-6">
          <div className="animate-float">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary mb-8">
               <Sparkles size={16} />
               <span className="text-sm font-medium">Reimagining Project Management</span>
             </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight pb-6">
            Streamline Your Workflow <br />
            <span className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mt-4">
              with
              <span className="text-gradient">Zora AI</span>
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Empower your team with our intuitive project management solution. 
            Experience the fusion of Kanban simplicity and AI intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all hover:scale-105">
                Get Started <ChevronRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full glass hover:bg-white/10 border-white/20 text-black">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              AI-Powered Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of project management with our advanced AI capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="group">
                <Card className="glass-card h-full border-none p-2">
                  <CardContent className="pt-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/20 transition-all"></div>
                    <div className={`h-12 w-12 mb-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-foreground">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-24 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold mb-16 text-center text-foreground">
            Core Capabilities
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index}>
                <Card className="glass-card hover:bg-white/5 transition-all duration-300">
                  <CardContent className="pt-8 p-8">
                    <feature.icon className="h-12 w-12 mb-6 text-primary" />
                    <h4 className="text-2xl font-bold mb-4 text-foreground">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground text-lg">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carousel */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold mb-12 text-center text-muted-foreground uppercase tracking-widest">
            Trusted by Industry Leaders
          </h3>
          <div className="mask-image-gradient">
            <CompanyCarousel />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 -z-10 transform origin-left"></div>
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-4xl font-bold mb-12 text-center text-foreground">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full space-y-6">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card border-none rounded-2xl px-2"
              >
                <AccordionTrigger className="text-lg font-medium p-6 hover:text-primary transition-colors hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground px-6 pb-6 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent -z-10"></div>
        <div className="container mx-auto max-w-3xl">
          <h3 className="text-5xl font-bold mb-8 text-foreground">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of teams already using Zora to streamline their
            projects and boost productivity with AI.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-2xl shadow-primary/30 transition-all hover:scale-105">
              Start For Free <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
