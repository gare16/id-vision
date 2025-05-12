"use client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangleIcon,
  BadgeCheck,
  TrendingDownIcon,
  TrendingUpDown,
  TrendingUpIcon,
  User,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useBoolean } from "@/hooks/use-boolean";
import {
  SectionCardSchema,
  SectionCardsPropsSchema,
} from "@/schema/summary-card";
import { z } from "zod";

function SortableCard({
  id,
  data,
}: {
  id: string;
  data: z.infer<typeof SectionCardSchema>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="@container/card cursor-grab active:cursor-grabbing"
      data-slot="card"
    >
      <CardHeader className="relative">
        <CardDescription className="flex items-center gap-2">
          {data.title}{" "}
          {data.status === "up" ? (
            <TrendingUpIcon className="size-4" />
          ) : data.status === "down" ? (
            <TrendingDownIcon className="size-4" />
          ) : data.status === "user" ? (
            <User className="size-4" />
          ) : data.status === "stable" ? (
            <></>
          ) : data.status === "active" ? (
            <BadgeCheck className="text-green-500 size-4" />
          ) : (
            <AlertTriangleIcon className="text-red-500 size-4" />
          )}
        </CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {data.value}
        </CardTitle>
        <div className="absolute right-4 top-4">
          {data.percentage !== undefined && (
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {data.status === "up" ? (
                <TrendingUpIcon className="size-4" />
              ) : data.status === "down" ? (
                <TrendingDownIcon className="size-4" />
              ) : data.status === "stable" ? (
                <TrendingUpDown className="size-4" />
              ) : (
                <></>
              )}
              {data.percentage}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        {data.description !== undefined && (
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data.description}
          </div>
        )}
        {data.footerText !== undefined && (
          <div className="text-muted-foreground">{data.footerText}</div>
        )}
      </CardFooter>
    </Card>
  );
}

export function SectionCards(props: z.infer<typeof SectionCardsPropsSchema>) {
  const [items, setItems] = useState<string[]>([]);
  const { value, setTrue } = useBoolean(false);

  useEffect(() => {
    setTrue();
    setItems(props.data.map((item) => item.id));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over!.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  if (!value) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 px-4 lg:px-6 w-full">
        <Skeleton className="w-96 h-48" />
        <Skeleton className="w-96 h-48" />
        <Skeleton className="w-96 h-48" />
        <Skeleton className="w-96 h-48" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 px-4 lg:px-6 w-full">
          {items.map((id) => {
            const data = props.data.find((card) => card.id === id)!;
            return <SortableCard key={id} id={id} data={data} />;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
