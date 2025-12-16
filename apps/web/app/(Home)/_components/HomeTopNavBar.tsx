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
import { cn } from "@/lib/utils"; // Assuming you have a utility for merging classes

export default function HomeTopNavBar() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm pt-4">
      {/* 1. Header Row (Discover, Map) - No changes needed here */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <div className="flex size-12 shrink-0 items-center justify-start text-foreground">
          <Utensils className="text-3xl text-primary" />
        </div>
        <h1 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Discover
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
      
      {/* 2. Search Bar & Filters */}
      <div className="px-4 py-3">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          
          {/* Main Search Bar Wrapper */}
          <div className="flex w-full items-center rounded-lg h-12 bg-muted">
            
            {/* Filter Button (FIXED ALIGNMENT) */}
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                // Use a fixed size and ensure content is centered
                className="h-full w-12 shrink-0 rounded-l-lg rounded-r-none flex items-center justify-center hover:bg-muted/70"
                aria-label="Filter"
              >
                {/* Use a larger text-xl for better visibility and centering */}
                <Filter className="text-xl" /> 
              </Button>
            </CollapsibleTrigger>
            
            {/* Separator Line (Optional, but adds polish) */}
            <div className="h-6 w-[1px] bg-border mx-0.5 shrink-0" />

            {/* Search Icon and Input */}
            <div className="flex flex-1 items-center h-full">
              {/* Search Icon (FIXED ALIGNMENT and spacing) */}
              <Search className="h-5 w-5 ml-3 mr-2 text-muted-foreground" />
              <Input
                // Input takes remaining space, remove conflicting classes
                className="flex-1 border-0 bg-muted h-full placeholder:text-muted-foreground p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Search events or cuisines"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
          </div>
          
          {/* Collapsible Filters Content (No changes needed) */}
          <CollapsibleContent className="px-4 pb-4 pt-3">
            <div className="flex gap-3 overflow-x-auto">
              <Button
                variant="default"
                size="sm"
                className="h-8 shrink-0 rounded-full gap-x-1.5 pl-3 pr-2"
              >
                <span className="text-sm font-medium leading-normal">
                  Treat/Split
                </span>
                <ChevronDown className="text-lg" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 shrink-0 rounded-full gap-x-1.5 pl-3 pr-2"
              >
                <span className="text-sm font-medium leading-normal">
                  Distance
                </span>
                <ChevronDown className="text-lg" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 shrink-0 rounded-full gap-x-1.5 pl-3 pr-2"
              >
                <span className="text-sm font-medium leading-normal">Time</span>
                <ChevronDown className="text-lg" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 shrink-0 rounded-full gap-x-1.5 pl-3 pr-2"
              >
                <span className="text-sm font-medium leading-normal">
                  Cuisine
                </span>
                <ChevronDown className="text-lg" />
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </header>
  );
}