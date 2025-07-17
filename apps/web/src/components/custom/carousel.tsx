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

    <Carousel className="w-80 h-60 relative">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="flex items-center justify-center">
              <Card className="w-60 h-60 relative flex items-center justify-center">
                <CardContent className="flex aspect-square items-center justify-center">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="w-8 h-8 px-3 left-0" />
      <CarouselNext className="w-8 h-8 px-3 left-[290px]"/>
    </Carousel>

  )
}
