"use client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form-v2";
import { ChevronRight, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

import { newsletterSubmission } from "@/action/newsletter-submission";
import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";

// const InteractiveGridPattern = dynamic(
//   () =>
//     import("@workspace/ui/components/interactive-grid-pattern").then(
//       (mod) => mod.InteractiveGridPattern,
//     ),
//   {
//     ssr: false,
//   },
// );

type SubscribeNewsletterProps = PagebuilderType<"subscribeNewsletter">;

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function SubscribeNewsletter({
  title,
  subTitle,
  helperText,
}: SubscribeNewsletterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      await newsletterSubmission(formData);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="subscribe" className="px-4 py-8 sm:py-12 md:py-16">
      <div className="relative container mx-auto px-4 md:px-8 py-8 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10 dark:from-primary/20 dark:via-secondary/30 dark:to-accent/20 rounded-3xl overflow-hidden border border-border/50">
        <div className="relative z-10 mx-auto text-center">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-neutral-300 sm:text-3xl md:text-5xl text-balance">
            {title}
          </h2>
          {subTitle && (
            <RichText
              richText={subTitle}
              className="mb-6 text-sm text-gray-600 sm:mb-8 text-balance sm:text-base dark:text-neutral-300"
            />
          )}
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full md:w-96">
                    <div className="flex bg-white dark:bg-gray-800 items-center border border-gray-200 dark:border-gray-700 rounded-xl p-2 drop-shadow-lg justify-between pl-4">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="rounded-e-none border-e-0 focus-visible:ring-0 outline-none bg-transparent w-full text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 h-auto py-0 px-0 shadow-none border-0"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        size="icon"
                        type="submit"
                        disabled={isSubmitting}
                        className="size-8 aspect-square bg-primary text-primary-foreground hover:bg-primary/90"
                        aria-label={isSubmitting ? "Subscribing..." : "Subscribe to newsletter"}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <LoaderCircle
                              className="animate-spin"
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          ) : (
                            <ChevronRight
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Button>
                    </div>
                    <FormMessage className="mt-2 text-left" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          {helperText && (
            <RichText
              richText={helperText}
              className="mt-3 text-sm text-gray-800 opacity-80 sm:mt-4 dark:text-neutral-300"
            />
          )}
        </div>
        {/* <InteractiveGridPattern
          className={cn(
            "absolute scale-125 inset-0 -z-0 w-full opacity-50",
            "[mask-image:radial-gradient(1000px_circle_at_center,transparent,white)]",
          )}
        /> */}
      </div>
    </section>
  );
}
