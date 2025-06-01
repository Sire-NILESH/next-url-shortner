"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal/confirm-modal";
import { useConfirmaModal } from "@/components/modals/confirm-modal/useConfirmModal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  SeedOptions,
  seedOptionsSchema,
  SeedOptionsTimeRange,
} from "@/lib/validations/SeedOptionsSchema";
import { seedDatabase } from "@/server/actions/seed/seed";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload, Loader } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = seedOptionsSchema;

const SEED_OPTIONS_TIME: SeedOptionsTimeRange[] = [
  "24H",
  "30D",
  "7D",
  "3M",
  "6M",
  "1Y",
];

async function seedDB(options: SeedOptions) {
  return await seedDatabase(options);
}

export default function SeedOptionsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const userCount = useWatch({ control: form.control, name: "userCount" });
  const maxUrlsPerUser = useWatch({
    control: form.control,
    name: "maxUrlsPerUser",
  });
  const maxClicksPerUrl = useWatch({
    control: form.control,
    name: "maxClicksPerUrl",
  });
  const flaggedUrlRate = useWatch({
    control: form.control,
    name: "flaggedUrlRate",
  });
  const period = useWatch({ control: form.control, name: "period" });

  const { isConfirmModalOpen, toggleConfirmModal } = useConfirmaModal();

  function onConfirmModalHandler() {
    seedMutation(form.getValues());
    toggleConfirmModal();
  }

  const { mutate: seedMutation, isPending } = useMutation({
    mutationFn: seedDB,
    onSuccess: (response, variables) => {
      if (response.success) {
        form.reset({
          userCount: undefined,
          maxUrlsPerUser: undefined,
          maxClicksPerUrl: undefined,
          flaggedUrlRate: undefined,
          period: undefined,
        });
        toast.success("DB seeded successfully", {
          description: `Seed options used are users:${variables.userCount}, urls: ${variables.maxUrlsPerUser}, clicks: ${variables.maxClicksPerUrl}, period: ${variables.period}`,
        });
      } else toast.error("DB seed failed", { description: response.error });
    },
    onError: () => {
      toast.error("DB seed errored", {
        description: "Try again.",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toggleConfirmModal();

      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-xl py-10"
        >
          <FormField
            control={form.control}
            name="userCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Users*</FormLabel>
                <FormControl>
                  <Input placeholder="10" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  This is the maximum number of seed users
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxUrlsPerUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URLs*</FormLabel>
                <FormControl>
                  <Input placeholder="10" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  This is the maximum URLs a seed user can have
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="flaggedUrlRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flagged URLs Rate*</FormLabel>
                <FormControl>
                  <Input placeholder="0.15" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  This is the maximum probability that a URL will be flagged
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxClicksPerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clicks*</FormLabel>
                <FormControl>
                  <Input placeholder="10" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  This is the maximum number of clicks a seed URL will have
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Time option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SEED_OPTIONS_TIME.map((timeOption) => (
                      <SelectItem key={timeOption} value={timeOption}>
                        {timeOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a period over which the seed should be generated
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estimates */}
          <div className="my-10 space-y-4">
            <p className="text-sm italic">
              This seed will roughly create these records in the DB
            </p>

            <ul className="w-full sm:max-w-xs text-sm space-y-1.5 text-muted-foreground">
              <li className="grid grid-cols-2">
                <em className="text-foreground">Users:</em>
                <span>{userCount ? userCount : 0}</span>
              </li>
              <Separator />
              <li className="grid grid-cols-2">
                <em className="text-foreground">URLs: </em>
                <span>
                  {userCount && maxUrlsPerUser ? userCount * maxUrlsPerUser : 0}
                </span>
              </li>
              <Separator />
              <li className="grid grid-cols-2">
                <em className="text-foreground">Flagged URLs: </em>
                <span>
                  {flaggedUrlRate ? Math.round(flaggedUrlRate * 100) : 0}%
                </span>
              </li>
              <Separator />
              <li className="grid grid-cols-2">
                <em className="text-foreground">Clicks: </em>
                <span>
                  {userCount && maxUrlsPerUser && maxClicksPerUrl
                    ? userCount * maxUrlsPerUser * maxClicksPerUrl
                    : 0}
                </span>
              </li>
              <Separator />
              <li className="grid grid-cols-2">
                <em className="text-foreground">Peroid: </em>
                <span>{period ? period : "unknown"}</span>
              </li>
            </ul>
          </div>

          <Button type="submit" className="w-full sm:max-w-fit">
            <div className="font-medium flex items-center gap-2">
              {isPending ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <CloudUpload className="size-4" />
              )}
              {isPending ? "Seeding..." : "Seed Database"}
            </div>
          </Button>
        </form>
      </Form>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={toggleConfirmModal}
        onConfirm={onConfirmModalHandler}
        // onConfirm={toggleConfirmModal}
        title="Seed Database"
        description={"Are you sure you want to seed DB with these options?"}
        confirmText="Seed"
      />
    </div>
  );
}
