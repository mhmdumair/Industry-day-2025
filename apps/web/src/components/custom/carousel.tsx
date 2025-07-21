import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


export function CarouselDemo() {
  return (

<div className="flex items-center justify-center">
  <div className="relative w-full max-w-md">
    <Carousel className="w-full">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="flex items-center justify-center">
              <Card className="w-60 h-60 flex items-center justify-center">
                <CardContent className="flex aspect-square items-center justify-center">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Use absolute positioning for nav buttons */}
      <CarouselPrevious className="w-8 h-8 absolute top-1/2 -translate-y-1/2 left-2 z-10" />
      <CarouselNext className="w-8 h-8 absolute top-1/2 -translate-y-1/2 right-2 z-10" />
    </Carousel>
  </div>
</div>

  )
}
