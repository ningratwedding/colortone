"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/lib/data";

export function ProductClientContent({ reviews }: { reviews: Review[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={review.user.avatar.imageUrl}
                      data-ai-hint={review.user.avatar.imageHint}
                    />
                    <AvatarFallback>
                      {review.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {review.user.name}
                    </CardTitle>
                    <CardDescription>{review.date}</CardDescription>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Tinggalkan Ulasan</CardTitle>
            <CardDescription>
              Bagikan pemikiran Anda dengan komunitas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-medium text-sm mb-2 block">
                Peringkat Anda
              </span>
              <StarRating rating={0} />
            </div>
            <Textarea placeholder="Tulis ulasan Anda di sini..." />
            <Button>Kirim Ulasan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
