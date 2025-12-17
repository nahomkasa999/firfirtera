"use client";

import { useState } from "react";
import { Utensils, Map, Search, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function HomeTopNavBar() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
 

  return (
    <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm pt-0 border-b border-border/40">
      {/* 1. Header Row */}
      <div className="flex items-center p-4 justify-between">
        <div className="flex size-12 shrink-0 items-center justify-start text-foreground">
          <Utensils className="text-3xl text-primary" />
        </div>
        <h1 className="text-foreground text-2xl font-bold leading-none tracking-[-0.015em] flex-1 text-start">
          Hello, <span className="text-primary">Nahom</span>
          <span className="block mt-1 text-sm text-muted-foreground tracking-wide font-light">
            Ready to eat?
          </span>
        </h1>
        <div className="flex w-12 items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <Map className="text-2xl" />
          </Button>
        </div>
      </div>

      {/* 2. Search Bar Area */}
      <div className="px-4 mb-2">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          {/* Main Search Bar Wrapper - Removed bg-muted, added thin border */}
          <div className="flex w-full items-center rounded-xl h-12 border border-border bg-transparent focus-within:border-primary/50 transition-colors">
            {/* Filter Toggle */}
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="h-full w-12 shrink-0 rounded-l-xl rounded-r-none flex items-center justify-center hover:bg-muted/50"
                aria-label="Filter"
              >
                <Filter className="h-5 w-5 text-muted-foreground" />
              </Button>
            </CollapsibleTrigger>

            <div className="h-6 w-[1px] bg-border shrink-0" />

            {/* Search Input - Removed background and focus rings */}
            <div className="flex flex-1 items-center h-full">
              <Search className="h-5 w-5 ml-3 mr-2 text-muted-foreground" />
              <Input
                className="flex-1 border-0 bg-transparent h-full placeholder:text-muted-foreground p-4 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                placeholder="Search events or cuisines"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Expanded Filters Content */}
          <CollapsibleContent className="pb-4 pt-3">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant="outline"
                size="sm"
                className="h-8 shrink-0 rounded-full gap-x-1.5"
              >
                <span>Treat/Split</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 shrink-0 rounded-full gap-x-1.5"
              >
                <span>Distance</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 shrink-0 rounded-full gap-x-1.5"
              >
                <span>Cuisine</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </header>
  );
}