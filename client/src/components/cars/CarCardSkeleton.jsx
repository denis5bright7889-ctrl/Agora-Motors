// client/src/components/cars/CarCardSkeleton.jsx

export default function CarCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[16/10] skeleton" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-32 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3].map(i => <div key={i} className="skeleton h-8 rounded-lg" />)}
        </div>
        <div className="skeleton h-3 w-24 rounded-lg" />
      </div>
    </div>
  );
}
