import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import { faqData } from "./faq-data";
import { SectionContent, SectionDescription, SectionTitle } from "../Section";

function FAQ() {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge
                  variant="default"
                  className="text-sm sm:text-base uppercase text-primary-foreground"
                >
                  FAQ
                </Badge>
              </div>
              <div className="flex gap-4 flex-col">
                <SectionTitle className="text-3xl sm:text-5xl max-w-xl text-left">
                  {"Got questions? We've got answers for You!"}
                </SectionTitle>

                <SectionDescription className="-mt-3 sm:mt-0 md:text-lg max-w-xl lg:max-w-lg text-left">
                  Find answers to common questions about shrinkify, how it
                  works, tracking features, customization options, and more. Get
                  the details you need to make the most of our service today!
                </SectionDescription>
              </div>
              <div className="mt-3 sm:mt-0">
                <Button className="gap-4" variant="outline">
                  Any questions? Reach out <PhoneCall className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <SectionContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faqItem, index) => (
                <AccordionItem key={index} value={"index-" + index}>
                  <AccordionTrigger className="text-left">
                    {faqItem.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faqItem.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SectionContent>
        </div>
      </div>
    </div>
  );
}

export { FAQ };
