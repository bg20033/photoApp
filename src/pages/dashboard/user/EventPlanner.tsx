import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  Users,
  Camera,
  Trash2,
} from "lucide-react";

// Event Types
type EventType = "fejese" | "martese" | "photoshooting" | "other";

interface EventTypeOption {
  value: EventType;
  label: string;
  color: string;
}

const EVENT_TYPES: EventTypeOption[] = [
  { value: "fejese", label: "Fejese (Engagement)", color: "bg-pink-500" },
  { value: "martese", label: "Martese (Wedding)", color: "bg-red-500" },
  { value: "photoshooting", label: "Photoshooting", color: "bg-blue-500" },
  { value: "other", label: "Other", color: "bg-gray-500" },
];

// Time slot type
type TimeSlotType = "paradite" | "pasdite" | "custom";

interface TimeSlotOption {
  value: TimeSlotType;
  label: string;
}

const TIME_SLOTS: TimeSlotOption[] = [
  { value: "paradite", label: "Paradite (Morning - 08:00 to 12:00)" },
  { value: "pasdite", label: "Pasdite (Afternoon - 13:00 to 17:00)" },
  { value: "custom", label: "Custom" },
];

// Staff options
const STAFF_OPTIONS = [
  { id: "photographer1", name: "John Doe - Photographer" },
  { id: "photographer2", name: "Jane Smith - Photographer" },
  { id: "videographer1", name: "Mike Johnson - Videographer" },
  { id: "assistant1", name: "Sarah Brown - Assistant" },
  { id: "assistant2", name: "Tom Wilson - Assistant" },
  { id: "editor1", name: "Emily Davis - Editor" },
];

// Equipment options
const EQUIPMENT_OPTIONS = [
  { id: "camera1", name: "Canon EOS R5" },
  { id: "camera2", name: "Sony A7III" },
  { id: "lens1", name: "24-70mm f/2.8 Lens" },
  { id: "lens2", name: "85mm f/1.4 Lens" },
  { id: "light1", name: "Studio Lighting Kit" },
  { id: "drone1", name: "DJI Mavic Pro" },
  { id: "tripod1", name: "Professional Tripod" },
  { id: "mic1", name: "Wireless Microphone" },
];

interface Event {
  id: string;
  date: string;
  title: string;
  description: string;
  type: EventType;
  timeSlotType: TimeSlotType;
  startTime?: string;
  endTime?: string;
  staff: string[];
  equipment: string[];
}

// Helper functions for calendar
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function EventPlanner() {
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Events state
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      date: formatDateKey(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      ),
      title: "Sample Wedding",
      description: "Wedding photoshoot for the Johnson family",
      type: "martese",
      timeSlotType: "pasdite",
      staff: ["photographer1", "assistant1"],
      equipment: ["camera1", "lens1", "lens2"],
    },
  ]);

  // Form state
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    type: "martese",
    timeSlotType: "paradite",
    startTime: "08:00",
    endTime: "12:00",
    staff: [],
    equipment: [],
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Get events for a specific date
  const getEventsForDate = (dateKey: string): Event[] => {
    return events.filter((event) => event.date === dateKey);
  };

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Modal handlers
  const openModal = (dateKey: string, event?: Event) => {
    setSelectedDate(dateKey);
    if (event) {
      setEditingEvent(event);
      setFormData({ ...event });
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        type: "martese",
        timeSlotType: "paradite",
        startTime: "08:00",
        endTime: "12:00",
        staff: [],
        equipment: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingEvent(null);
  };

  // Form handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const newEvent: Event = {
      id: editingEvent?.id || Date.now().toString(),
      date: selectedDate,
      title: formData.title || "",
      description: formData.description || "",
      type: (formData.type as EventType) || "other",
      timeSlotType: (formData.timeSlotType as TimeSlotType) || "paradite",
      startTime: formData.startTime,
      endTime: formData.endTime,
      staff: formData.staff || [],
      equipment: formData.equipment || [],
    };

    if (editingEvent) {
      setEvents(events.map((e) => (e.id === editingEvent.id ? newEvent : e)));
    } else {
      setEvents([...events, newEvent]);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (editingEvent) {
      setEvents(events.filter((e) => e.id !== editingEvent.id));
      closeModal();
    }
  };

  // Multi-select handlers
  const toggleStaff = (staffId: string) => {
    const current = formData.staff || [];
    if (current.includes(staffId)) {
      setFormData({ ...formData, staff: current.filter((s) => s !== staffId) });
    } else {
      setFormData({ ...formData, staff: [...current, staffId] });
    }
  };

  const toggleEquipment = (equipmentId: string) => {
    const current = formData.equipment || [];
    if (current.includes(equipmentId)) {
      setFormData({
        ...formData,
        equipment: current.filter((e) => e !== equipmentId),
      });
    } else {
      setFormData({ ...formData, equipment: [...current, equipmentId] });
    }
  };

  const getEventTypeColor = (type: EventType): string => {
    return EVENT_TYPES.find((t) => t.value === type)?.color || "bg-gray-500";
  };

  const getEventTypeLabel = (type: EventType): string => {
    return EVENT_TYPES.find((t) => t.value === type)?.label || "Other";
  };

  const getTimeDisplay = (event: Event): string => {
    if (event.timeSlotType === "custom" && event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    return (
      TIME_SLOTS.find((t) => t.value === event.timeSlotType)
        ?.label.split("(")[0]
        .trim() || ""
    );
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [firstDay, daysInMonth]);

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Event Planner</h1>
          <p className="text-muted-foreground mt-1">
            Plan and manage your photography events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[150px] text-center">
            <span className="text-lg font-semibold">{monthNames[month]}</span>
            <span className="text-lg text-muted-foreground ml-2">{year}</span>
          </div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {EVENT_TYPES.map((type) => (
          <div key={type.value} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${type.color}`} />
            <span className="text-sm text-muted-foreground">{type.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-24 md:h-32" />;
              }

              const dateKey = formatDateKey(year, month, day);
              const dayEvents = getEventsForDate(dateKey);
              const isToday =
                dateKey ===
                formatDateKey(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate(),
                );

              return (
                <div
                  key={day}
                  className={`h-24 md:h-32 border rounded-lg p-2 cursor-pointer transition-colors hover:bg-muted/50 ${
                    isToday ? "bg-primary/5 border-primary" : ""
                  }`}
                  onClick={() => openModal(dateKey)}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}
                    >
                      {day}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(dateKey);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs px-1.5 py-0.5 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(dateKey, event);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground px-1.5">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingEvent ? "Edit Event" : "Add New Event"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Display */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{selectedDate}</span>
          </div>

          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Event Type Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="eventType">Event Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as EventType })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${type.color}`} />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Slot Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="timeSlot" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Slot
            </Label>
            <Select
              value={formData.timeSlotType}
              onValueChange={(value) => {
                const newTimeSlotType = value as TimeSlotType;
                let newStartTime = formData.startTime;
                let newEndTime = formData.endTime;

                if (newTimeSlotType === "paradite") {
                  newStartTime = "08:00";
                  newEndTime = "12:00";
                } else if (newTimeSlotType === "pasdite") {
                  newStartTime = "13:00";
                  newEndTime = "17:00";
                }

                setFormData({
                  ...formData,
                  timeSlotType: newTimeSlotType,
                  startTime: newStartTime,
                  endTime: newEndTime,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Time Picker - Only show when Custom is selected */}
          {formData.timeSlotType === "custom" && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
              <Label className="text-sm font-medium">Custom Time Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="startTime"
                    className="text-xs text-muted-foreground"
                  >
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="endTime"
                    className="text-xs text-muted-foreground"
                  >
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <Separator />

          {/* Staff Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assigned Staff
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
              {STAFF_OPTIONS.map((staff) => (
                <label
                  key={staff.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.staff?.includes(staff.id)}
                    onChange={() => toggleStaff(staff.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{staff.name}</span>
                </label>
              ))}
            </div>
            {formData.staff && formData.staff.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.staff.map((staffId) => {
                  const staff = STAFF_OPTIONS.find((s) => s.id === staffId);
                  return staff ? (
                    <Badge
                      key={staffId}
                      variant="secondary"
                      className="text-xs"
                    >
                      {staff.name.split(" - ")[0]}
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Equipment Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Equipment
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <label
                  key={equipment.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.equipment?.includes(equipment.id)}
                    onChange={() => toggleEquipment(equipment.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{equipment.name}</span>
                </label>
              ))}
            </div>
            {formData.equipment && formData.equipment.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.equipment.map((equipmentId) => {
                  const equipment = EQUIPMENT_OPTIONS.find(
                    (e) => e.id === equipmentId,
                  );
                  return equipment ? (
                    <Badge
                      key={equipmentId}
                      variant="outline"
                      className="text-xs"
                    >
                      {equipment.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            {editingEvent ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
