import { Skeleton } from "@/components/ui/skeleton";

const TEMP_ARR = Array.from({ length: 4 });

const SectionCardsSlotLoading = () => {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 bg-card">
      {TEMP_ARR.map((_, index) => (
        <Skeleton key={index} className="w-full h-full min-h-46 rounded-xl" />
      ))}
    </div>
  );
};

export default SectionCardsSlotLoading;
