
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  feedback: z.string().min(10, {
    message: "Feedback must be at least 10 characters.",
  }),
});

export const Feedback = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      feedback: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Thank you for your feedback!",
      description: "We'll get back to you soon.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
          Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">Feedback</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          We'd love to hear your thoughts and suggestions
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter your full name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  We'll never share your email with anyone else.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your thoughts, suggestions, or concerns..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Feel free to share any thoughts or suggestions you have.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Submit Feedback</Button>
        </form>
      </Form>
    </div>
  );
};

export default Feedback;
