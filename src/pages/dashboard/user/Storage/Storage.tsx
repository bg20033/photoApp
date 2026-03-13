import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import EquipmentStorage from "./EquipmentStorage";

// ============================================
// DATA MODELS & TYPES
// ============================================

type SensorType = "full-frame" | "aps-c";
type MountType = "e-mount" | "f-mount" | "rf" | "l-mount" | "x-mount";
type UsageType = "photo" | "video" | "hybrid";
type StorageType = "ssd" | "cfexpress" | "sd";
type AccessoryType = "cage" | "monitor" | "audio" | "mounting";

interface CameraBody {
  id: string;
  name: string;
  photo?: string;
  sensorType: SensorType;
  mountType: MountType;
  usage: UsageType;
  supportedStorage: StorageType[];
  batteryType: string;
  notes: string;
}

interface Lens {
  id: string;
  name: string;
  photo?: string;
  mountType: MountType;
  imageCircle: SensorType;
  usage: UsageType;
  notesPhoto: string;
  notesVideo: string;
}

interface Storage {
  id: string;
  type: StorageType;
  capacity: string;
  speedRating: string;
  supportedFormats: string[];
}

interface Battery {
  id: string;
  model: string;
  capacity: string;
  compatibleBodies: string[];
}

interface Accessory {
  id: string;
  name: string;
  type: AccessoryType;
  photo?: string;
  compatibleMounts: MountType[];
}

interface CameraSetup {
  id: string;
  name: string;
  bodyId: string;
  lensId: string;
  storageIds: string[];
  batteryIds: string[];
  accessoryIds: string[];
  photo?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface SuitabilityScores {
  photo: number;
  video: number;
  overall: number;
}

// ============================================
// SAMPLE DATA
// ============================================

const sampleBodies: CameraBody[] = [
  {
    id: "body-1",
    name: "Sony A7 IV",
    sensorType: "full-frame",
    mountType: "e-mount",
    usage: "hybrid",
    supportedStorage: ["sd", "cfexpress"],
    batteryType: "NP-FZ100",
    notes:
      "Excellent hybrid camera with 33MP sensor. Great for both photo and video work.",
  },
  {
    id: "body-2",
    name: "Fujifilm X-T5",
    sensorType: "aps-c",
    mountType: "x-mount",
    usage: "photo",
    supportedStorage: ["sd"],
    batteryType: "NP-W235",
    notes:
      "40MP APS-C camera, excellent for photography with film simulations.",
  },
];

const sampleLenses: Lens[] = [
  {
    id: "lens-1",
    name: "Sony FE 24-70mm f/2.8 GM II",
    mountType: "e-mount",
    imageCircle: "full-frame",
    usage: "hybrid",
    notesPhoto:
      "Sharp across the frame, excellent for portraits and landscapes.",
    notesVideo: "Minimal breathing, fast and quiet AF, perfect for video work.",
  },
  {
    id: "lens-2",
    name: "Sony E 16-55mm f/2.8 G",
    mountType: "e-mount",
    imageCircle: "aps-c",
    usage: "hybrid",
    notesPhoto: "Standard zoom for APS-C, very sharp with fast aperture.",
    notesVideo: "Good for APS-C video, compact and lightweight.",
  },
  {
    id: "lens-3",
    name: "Fujifilm XF 56mm f/1.2 R",
    mountType: "x-mount",
    imageCircle: "aps-c",
    usage: "photo",
    notesPhoto: "Legendary portrait lens, beautiful bokeh and rendering.",
    notesVideo: "Can be used for video but AF is slower than modern lenses.",
  },
  {
    id: "lens-4",
    name: "Fujifilm XF 18-55mm f/2.8-4",
    mountType: "x-mount",
    imageCircle: "aps-c",
    usage: "hybrid",
    notesPhoto: "Versatile kit lens, good image quality for everyday use.",
    notesVideo: "Has OIS which helps with handheld video shooting.",
  },
];

const sampleStorage: Storage[] = [
  {
    id: "storage-1",
    type: "ssd",
    capacity: "1TB",
    speedRating: "1000MB/s read",
    supportedFormats: ["RAW", "ProRes", "H.265"],
  },
  {
    id: "storage-2",
    type: "cfexpress",
    capacity: "128GB",
    speedRating: "1700MB/s read, 1480MB/s write",
    supportedFormats: ["RAW", "4K 120fps", "8K"],
  },
  {
    id: "storage-3",
    type: "sd",
    capacity: "256GB",
    speedRating: "V90 - 280MB/s",
    supportedFormats: ["RAW", "4K 60fps"],
  },
];

const sampleBatteries: Battery[] = [
  {
    id: "battery-1",
    model: "Sony NP-FZ100",
    capacity: "2280mAh",
    compatibleBodies: ["body-1"],
  },
  {
    id: "battery-2",
    model: "Fujifilm NP-W235",
    capacity: "2200mAh",
    compatibleBodies: ["body-2"],
  },
];

const sampleAccessories: Accessory[] = [
  {
    id: "acc-1",
    name: "SmallRig Full Cage",
    type: "cage",
    compatibleMounts: ["e-mount"],
  },
  {
    id: "acc-2",
    name: "Atomos Ninja V",
    type: "monitor",
    compatibleMounts: ["e-mount", "x-mount", "rf", "l-mount"],
  },
  {
    id: "acc-3",
    name: "Rode VideoMic Pro+",
    type: "audio",
    compatibleMounts: ["e-mount", "x-mount", "rf", "l-mount"],
  },
  {
    id: "acc-4",
    name: "Arca-Swiss Quick Release",
    type: "mounting",
    compatibleMounts: ["e-mount", "x-mount", "rf", "l-mount"],
  },
];

const sampleSetups: CameraSetup[] = [
  {
    id: "setup-1",
    name: "Sony Hybrid Video Rig",
    bodyId: "body-1",
    lensId: "lens-1",
    storageIds: ["storage-1", "storage-2"],
    batteryIds: ["battery-1"],
    accessoryIds: ["acc-1", "acc-2", "acc-3"],
  },
  {
    id: "setup-2",
    name: "Fuji Portrait Kit",
    bodyId: "body-2",
    lensId: "lens-3",
    storageIds: ["storage-3"],
    batteryIds: ["battery-2"],
    accessoryIds: [],
  },
];

// ============================================
// VALIDATION LOGIC
// ============================================

function validateSetup(
  setup: Partial<CameraSetup>,
  bodies: CameraBody[],
  lenses: Lens[],
  storage: Storage[],
  batteries: Battery[],
  accessories: Accessory[],
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const body = bodies.find((b) => b.id === setup.bodyId);
  const lens = lenses.find((l) => l.id === setup.lensId);
  const setupStorage = storage.filter((s) => setup.storageIds?.includes(s.id));
  const setupBatteries = batteries.filter((b) =>
    setup.batteryIds?.includes(b.id),
  );
  const setupAccessories = accessories.filter((a) =>
    setup.accessoryIds?.includes(a.id),
  );

  // Critical validations
  if (body && lens) {
    if (body.mountType !== lens.mountType) {
      errors.push(
        `Mount mismatch: ${body.name} (${body.mountType}) cannot use ${lens.name} (${lens.mountType})`,
      );
    }
  }

  if (body && setupStorage.length > 0) {
    const invalidStorage = setupStorage.filter(
      (s) => !body.supportedStorage.includes(s.type),
    );
    if (invalidStorage.length > 0) {
      errors.push(
        `Storage incompatibility: ${body.name} doesn't support ${invalidStorage.map((s) => s.type).join(", ")}`,
      );
    }
  }

  if (setupBatteries.length > 0 && body) {
    const incompatibleBatteries = setupBatteries.filter(
      (b) => !b.compatibleBodies.includes(body.id),
    );
    if (incompatibleBatteries.length > 0) {
      errors.push(
        `Battery incompatibility: ${incompatibleBatteries.map((b) => b.model).join(", ")} not compatible with ${body.name}`,
      );
    }
  }

  // Warnings
  if ((body && body.usage === "video") || body?.usage === "hybrid") {
    const hasFastStorage = setupStorage.some(
      (s) => s.type === "ssd" || s.type === "cfexpress",
    );
    if (!hasFastStorage && setupStorage.length > 0) {
      warnings.push(
        "Video usage detected - consider using SSD or CFexpress for reliable high-bitrate recording",
      );
    }
  }

  if (body && lens) {
    if (body.sensorType === "full-frame" && lens.imageCircle === "aps-c") {
      warnings.push(
        "APS-C lens on Full Frame body - camera will use crop mode (reduced resolution)",
      );
    }
    if (body.sensorType === "aps-c" && lens.imageCircle === "full-frame") {
      warnings.push(
        "Full Frame lens on APS-C body - effective focal length will be ~1.5x longer",
      );
    }
  }

  if (setupBatteries.length === 0) {
    warnings.push("No batteries selected - you'll need power for field use");
  }

  if (
    (body?.usage === "video" || body?.usage === "hybrid") &&
    setupAccessories.length > 0
  ) {
    const hasCage = setupAccessories.some((a) => a.type === "cage");
    const hasMonitor = setupAccessories.some((a) => a.type === "monitor");
    if (!hasCage)
      warnings.push(
        "Consider adding a cage for video work (better handling and mounting options)",
      );
    if (!hasMonitor)
      warnings.push(
        "Consider adding an external monitor for better exposure and focus",
      );
  }

  return { isValid: errors.length === 0, errors, warnings };
}

function calculateSuitabilityScores(
  setup: CameraSetup,
  bodies: CameraBody[],
  lenses: Lens[],
  storage: Storage[],
  accessories: Accessory[],
): SuitabilityScores {
  const body = bodies.find((b) => b.id === setup.bodyId);
  const lens = lenses.find((l) => l.id === setup.lensId);
  const setupStorage = storage.filter((s) => setup.storageIds.includes(s.id));
  const setupAccessories = accessories.filter((a) =>
    setup.accessoryIds.includes(a.id),
  );

  let photoScore = 0;
  let videoScore = 0;

  if (body) {
    if (body.usage === "photo" || body.usage === "hybrid") photoScore += 40;
    if (body.usage === "video" || body.usage === "hybrid") videoScore += 40;
  }

  if (lens) {
    if (lens.usage === "photo" || lens.usage === "hybrid") photoScore += 30;
    if (lens.usage === "video" || lens.usage === "hybrid") videoScore += 30;

    if (
      body?.sensorType === "full-frame" &&
      lens.imageCircle === "full-frame"
    ) {
      photoScore += 10;
      videoScore += 10;
    }
  }

  const hasFastStorage = setupStorage.some(
    (s) => s.type === "ssd" || s.type === "cfexpress",
  );
  if (hasFastStorage) videoScore += 15;
  else if (setupStorage.length > 0) videoScore += 5;

  if (setupAccessories.some((a) => a.type === "monitor")) videoScore += 5;
  if (setupAccessories.some((a) => a.type === "audio")) videoScore += 5;

  return {
    photo: Math.min(100, photoScore),
    video: Math.min(100, videoScore),
    overall: Math.min(100, Math.round((photoScore + videoScore) / 2)),
  };
}

// ============================================
// HELPER COMPONENTS
// ============================================

const PhotoPlaceholder: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => (
  <div
    className={cn(
      "flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 text-slate-400",
      className,
    )}
  >
    {children || (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    )}
  </div>
);

const CompatibilityBadge: React.FC<{
  status: "valid" | "warning" | "error";
  children: React.ReactNode;
}> = ({ status, children }) => {
  const colors = {
    valid: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Badge variant="outline" className={cn(colors[status], "font-medium")}>
      {status === "valid" && "✅ "}
      {status === "warning" && "⚠️ "}
      {status === "error" && "❌ "}
      {children}
    </Badge>
  );
};

// ============================================
// EQUIPMENT BUILDER MODAL
// ============================================

interface EquipmentBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (setup: CameraSetup) => void;
  bodies: CameraBody[];
  lenses: Lens[];
  storage: Storage[];
  batteries: Battery[];
  accessories: Accessory[];
  onAddBody: (body: CameraBody) => void;
  onAddLens: (lens: Lens) => void;
  onAddStorage: (s: Storage) => void;
  onAddBattery: (b: Battery) => void;
  onAddAccessory: (a: Accessory) => void;
  editingSetup?: CameraSetup | null;
}

const EquipmentBuilder: React.FC<EquipmentBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  bodies,
  lenses,
  storage,
  batteries,
  accessories,
  onAddBody,
  onAddLens,
  onAddStorage,
  onAddBattery,
  onAddAccessory,
  editingSetup,
}) => {
  const [step, setStep] = useState(1);
  const [setup, setSetup] = useState<Partial<CameraSetup>>(
    editingSetup || {
      name: "",
      bodyId: "",
      lensId: "",
      storageIds: [],
      batteryIds: [],
      accessoryIds: [],
    },
  );

  const [showBodyForm, setShowBodyForm] = useState(false);
  const [showLensForm, setShowLensForm] = useState(false);
  const [showStorageForm, setShowStorageForm] = useState(false);
  const [showBatteryForm, setShowBatteryForm] = useState(false);
  const [showAccessoryForm, setShowAccessoryForm] = useState(false);

  const selectedBody = bodies.find((b) => b.id === setup.bodyId);
  const selectedLens = lenses.find((l) => l.id === setup.lensId);

  const validation = useMemo(
    () => validateSetup(setup, bodies, lenses, storage, batteries, accessories),
    [setup, bodies, lenses, storage, batteries, accessories],
  );

  const handleSave = () => {
    if (setup.name && setup.bodyId && setup.lensId) {
      onSave({
        ...(setup as CameraSetup),
        id: editingSetup?.id || `setup-${Date.now()}`,
      });
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSetup({
      name: "",
      bodyId: "",
      lensId: "",
      storageIds: [],
      batteryIds: [],
      accessoryIds: [],
    });
    setShowBodyForm(false);
    setShowLensForm(false);
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="mb-6 flex items-center justify-between">
      {[1, 2, 3, 4, 5, 6].map((s, idx) => (
        <React.Fragment key={s}>
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
              step === s
                ? "bg-primary text-primary-foreground"
                : step > s
                  ? "bg-green-500 text-white"
                  : "bg-slate-200 text-slate-500",
            )}
          >
            {step > s ? "✓" : s}
          </div>
          {idx < 5 && (
            <div
              className={cn(
                "h-1 flex-1",
                step > s ? "bg-green-500" : "bg-slate-200",
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Step 1: Select/Create Body
  const renderBodyStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Step 1: Select Camera Body</h3>

      {!showBodyForm ? (
        <>
          <div className="grid max-h-64 grid-cols-2 gap-3 overflow-y-auto">
            {bodies.map((body) => (
              <div
                key={body.id}
                onClick={() => setSetup({ ...setup, bodyId: body.id })}
                className={cn(
                  "cursor-pointer rounded-lg border-2 p-3 transition-all",
                  setup.bodyId === body.id
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                <PhotoPlaceholder className="mb-2 h-24 w-full rounded" />
                <p className="font-medium">{body.name}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {body.sensorType}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {body.mountType}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowBodyForm(true)}
            className="w-full"
          >
            + Create New Body
          </Button>
        </>
      ) : (
        <BodyForm
          onSave={(body) => {
            onAddBody(body);
            setSetup({ ...setup, bodyId: body.id });
            setShowBodyForm(false);
          }}
          onCancel={() => setShowBodyForm(false)}
        />
      )}
    </div>
  );

  // Step 2: Select/Create Lens
  const renderLensStep = () => {
    const compatibleLenses = selectedBody
      ? lenses.filter((l) => l.mountType === selectedBody.mountType)
      : lenses;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Step 2: Select Lens</h3>

        {selectedBody && (
          <Alert>
            <AlertDescription>
              Selected body: <strong>{selectedBody.name}</strong> (
              {selectedBody.mountType})
            </AlertDescription>
          </Alert>
        )}

        {!showLensForm ? (
          <>
            {compatibleLenses.length === 0 ? (
              <Alert variant="destructive">
                <AlertDescription>
                  No compatible lenses found for {selectedBody?.mountType}{" "}
                  mount. Please create a new lens.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid max-h-64 grid-cols-2 gap-3 overflow-y-auto">
                {compatibleLenses.map((lens) => {
                  const isCompatible =
                    selectedBody?.sensorType === lens.imageCircle ||
                    (selectedBody?.sensorType === "full-frame" &&
                      lens.imageCircle === "aps-c");

                  return (
                    <div
                      key={lens.id}
                      onClick={() => setSetup({ ...setup, lensId: lens.id })}
                      className={cn(
                        "cursor-pointer rounded-lg border-2 p-3 transition-all",
                        setup.lensId === lens.id
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:border-slate-300",
                        !isCompatible && "opacity-50",
                      )}
                    >
                      <PhotoPlaceholder className="mb-2 h-24 w-full rounded" />
                      <p className="font-medium">{lens.name}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {lens.mountType}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {lens.imageCircle}
                        </Badge>
                      </div>
                      {selectedBody?.sensorType === "full-frame" &&
                        lens.imageCircle === "aps-c" && (
                          <p className="mt-1 text-xs text-yellow-600">
                            ⚠️ Crop mode
                          </p>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => setShowLensForm(true)}
              className="w-full"
            >
              + Create New Lens
            </Button>
          </>
        ) : (
          <LensForm
            mountType={selectedBody?.mountType}
            onSave={(lens) => {
              onAddLens(lens);
              setSetup({ ...setup, lensId: lens.id });
              setShowLensForm(false);
            }}
            onCancel={() => setShowLensForm(false)}
          />
        )}
      </div>
    );
  };

  // Step 3: Add Storage
  const renderStorageStep = () => {
    const supportedTypes = selectedBody?.supportedStorage || [];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Step 3: Add Storage (Optional)
        </h3>

        {selectedBody && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-600">Supported:</span>
            {supportedTypes.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>
        )}

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {storage.map((s) => {
            const isSupported = supportedTypes.includes(s.type);
            const isSelected = setup.storageIds?.includes(s.id);

            return (
              <div
                key={s.id}
                onClick={() => {
                  if (!isSupported) return;
                  const newIds = isSelected
                    ? setup.storageIds?.filter((id) => id !== s.id) || []
                    : [...(setup.storageIds || []), s.id];
                  setSetup({ ...setup, storageIds: newIds });
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border-2 p-3",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-slate-200",
                  !isSupported && "cursor-not-allowed opacity-50",
                )}
              >
                <div>
                  <p className="font-medium">
                    {s.type.toUpperCase()} - {s.capacity}
                  </p>
                  <p className="text-sm text-slate-500">{s.speedRating}</p>
                </div>
                {isSelected && <span className="text-primary">✓</span>}
                {!isSupported && (
                  <span className="text-xs text-red-500">Not supported</span>
                )}
              </div>
            );
          })}
        </div>

        {selectedBody?.usage === "video" &&
          !setup.storageIds?.some((id) => {
            const s = storage.find((st) => st.id === id);
            return s?.type === "ssd" || s?.type === "cfexpress";
          }) && (
            <Alert className="bg-yellow-50">
              <AlertDescription className="text-yellow-800">
                ⚠️ Video usage detected. Consider adding SSD or CFexpress for
                reliable recording.
              </AlertDescription>
            </Alert>
          )}

        <Button
          variant="outline"
          onClick={() => setShowStorageForm(true)}
          className="w-full"
        >
          + Create New Storage
        </Button>

        <Modal
          isOpen={showStorageForm}
          onClose={() => setShowStorageForm(false)}
          title="Add New Storage"
        >
          <StorageForm
            onSave={(s) => {
              onAddStorage(s);
              setSetup({
                ...setup,
                storageIds: [...(setup.storageIds || []), s.id],
              });
              setShowStorageForm(false);
            }}
            onCancel={() => setShowStorageForm(false)}
          />
        </Modal>
      </div>
    );
  };

  // Step 4: Add Batteries
  const renderBatteryStep = () => {
    const compatibleBatteries = selectedBody
      ? batteries.filter((b) => b.compatibleBodies.includes(selectedBody.id))
      : batteries;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Step 4: Add Batteries (Optional)
        </h3>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {compatibleBatteries.length === 0 ? (
            <p className="text-center text-slate-500">
              No compatible batteries found.
            </p>
          ) : (
            compatibleBatteries.map((battery) => {
              const isSelected = setup.batteryIds?.includes(battery.id);

              return (
                <div
                  key={battery.id}
                  onClick={() => {
                    const newIds = isSelected
                      ? setup.batteryIds?.filter((id) => id !== battery.id) ||
                        []
                      : [...(setup.batteryIds || []), battery.id];
                    setSetup({ ...setup, batteryIds: newIds });
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg border-2 p-3",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:border-slate-300",
                  )}
                >
                  <div>
                    <p className="font-medium">{battery.model}</p>
                    <p className="text-sm text-slate-500">{battery.capacity}</p>
                  </div>
                  {isSelected && <span className="text-primary">✓</span>}
                </div>
              );
            })
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => setShowBatteryForm(true)}
          className="w-full"
        >
          + Create New Battery
        </Button>

        <Modal
          isOpen={showBatteryForm}
          onClose={() => setShowBatteryForm(false)}
          title="Add New Battery"
        >
          <BatteryForm
            compatibleBodyId={selectedBody?.id}
            onSave={(b) => {
              onAddBattery(b);
              setSetup({
                ...setup,
                batteryIds: [...(setup.batteryIds || []), b.id],
              });
              setShowBatteryForm(false);
            }}
            onCancel={() => setShowBatteryForm(false)}
          />
        </Modal>
      </div>
    );
  };

  // Step 5: Add Accessories
  const renderAccessoryStep = () => {
    const accessoryTypes: AccessoryType[] = [
      "cage",
      "monitor",
      "audio",
      "mounting",
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Step 5: Add Accessories (Optional)
        </h3>

        {accessoryTypes.map((type) => {
          const typeAccessories = accessories.filter((a) => a.type === type);
          if (typeAccessories.length === 0) return null;

          return (
            <div key={type}>
              <h4 className="mb-2 text-sm font-medium capitalize text-slate-600">
                {type}
              </h4>
              <div className="space-y-2">
                {typeAccessories.map((accessory) => {
                  const isCompatible = selectedBody
                    ? accessory.compatibleMounts.includes(
                        selectedBody.mountType,
                      )
                    : true;
                  const isSelected = setup.accessoryIds?.includes(accessory.id);

                  return (
                    <div
                      key={accessory.id}
                      onClick={() => {
                        if (!isCompatible) return;
                        const newIds = isSelected
                          ? setup.accessoryIds?.filter(
                              (id) => id !== accessory.id,
                            ) || []
                          : [...(setup.accessoryIds || []), accessory.id];
                        setSetup({ ...setup, accessoryIds: newIds });
                      }}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-lg border-2 p-2",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-slate-200",
                        !isCompatible && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <PhotoPlaceholder className="h-10 w-10 rounded" />
                        <div>
                          <p className="font-medium">{accessory.name}</p>
                          <p className="text-xs text-slate-500">
                            {accessory.compatibleMounts.join(", ")}
                          </p>
                        </div>
                      </div>
                      {isSelected && <span className="text-primary">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <Button
          variant="outline"
          onClick={() => setShowAccessoryForm(true)}
          className="w-full"
        >
          + Create New Accessory
        </Button>

        <Modal
          isOpen={showAccessoryForm}
          onClose={() => setShowAccessoryForm(false)}
          title="Add New Accessory"
        >
          <AccessoryForm
            onSave={(a) => {
              onAddAccessory(a);
              setSetup({
                ...setup,
                accessoryIds: [...(setup.accessoryIds || []), a.id],
              });
              setShowAccessoryForm(false);
            }}
            onCancel={() => setShowAccessoryForm(false)}
          />
        </Modal>
      </div>
    );
  };

  // Step 6: Review & Name
  const renderReviewStep = () => {
    const scores =
      selectedBody && selectedLens
        ? calculateSuitabilityScores(
            setup as CameraSetup,
            bodies,
            lenses,
            storage,
            accessories,
          )
        : null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Step 6: Review & Name</h3>

        <div>
          <Label htmlFor="setup-name">Setup Name</Label>
          <Input
            id="setup-name"
            value={setup.name}
            onChange={(e) => setSetup({ ...setup, name: e.target.value })}
            placeholder="e.g., Wedding Video Rig"
            className="mt-1"
          />
        </div>

        {scores && (
          <div className="rounded-lg bg-slate-50 p-3">
            <h4 className="mb-2 font-medium">Suitability Scores</h4>
            <div className="space-y-2">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>📸 Photo</span>
                  <span>{scores.photo}%</span>
                </div>
                <Progress value={scores.photo} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>🎥 Video</span>
                  <span>{scores.video}%</span>
                </div>
                <Progress value={scores.video} className="h-2" />
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg border p-3">
          <h4 className="mb-2 font-medium">Configuration Summary</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <strong>Body:</strong> {selectedBody?.name || "Not selected"}
            </li>
            <li>
              <strong>Lens:</strong> {selectedLens?.name || "Not selected"}
            </li>
            <li>
              <strong>Storage:</strong>{" "}
              {setup.storageIds?.length
                ? setup.storageIds
                    .map((id) => storage.find((s) => s.id === id)?.type)
                    .join(", ")
                : "None"}
            </li>
            <li>
              <strong>Batteries:</strong>{" "}
              {setup.batteryIds?.length ? setup.batteryIds.length : "None"}
            </li>
            <li>
              <strong>Accessories:</strong>{" "}
              {setup.accessoryIds?.length ? setup.accessoryIds.length : "None"}
            </li>
          </ul>
        </div>

        {validation.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc pl-4">
                {validation.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validation.warnings.length > 0 && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-yellow-800">
              <ul className="list-disc pl-4">
                {validation.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validation.isValid && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              ✅ All validations passed! Ready to save.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const steps = [
    renderBodyStep,
    renderLensStep,
    renderStorageStep,
    renderBatteryStep,
    renderAccessoryStep,
    renderReviewStep,
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={editingSetup ? "Edit Equipment Setup" : "Add New Equipment Setup"}
    >
      <div className="max-h-[70vh] overflow-y-auto">
        {renderStepIndicator()}
        {steps[step - 1]()}

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          {step < 6 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !setup.bodyId) || (step === 2 && !setup.lensId)
              }
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!validation.isValid || !setup.name}
            >
              Save Setup
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// FORM COMPONENTS
// ============================================

const BodyForm: React.FC<{
  onSave: (body: CameraBody) => void;
  onCancel: () => void;
  initialData?: CameraBody;
}> = ({ onSave, onCancel, initialData }) => {
  const [body, setBody] = useState<Partial<CameraBody>>(
    initialData || {
      name: "",
      sensorType: "full-frame",
      mountType: "e-mount",
      usage: "hybrid",
      supportedStorage: ["sd"],
      batteryType: "",
      notes: "",
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(body as CameraBody),
      id: initialData?.id || `body-${Date.now()}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="body-name">Name</Label>
        <Input
          id="body-name"
          value={body.name}
          onChange={(e) => setBody({ ...body, name: e.target.value })}
          placeholder="e.g., Sony A7 IV"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Sensor Type</Label>
          <Select
            value={body.sensorType}
            onValueChange={(v) =>
              setBody({ ...body, sensorType: v as SensorType })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-frame">Full Frame</SelectItem>
              <SelectItem value="aps-c">APS-C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Mount Type</Label>
          <Select
            value={body.mountType}
            onValueChange={(v) =>
              setBody({ ...body, mountType: v as MountType })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="e-mount">E-Mount</SelectItem>
              <SelectItem value="f-mount">F-Mount</SelectItem>
              <SelectItem value="rf">RF</SelectItem>
              <SelectItem value="l-mount">L-Mount</SelectItem>
              <SelectItem value="x-mount">X-Mount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Usage</Label>
          <Select
            value={body.usage}
            onValueChange={(v) => setBody({ ...body, usage: v as UsageType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="photo">Photo</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Battery Type</Label>
          <Input
            value={body.batteryType}
            onChange={(e) => setBody({ ...body, batteryType: e.target.value })}
            placeholder="e.g., NP-FZ100"
          />
        </div>
      </div>

      <div>
        <Label>Supported Storage</Label>
        <div className="mt-2 flex gap-2">
          {(["ssd", "cfexpress", "sd"] as StorageType[]).map((type) => (
            <label key={type} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={body.supportedStorage?.includes(type)}
                onChange={(e) => {
                  const current = body.supportedStorage || [];
                  const updated = e.target.checked
                    ? [...current, type]
                    : current.filter((t) => t !== type);
                  setBody({ ...body, supportedStorage: updated });
                }}
              />
              <span className="text-sm capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="body-notes">Notes</Label>
        <Textarea
          id="body-notes"
          value={body.notes}
          onChange={(e) => setBody({ ...body, notes: e.target.value })}
          placeholder="Additional notes about this camera..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Body</Button>
      </div>
    </form>
  );
};

const LensForm: React.FC<{
  onSave: (lens: Lens) => void;
  onCancel: () => void;
  initialData?: Lens;
  mountType?: MountType;
}> = ({ onSave, onCancel, initialData, mountType }) => {
  const [lens, setLens] = useState<Partial<Lens>>(
    initialData || {
      name: "",
      mountType: mountType || "e-mount",
      imageCircle: "full-frame",
      usage: "hybrid",
      notesPhoto: "",
      notesVideo: "",
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(lens as Lens),
      id: initialData?.id || `lens-${Date.now()}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="lens-name">Name</Label>
        <Input
          id="lens-name"
          value={lens.name}
          onChange={(e) => setLens({ ...lens, name: e.target.value })}
          placeholder="e.g., Sony FE 24-70mm f/2.8"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Mount Type</Label>
          <Select
            value={lens.mountType}
            onValueChange={(v) =>
              setLens({ ...lens, mountType: v as MountType })
            }
            disabled={!!mountType}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="e-mount">E-Mount</SelectItem>
              <SelectItem value="f-mount">F-Mount</SelectItem>
              <SelectItem value="rf">RF</SelectItem>
              <SelectItem value="l-mount">L-Mount</SelectItem>
              <SelectItem value="x-mount">X-Mount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Image Circle</Label>
          <Select
            value={lens.imageCircle}
            onValueChange={(v) =>
              setLens({ ...lens, imageCircle: v as SensorType })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-frame">Full Frame</SelectItem>
              <SelectItem value="aps-c">APS-C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Usage</Label>
        <Select
          value={lens.usage}
          onValueChange={(v) => setLens({ ...lens, usage: v as UsageType })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="photo">Photo</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="lens-photo-notes">Photo Notes</Label>
        <Textarea
          id="lens-photo-notes"
          value={lens.notesPhoto}
          onChange={(e) => setLens({ ...lens, notesPhoto: e.target.value })}
          placeholder="Notes for photography use..."
        />
      </div>

      <div>
        <Label htmlFor="lens-video-notes">Video Notes</Label>
        <Textarea
          id="lens-video-notes"
          value={lens.notesVideo}
          onChange={(e) => setLens({ ...lens, notesVideo: e.target.value })}
          placeholder="Notes for video use..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Lens</Button>
      </div>
    </form>
  );
};

const StorageForm: React.FC<{
  onSave: (storage: Storage) => void;
  onCancel: () => void;
  initialData?: Storage;
}> = ({ onSave, onCancel, initialData }) => {
  const [storage, setStorage] = useState<Partial<Storage>>(
    initialData || {
      type: "sd",
      capacity: "",
      speedRating: "",
      supportedFormats: [],
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(storage as Storage),
      id: initialData?.id || `storage-${Date.now()}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Select
            value={storage.type}
            onValueChange={(v) =>
              setStorage({ ...storage, type: v as StorageType })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ssd">SSD</SelectItem>
              <SelectItem value="cfexpress">CFexpress</SelectItem>
              <SelectItem value="sd">SD Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Capacity</Label>
          <Input
            value={storage.capacity}
            onChange={(e) =>
              setStorage({ ...storage, capacity: e.target.value })
            }
            placeholder="e.g., 256GB"
          />
        </div>
      </div>

      <div>
        <Label>Speed Rating</Label>
        <Input
          value={storage.speedRating}
          onChange={(e) =>
            setStorage({ ...storage, speedRating: e.target.value })
          }
          placeholder="e.g., V90 - 280MB/s"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Storage</Button>
      </div>
    </form>
  );
};

const BatteryForm: React.FC<{
  onSave: (battery: Battery) => void;
  onCancel: () => void;
  initialData?: Battery;
  compatibleBodyId?: string;
}> = ({ onSave, onCancel, initialData, compatibleBodyId }) => {
  const [battery, setBattery] = useState<Partial<Battery>>(
    initialData || {
      model: "",
      capacity: "",
      compatibleBodies: compatibleBodyId ? [compatibleBodyId] : [],
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(battery as Battery),
      id: initialData?.id || `battery-${Date.now()}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Model</Label>
        <Input
          value={battery.model}
          onChange={(e) => setBattery({ ...battery, model: e.target.value })}
          placeholder="e.g., NP-FZ100"
          required
        />
      </div>

      <div>
        <Label>Capacity</Label>
        <Input
          value={battery.capacity}
          onChange={(e) => setBattery({ ...battery, capacity: e.target.value })}
          placeholder="e.g., 2280mAh"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Battery</Button>
      </div>
    </form>
  );
};

const AccessoryForm: React.FC<{
  onSave: (accessory: Accessory) => void;
  onCancel: () => void;
  initialData?: Accessory;
}> = ({ onSave, onCancel, initialData }) => {
  const [accessory, setAccessory] = useState<Partial<Accessory>>(
    initialData || {
      name: "",
      type: "cage",
      compatibleMounts: [],
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(accessory as Accessory),
      id: initialData?.id || `acc-${Date.now()}`,
    });
  };

  const mountOptions: MountType[] = [
    "e-mount",
    "f-mount",
    "rf",
    "l-mount",
    "x-mount",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={accessory.name}
          onChange={(e) => setAccessory({ ...accessory, name: e.target.value })}
          placeholder="e.g., SmallRig Full Cage"
          required
        />
      </div>

      <div>
        <Label>Type</Label>
        <Select
          value={accessory.type}
          onValueChange={(v) =>
            setAccessory({ ...accessory, type: v as AccessoryType })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cage">Cage</SelectItem>
            <SelectItem value="monitor">Monitor</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="mounting">Mounting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Compatible Mounts</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {mountOptions.map((mount) => (
            <label key={mount} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={accessory.compatibleMounts?.includes(mount)}
                onChange={(e) => {
                  const current = accessory.compatibleMounts || [];
                  const updated = e.target.checked
                    ? [...current, mount]
                    : current.filter((m) => m !== mount);
                  setAccessory({ ...accessory, compatibleMounts: updated });
                }}
              />
              <span className="text-sm">{mount}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Accessory</Button>
      </div>
    </form>
  );
};

// ============================================
// DETAILED EQUIPMENT VIEW MODAL
// ============================================

interface EquipmentDetailModalProps {
  setup: CameraSetup | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (setup: CameraSetup) => void;
  onDelete: (setupId: string) => void;
  onDuplicate: (setup: CameraSetup) => void;
  bodies: CameraBody[];
  lenses: Lens[];
  storage: Storage[];
  batteries: Battery[];
  accessories: Accessory[];
}

const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  setup,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  bodies,
  lenses,
  storage,
  batteries,
  accessories,
}) => {
  if (!setup) return null;

  const body = bodies.find((b) => b.id === setup.bodyId);
  const lens = lenses.find((l) => l.id === setup.lensId);
  const setupStorage = storage.filter((s) => setup.storageIds.includes(s.id));
  const setupBatteries = batteries.filter((b) =>
    setup.batteryIds.includes(b.id),
  );
  const setupAccessories = accessories.filter((a) =>
    setup.accessoryIds.includes(a.id),
  );

  const validation = validateSetup(
    setup,
    bodies,
    lenses,
    storage,
    batteries,
    accessories,
  );
  const scores = calculateSuitabilityScores(
    setup,
    bodies,
    lenses,
    storage,
    accessories,
  );

  const mountMatch = body && lens ? body.mountType === lens.mountType : false;
  const sensorCompatible =
    body && lens
      ? body.sensorType === lens.imageCircle ||
        (body.sensorType === "full-frame" && lens.imageCircle === "aps-c")
      : false;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={setup.name}>
      <div className="max-h-[75vh] overflow-y-auto">
        {/* Header Actions */}
        <div className="mb-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(setup)}>
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onDuplicate({
                ...setup,
                id: `setup-${Date.now()}`,
                name: `${setup.name} (Copy)`,
              })
            }
          >
            Duplicate
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onDelete(setup.id);
              onClose();
            }}
          >
            Delete
          </Button>
        </div>

        {/* Scores */}
        <div className="mb-4 rounded-lg bg-slate-50 p-3">
          <h4 className="mb-2 font-medium">Suitability Scores</h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-sm text-slate-600">📸 Photo</p>
              <Progress value={scores.photo} className="h-2" />
              <p className="text-right text-sm font-medium">{scores.photo}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">🎥 Video</p>
              <Progress value={scores.video} className="h-2" />
              <p className="text-right text-sm font-medium">{scores.video}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Overall</p>
              <Progress value={scores.overall} className="h-2" />
              <p className="text-right text-sm font-medium">
                {scores.overall}%
              </p>
            </div>
          </div>
        </div>

        {/* Camera Body Section */}
        {body && (
          <div className="mb-4 rounded-lg border p-3">
            <h4 className="mb-2 font-semibold">📷 Camera Body</h4>
            <div className="flex gap-3">
              <PhotoPlaceholder className="h-24 w-24 rounded" />
              <div>
                <p className="font-medium">{body.name}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="outline">{body.sensorType}</Badge>
                  <Badge variant="outline">{body.mountType}</Badge>
                  <Badge variant="outline">{body.usage}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{body.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Lens Section */}
        {lens && (
          <div className="mb-4 rounded-lg border p-3">
            <h4 className="mb-2 font-semibold">🔍 Lens</h4>
            <div className="flex gap-3">
              <PhotoPlaceholder className="h-24 w-24 rounded" />
              <div>
                <p className="font-medium">{lens.name}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="outline">{lens.mountType}</Badge>
                  <Badge variant="outline">{lens.imageCircle}</Badge>
                  <Badge variant="outline">{lens.usage}</Badge>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <strong>Photo:</strong> {lens.notesPhoto}
                  </p>
                  <p>
                    <strong>Video:</strong> {lens.notesVideo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Storage Section */}
        {setupStorage.length > 0 && (
          <div className="mb-4 rounded-lg border p-3">
            <h4 className="mb-2 font-semibold">💾 Storage</h4>
            <div className="space-y-2">
              {setupStorage.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium">
                    {s.type.toUpperCase()} - {s.capacity}
                  </span>
                  <span className="text-slate-500">{s.speedRating}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Batteries Section */}
        {setupBatteries.length > 0 && (
          <div className="mb-4 rounded-lg border p-3">
            <h4 className="mb-2 font-semibold">🔋 Power</h4>
            <div className="space-y-2">
              {setupBatteries.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium">{b.model}</span>
                  <span className="text-slate-500">{b.capacity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accessories Section */}
        {setupAccessories.length > 0 && (
          <div className="mb-4 rounded-lg border p-3">
            <h4 className="mb-2 font-semibold">🛠️ Accessories</h4>
            <div className="space-y-2">
              {["cage", "monitor", "audio", "mounting"].map((type) => {
                const typeAccessories = setupAccessories.filter(
                  (a) => a.type === type,
                );
                if (typeAccessories.length === 0) return null;

                return (
                  <div key={type}>
                    <p className="text-sm font-medium capitalize text-slate-600">
                      {type}
                    </p>
                    <div className="ml-2 space-y-1">
                      {typeAccessories.map((a) => (
                        <p key={a.id} className="text-sm">
                          {a.name}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Compatibility Summary */}
        <div className="mb-4 rounded-lg border p-3">
          <h4 className="mb-2 font-semibold">Compatibility Check</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              {mountMatch ? "✅" : "❌"} Mount Match
            </li>
            <li className="flex items-center gap-2">
              {sensorCompatible ? "✅" : "⚠️"} Sensor Compatibility
            </li>
            <li className="flex items-center gap-2">
              {setup.storageIds.length > 0 ? "✅" : "⚠️"} Storage Present
            </li>
            <li className="flex items-center gap-2">
              {setup.batteryIds.length > 0 ? "✅" : "⚠️"} Batteries Present
            </li>
          </ul>
        </div>

        {/* Warnings */}
        {(validation.errors.length > 0 || validation.warnings.length > 0) && (
          <div className="space-y-2">
            {validation.errors.map((error, idx) => (
              <Alert key={idx} variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
            {validation.warnings.map((warning, idx) => (
              <Alert key={idx} className="bg-yellow-50 border-yellow-200">
                <AlertDescription className="text-yellow-800">
                  ⚠️ {warning}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

// ============================================
// PARTS MANAGEMENT COMPONENT
// ============================================

interface PartsManagementProps {
  bodies: CameraBody[];
  lenses: Lens[];
  storage: Storage[];
  batteries: Battery[];
  accessories: Accessory[];
  onUpdateBody: (body: CameraBody) => void;
  onDeleteBody: (id: string) => void;
  onUpdateLens: (lens: Lens) => void;
  onDeleteLens: (id: string) => void;
  onUpdateStorage: (s: Storage) => void;
  onDeleteStorage: (id: string) => void;
  onUpdateBattery: (b: Battery) => void;
  onDeleteBattery: (id: string) => void;
  onUpdateAccessory: (a: Accessory) => void;
  onDeleteAccessory: (id: string) => void;
  onAddBody: (body: CameraBody) => void;
  onAddLens: (lens: Lens) => void;
  onAddStorage: (s: Storage) => void;
  onAddBattery: (b: Battery) => void;
  onAddAccessory: (a: Accessory) => void;
}

const PartsManagement: React.FC<PartsManagementProps> = (props) => {
  const [activeTab, setActiveTab] = useState("bodies");
  const [editingBody, setEditingBody] = useState<CameraBody | null>(null);
  const [editingLens, setEditingLens] = useState<Lens | null>(null);
  const [editingStorage, setEditingStorage] = useState<Storage | null>(null);
  const [editingBattery, setEditingBattery] = useState<Battery | null>(null);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(
    null,
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGadgetsModal, setShowGadgetsModal] = useState(false);

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bodies">Bodies</TabsTrigger>
          <TabsTrigger value="lenses">Lenses</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="batteries">Batteries</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
        </TabsList>

        <div className="flex justify-end mt-4 mb-2">
          <Button onClick={() => setShowGadgetsModal(true)}>
            + Gadgets & Stuff
          </Button>
        </div>

        <TabsContent value="bodies" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowAddForm(true);
                setEditingBody(null);
              }}
            >
              + Add Body
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sensor</TableHead>
                <TableHead>Mount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.bodies.map((body) => (
                <TableRow key={body.id}>
                  <TableCell className="font-medium">{body.name}</TableCell>
                  <TableCell>{body.sensorType}</TableCell>
                  <TableCell>{body.mountType}</TableCell>
                  <TableCell>{body.usage}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingBody(body);
                          setShowAddForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => props.onDeleteBody(body.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="lenses" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowAddForm(true);
                setEditingLens(null);
              }}
            >
              + Add Lens
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mount</TableHead>
                <TableHead>Image Circle</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.lenses.map((lens) => (
                <TableRow key={lens.id}>
                  <TableCell className="font-medium">{lens.name}</TableCell>
                  <TableCell>{lens.mountType}</TableCell>
                  <TableCell>{lens.imageCircle}</TableCell>
                  <TableCell>{lens.usage}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingLens(lens);
                          setShowAddForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => props.onDeleteLens(lens.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowAddForm(true);
                setEditingStorage(null);
              }}
            >
              + Add Storage
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Speed Rating</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.storage.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium uppercase">
                    {s.type}
                  </TableCell>
                  <TableCell>{s.capacity}</TableCell>
                  <TableCell>{s.speedRating}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingStorage(s);
                          setShowAddForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => props.onDeleteStorage(s.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="batteries" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowAddForm(true);
                setEditingBattery(null);
              }}
            >
              + Add Battery
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.batteries.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.model}</TableCell>
                  <TableCell>{b.capacity}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingBattery(b);
                          setShowAddForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => props.onDeleteBattery(b.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="accessories" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowAddForm(true);
                setEditingAccessory(null);
              }}
            >
              + Add Accessory
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Compatible Mounts</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.accessories.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="capitalize">{a.type}</TableCell>
                  <TableCell>{a.compatibleMounts.join(", ")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingAccessory(a);
                          setShowAddForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => props.onDeleteAccessory(a.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={showGadgetsModal}
        onClose={() => setShowGadgetsModal(false)}
        title="Gadgets & Stuff"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <EquipmentStorage />
        </div>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingBody(null);
          setEditingLens(null);
          setEditingStorage(null);
          setEditingBattery(null);
          setEditingAccessory(null);
        }}
        title={
          editingBody ||
          editingLens ||
          editingStorage ||
          editingBattery ||
          editingAccessory
            ? "Edit Part"
            : "Add New Part"
        }
      >
        {activeTab === "bodies" && (
          <BodyForm
            initialData={editingBody || undefined}
            onSave={(body) => {
              if (editingBody) {
                props.onUpdateBody(body);
              } else {
                props.onAddBody(body);
              }
              setShowAddForm(false);
              setEditingBody(null);
            }}
            onCancel={() => {
              setShowAddForm(false);
              setEditingBody(null);
            }}
          />
        )}
        {activeTab === "lenses" && (
          <LensForm
            initialData={editingLens || undefined}
            onSave={(lens) => {
              if (editingLens) {
                props.onUpdateLens(lens);
              } else {
                props.onAddLens(lens);
              }
              setShowAddForm(false);
              setEditingLens(null);
            }}
            onCancel={() => {
              setShowAddForm(false);
              setEditingLens(null);
            }}
          />
        )}
        {activeTab === "storage" && (
          <StorageForm
            initialData={editingStorage || undefined}
            onSave={(s) => {
              if (editingStorage) {
                props.onUpdateStorage(s);
              } else {
                props.onAddStorage(s);
              }
              setShowAddForm(false);
              setEditingStorage(null);
            }}
            onCancel={() => {
              setShowAddForm(false);
              setEditingStorage(null);
            }}
          />
        )}
        {activeTab === "batteries" && (
          <BatteryForm
            initialData={editingBattery || undefined}
            onSave={(b) => {
              if (editingBattery) {
                props.onUpdateBattery(b);
              } else {
                props.onAddBattery(b);
              }
              setShowAddForm(false);
              setEditingBattery(null);
            }}
            onCancel={() => {
              setShowAddForm(false);
              setEditingBattery(null);
            }}
          />
        )}
        {activeTab === "accessories" && (
          <AccessoryForm
            initialData={editingAccessory || undefined}
            onSave={(a) => {
              if (editingAccessory) {
                props.onUpdateAccessory(a);
              } else {
                props.onAddAccessory(a);
              }
              setShowAddForm(false);
              setEditingAccessory(null);
            }}
            onCancel={() => {
              setShowAddForm(false);
              setEditingAccessory(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

// ============================================
// MAIN STORAGE COMPONENT
// ============================================

export default function Storage() {
  const [bodies, setBodies] = useState<CameraBody[]>(sampleBodies);
  const [lenses, setLenses] = useState<Lens[]>(sampleLenses);
  const [storageItems, setStorageItems] = useState<Storage[]>(sampleStorage);
  const [batteries, setBatteries] = useState<Battery[]>(sampleBatteries);
  const [accessories, setAccessories] =
    useState<Accessory[]>(sampleAccessories);
  const [setups, setSetups] = useState<CameraSetup[]>(sampleSetups);

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedSetup, setSelectedSetup] = useState<CameraSetup | null>(null);
  const [editingSetup, setEditingSetup] = useState<CameraSetup | null>(null);
  const [showPartsManagement, setShowPartsManagement] = useState(false);

  const handleSaveSetup = (setup: CameraSetup) => {
    if (editingSetup) {
      setSetups(setups.map((s) => (s.id === setup.id ? setup : s)));
      setEditingSetup(null);
    } else {
      setSetups([...setups, setup]);
    }
    setIsBuilderOpen(false);
  };

  const handleDeleteSetup = (id: string) => {
    setSetups(setups.filter((s) => s.id !== id));
  };

  const handleDuplicateSetup = (setup: CameraSetup) => {
    setSetups([...setups, setup]);
  };

  const handleEditSetup = (setup: CameraSetup) => {
    setEditingSetup(setup);
    setIsBuilderOpen(true);
    setSelectedSetup(null);
  };

  // Parts management handlers
  const handleAddBody = (body: CameraBody) => setBodies([...bodies, body]);
  const handleUpdateBody = (body: CameraBody) =>
    setBodies(bodies.map((b) => (b.id === body.id ? body : b)));
  const handleDeleteBody = (id: string) =>
    setBodies(bodies.filter((b) => b.id !== id));

  const handleAddLens = (lens: Lens) => setLenses([...lenses, lens]);
  const handleUpdateLens = (lens: Lens) =>
    setLenses(lenses.map((l) => (l.id === lens.id ? lens : l)));
  const handleDeleteLens = (id: string) =>
    setLenses(lenses.filter((l) => l.id !== id));

  const handleAddStorage = (s: Storage) =>
    setStorageItems([...storageItems, s]);
  const handleUpdateStorage = (s: Storage) =>
    setStorageItems(storageItems.map((st) => (st.id === s.id ? s : st)));
  const handleDeleteStorage = (id: string) =>
    setStorageItems(storageItems.filter((s) => s.id !== id));

  const handleAddBattery = (b: Battery) => setBatteries([...batteries, b]);
  const handleUpdateBattery = (b: Battery) =>
    setBatteries(batteries.map((bat) => (bat.id === b.id ? b : bat)));
  const handleDeleteBattery = (id: string) =>
    setBatteries(batteries.filter((b) => b.id !== id));

  const handleAddAccessory = (a: Accessory) =>
    setAccessories([...accessories, a]);
  const handleUpdateAccessory = (a: Accessory) =>
    setAccessories(accessories.map((acc) => (acc.id === a.id ? a : acc)));
  const handleDeleteAccessory = (id: string) =>
    setAccessories(accessories.filter((a) => a.id !== id));

  return (
    <div className=" mx-auto p-5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Equipment Storage</h1>
          <p className="text-slate-600">Manage your camera equipment setups</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPartsManagement(true)}
          >
            Manage Parts
          </Button>
          <Button
            onClick={() => {
              setEditingSetup(null);
              setIsBuilderOpen(true);
            }}
          >
            + Add Equipment
          </Button>
        </div>
      </div>
      {setups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-12">
          <PhotoPlaceholder className="mb-4 h-16 w-16 rounded-full" />
          <h3 className="text-lg font-medium text-slate-600">
            No equipment setups yet
          </h3>
          <p className="mb-4 text-slate-400">
            Create your first camera setup to get started
          </p>
          <Button
            onClick={() => {
              setEditingSetup(null);
              setIsBuilderOpen(true);
            }}
          >
            Create Setup
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {setups.map((setup) => {
            const body = bodies.find((b) => b.id === setup.bodyId);
            const lens = lenses.find((l) => l.id === setup.lensId);
            const validation = validateSetup(
              setup,
              bodies,
              lenses,
              storageItems,
              batteries,
              accessories,
            );
            const scores = calculateSuitabilityScores(
              setup,
              bodies,
              lenses,
              storageItems,
              accessories,
            );

            const mountMatch =
              body && lens ? body.mountType === lens.mountType : false;
            const sensorCompatible =
              body && lens
                ? body.sensorType === lens.imageCircle ||
                  (body.sensorType === "full-frame" &&
                    lens.imageCircle === "aps-c")
                : false;

            return (
              <Card
                key={setup.id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => setSelectedSetup(setup)}
              >
                <CardHeader className="p-4">
                  <PhotoPlaceholder className="mb-3 h-40 w-full rounded-lg" />
                  <CardTitle className="text-lg">{setup.name}</CardTitle>
                  <CardDescription>
                    {body?.name} + {lens?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-4 pb-4">
                  <div className="flex flex-wrap gap-1">
                    <CompatibilityBadge status={mountMatch ? "valid" : "error"}>
                      Mount
                    </CompatibilityBadge>
                    <CompatibilityBadge
                      status={sensorCompatible ? "valid" : "warning"}
                    >
                      {body?.sensorType === "full-frame"
                        ? "Full-Frame"
                        : "APS-C"}
                    </CompatibilityBadge>
                    {body?.usage === "photo" && (
                      <Badge variant="outline">📸 Photo</Badge>
                    )}
                    {body?.usage === "video" && (
                      <Badge variant="outline">🎥 Video</Badge>
                    )}
                    {body?.usage === "hybrid" && (
                      <>
                        <Badge variant="outline">📸</Badge>
                        <Badge variant="outline">🎥</Badge>
                      </>
                    )}
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-600">Setup Completeness</span>
                      <span className="font-medium">{scores.overall}%</span>
                    </div>
                    <Progress value={scores.overall} className="h-2" />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>💾 {setup.storageIds.length}</span>
                    <span>🔋 {setup.batteryIds.length}</span>
                    <span>🛠️ {setup.accessoryIds.length}</span>
                  </div>
                  {validation.errors.length > 0 && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-xs">
                        {validation.errors.length} error(s)
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <EquipmentBuilder
        isOpen={isBuilderOpen}
        onClose={() => {
          setIsBuilderOpen(false);
          setEditingSetup(null);
        }}
        onSave={handleSaveSetup}
        bodies={bodies}
        lenses={lenses}
        storage={storageItems}
        batteries={batteries}
        accessories={accessories}
        onAddBody={handleAddBody}
        onAddLens={handleAddLens}
        onAddStorage={handleAddStorage}
        onAddBattery={handleAddBattery}
        onAddAccessory={handleAddAccessory}
        editingSetup={editingSetup}
      />
      <EquipmentDetailModal
        setup={selectedSetup}
        isOpen={!!selectedSetup}
        onClose={() => setSelectedSetup(null)}
        onEdit={handleEditSetup}
        onDelete={handleDeleteSetup}
        onDuplicate={handleDuplicateSetup}
        bodies={bodies}
        lenses={lenses}
        storage={storageItems}
        batteries={batteries}
        accessories={accessories}
      />
      <Modal
        isOpen={showPartsManagement}
        onClose={() => setShowPartsManagement(false)}
        title="Parts Management"
      >
        <PartsManagement
          bodies={bodies}
          lenses={lenses}
          storage={storageItems}
          batteries={batteries}
          accessories={accessories}
          onAddBody={handleAddBody}
          onUpdateBody={handleUpdateBody}
          onDeleteBody={handleDeleteBody}
          onAddLens={handleAddLens}
          onUpdateLens={handleUpdateLens}
          onDeleteLens={handleDeleteLens}
          onAddStorage={handleAddStorage}
          onUpdateStorage={handleUpdateStorage}
          onDeleteStorage={handleDeleteStorage}
          onAddBattery={handleAddBattery}
          onUpdateBattery={handleUpdateBattery}
          onDeleteBattery={handleDeleteBattery}
          onAddAccessory={handleAddAccessory}
          onUpdateAccessory={handleUpdateAccessory}
          onDeleteAccessory={handleDeleteAccessory}
        />
      </Modal>
      <div className="pt-10">
        <EquipmentStorage />
      </div>
    </div>
  );
}
