import { Star } from "lucide-react";
import { useState } from "react";

export function StarRating({ rating = 0, onChange }: { rating?: number; onChange: (rating: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`h-4 w-4 ${
              star <= (hover || rating)
                ? "fill-primary text-primary"
                : "fill-muted text-muted-foreground/30 hover:text-primary/50"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}
