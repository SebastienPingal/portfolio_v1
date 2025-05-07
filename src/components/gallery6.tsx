"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface GalleryItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
}

interface Gallery6Props {
  heading?: string;
  demoUrl?: string;
  items?: GalleryItem[];
}

const Gallery6 = ({
  items = [
    {
      id: "item-1",
      title: "Build Modern UIs",
      summary:
        "Create stunning user interfaces with our comprehensive design system.",
      url: "#",
      image: "https://shadcnblocks.com/images/block/placeholder-dark-1.svg",
    },
    {
      id: "item-2",
      title: "Computer Vision Technology",
      summary:
        "Powerful image recognition and processing capabilities that allow AI systems to analyze, understand, and interpret visual information from the world.",
      url: "#",
      image: "https://shadcnblocks.com/images/block/placeholder-dark-1.svg",
    },
    {
      id: "item-3",
      title: "Machine Learning Automation",
      summary:
        "Self-improving algorithms that learn from data patterns to automate complex tasks and make intelligent decisions with minimal human intervention.",
      url: "#",
      image: "https://shadcnblocks.com/images/block/placeholder-dark-1.svg",
    },
    {
      id: "item-4",
      title: "Predictive Analytics",
      summary:
        "Advanced forecasting capabilities that analyze historical data to predict future trends and outcomes, helping businesses make data-driven decisions.",
      url: "#",
      image: "https://shadcnblocks.com/images/block/placeholder-dark-1.svg",
    },
    {
      id: "item-5",
      title: "Neural Network Architecture",
      summary:
        "Sophisticated AI models inspired by human brain structure, capable of solving complex problems through deep learning and pattern recognition.",
      url: "#",
      image: "https://shadcnblocks.com/images/block/placeholder-dark-1.svg",
    },
  ],
}: Gallery6Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="relative overflow-hidden">
      <Carousel
        setApi={setCarouselApi}
      >
        <CarouselContent className="relative flex gap-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="basis-3/4">
              <a
                href={item.url}
                className="hover:scale-105 duration-300 flex flex-col justify-between mt-6"
              >
                <div>
                  <div className="flex overflow-clip rounded-xl">
                    <div className="flex-1">
                      <div className="relative h-full w-full origin-bottom transition duration-300 ">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-2 line-clamp-3 pt-4 text-lg font-medium break-words md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl">
                  {item.title}
                </div>
                <div className="mb-8 line-clamp-2 text-sm mb-12 md:text-base lg:mb-9">
                  {item.summary}
                </div>
                {/* <div className="flex items-center text-sm">
                    Read more{" "}
                    <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                  </div> */}
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Button
        size="icon"
        variant="ghost"
        color="white"
        onClick={() => {
          carouselApi?.scrollPrev();
        }}
        disabled={!canScrollPrev}
        className={`rounded-l-none absolute top-6 left-0 disabled:pointer-events-auto bg-white/50 hover:bg-white/70 backdrop-blur-sm h-40 ${!canScrollPrev ? "hidden" : ""}`}
      >
        <ArrowLeft className="size-5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        color="white"
        onClick={() => {
          carouselApi?.scrollNext();
        }}
        disabled={!canScrollNext}
        className={`rounded-r-none absolute top-6 right-0 disabled:pointer-events-auto bg-white/50 hover:bg-white/70 backdrop-blur-sm h-40 ${!canScrollNext ? "hidden" : ""}`}
      >
        <ArrowRight className="size-5" />
      </Button>
    </section>
  );
};

export { Gallery6 }