"use client";

import { Check } from "lucide-react";
import { useState, useEffect } from "react";

import { useMQTT } from "@/context/mqtt-context";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ActiveRfid {
  rfidTag: string;
  nik: string | null;
  status: boolean;
  visitor?: {
    name: string;
  } | null;
}

interface CardSelectionProps {
  activeRfid?: ActiveRfid[];
  onRFIDSelect?: (rfidTag: string) => void;
}

export default function CardSelection({
  activeRfid = [],
  onRFIDSelect,
}: CardSelectionProps) {
  const [rfidSelect, setRfidSelect] = useState("");
  const [rfidData, setRfidData] = useState<{
    rfidTag: string;
    status: boolean;
    visitorName?: string;
  } | null>(null);
  const [selectedRfid, setSelectedRfid] = useState<{
    rfidTag: string;
    visitorName?: string;
  } | null>(null);

  const { lastRFIDEvent, messages } = useMQTT();

  const activeRfids = activeRfid.filter((rfid) => rfid.status);

  // Update RFID selection and data when MQTT event occurs
  useEffect(() => {
    if (
      lastRFIDEvent?.rfidTag &&
      lastRFIDEvent.rfidTag !== rfidSelect &&
      !selectedRfid
    ) {
      const rfidTag = lastRFIDEvent.rfidTag;
      setRfidSelect(rfidTag);
      setRfidData(null);
      onRFIDSelect?.(rfidTag);
    }
  }, [lastRFIDEvent, onRFIDSelect, rfidSelect, selectedRfid]);

  // Auto-check RFID when MQTT message is received
  useEffect(() => {
    if (messages?.rfidTag && messages.rfidTag !== rfidSelect && !selectedRfid) {
      const rfidTag = messages.rfidTag;
      setRfidSelect(rfidTag);
      setRfidData(null);
      onRFIDSelect?.(rfidTag);
    }
  }, [messages, onRFIDSelect, rfidSelect, selectedRfid]);

  // Update rfidData when rfidSelect changes
  useEffect(() => {
    if (!rfidSelect) {
      setRfidData(null);
      return;
    }

    const rfidInfo = activeRfid.find((rfid) => rfid.rfidTag === rfidSelect);
    if (rfidInfo) {
      setRfidData({
        rfidTag: rfidInfo.rfidTag,
        status: rfidInfo.status,
        visitorName: rfidInfo.visitor?.name || undefined,
      });
    } else {
      // RFID not in active list, show as inactive
      setRfidData({
        rfidTag: rfidSelect,
        status: false,
        visitorName: undefined,
      });
    }
  }, [rfidSelect, activeRfid]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>RFID Card Selection</CardTitle>
        <CardDescription>
          Check and select an RFID tag for the visitor
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rfid-select">RFID Tag</Label>
          <Select
            value={rfidSelect}
            onValueChange={(value) => {
              setRfidSelect(value);
              const rfidInfo = activeRfid.find(
                (rfid) => rfid.rfidTag === value,
              );
              const selected = {
                rfidTag: value,
                visitorName: rfidInfo?.visitor?.name,
              };
              setSelectedRfid(selected);
              onRFIDSelect?.(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an active RFID tag" />
            </SelectTrigger>
            <SelectContent>
              {activeRfids.map((rfid) => (
                <SelectItem key={rfid.rfidTag} value={rfid.rfidTag}>
                  {rfid.visitor?.name
                    ? `${rfid.rfidTag} - ${rfid.visitor.name}`
                    : rfid.rfidTag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {rfidData && !selectedRfid && (
          <div
            className={cn(
              "rounded-lg border p-4 space-y-2",
              rfidData.status
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200",
            )}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">RFID Tag:</span>
              <span className="text-sm font-mono">{rfidData.rfidTag}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status:</span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  rfidData.status ? "text-green-600" : "text-red-600",
                )}
              >
                {rfidData.status ? "Active" : "Inactive"}
              </span>
            </div>
            {rfidData.visitorName && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Visitor:</span>
                <span className="text-sm">{rfidData.visitorName}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {selectedRfid && (
          <div className="relative w-full rounded-lg border-2 border-green-500 bg-green-50 p-4 space-y-2 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500 opacity-50">
              <Check className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-green-700">
                  Selected RFID:
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm font-medium">RFID Tag:</span>
                  <span className="text-sm font-mono text-green-900">
                    {selectedRfid.rfidTag}
                  </span>
                </div>
                {selectedRfid.visitorName && (
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-sm font-medium">Visitor:</span>
                    <span className="text-sm text-green-900">
                      {selectedRfid.visitorName}
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedRfid(null);
                  setRfidSelect("");
                  setRfidData(null);
                }}
                className="shrink-0"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
