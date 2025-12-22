import { useState } from "react";
import {
  Search,
  Play,
  Pause,
  Download,
  FileText,
  FileAudio,
  RefreshCw,
  Copy,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const recordings = [
  {
    id: "RE001",
    callId: "CA001",
    date: "2024-01-16 10:30 AM",
    duration: "3:45",
    channels: 2,
    status: "completed",
    hasTranscript: true,
    transcriptStatus: "ready",
  },
  {
    id: "RE002",
    callId: "CA002",
    date: "2024-01-16 10:15 AM",
    duration: "1:23",
    channels: 2,
    status: "completed",
    hasTranscript: false,
    transcriptStatus: null,
  },
  {
    id: "RE003",
    callId: "CA004",
    date: "2024-01-16 9:30 AM",
    duration: "0:45",
    channels: 1,
    status: "completed",
    hasTranscript: true,
    transcriptStatus: "ready",
  },
  {
    id: "RE004",
    callId: "CA006",
    date: "2024-01-15 4:00 PM",
    duration: "5:12",
    channels: 2,
    status: "processing",
    hasTranscript: false,
    transcriptStatus: "processing",
  },
];

const transcriptStatusConfig: Record<string, { color: string; label: string }> = {
  ready: { color: "bg-green-500/10 text-green-500", label: "Ready" },
  processing: { color: "bg-yellow-500/10 text-yellow-500", label: "Processing" },
  failed: { color: "bg-red-500/10 text-red-500", label: "Failed" },
};

export function CallsRecordings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [transcriptSheetOpen, setTranscriptSheetOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<typeof recordings[0] | null>(null);

  const filteredRecordings = recordings.filter((rec) =>
    rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.callId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openTranscript = (recording: typeof recordings[0]) => {
    setSelectedRecording(recording);
    setTranscriptSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Recordings & Transcripts</h1>
        <p className="text-muted-foreground">Manage call recordings and transcriptions</p>
      </div>

      {/* Search */}
      <Card className="rounded-3xl shadow-soft border-0 bg-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recordings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
            <Button variant="outline" className="gap-2 rounded-xl">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recordings Table */}
      <Card className="rounded-3xl shadow-soft border-0 bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recording ID</TableHead>
                <TableHead>Call ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transcript</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecordings.map((recording) => (
                <TableRow key={recording.id}>
                  <TableCell className="font-mono">{recording.id}</TableCell>
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto font-mono">
                      {recording.callId}
                    </Button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{recording.date}</TableCell>
                  <TableCell>{recording.duration}</TableCell>
                  <TableCell>{recording.channels}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={recording.status === "completed" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}
                    >
                      {recording.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {recording.transcriptStatus ? (
                      <Badge
                        variant="secondary"
                        className={transcriptStatusConfig[recording.transcriptStatus]?.color}
                      >
                        {transcriptStatusConfig[recording.transcriptStatus]?.label}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPlayingId(playingId === recording.id ? null : recording.id)}
                      >
                        {playingId === recording.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      {recording.hasTranscript ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openTranscript(recording)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transcript Sheet */}
      <Sheet open={transcriptSheetOpen} onOpenChange={setTranscriptSheetOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Transcript</SheetTitle>
            <SheetDescription>Recording: {selectedRecording?.id}</SheetDescription>
          </SheetHeader>
          {selectedRecording && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className={transcriptStatusConfig[selectedRecording.transcriptStatus || ""]?.color}
                >
                  {transcriptStatusConfig[selectedRecording.transcriptStatus || ""]?.label}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Retry
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPlayingId(playingId === selectedRecording.id ? null : selectedRecording.id)}
                    >
                      {playingId === selectedRecording.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="h-1 bg-muted rounded-full">
                        <div className="h-1 bg-primary rounded-full w-1/3" />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      1:15 / {selectedRecording.duration}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <ScrollArea className="h-[400px] border rounded-lg p-4">
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">[00:00]</p>
                    <p>Welcome to our company. Press 1 for sales, 2 for support, or stay on the line to speak with a representative.</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">[00:05]</p>
                    <p className="italic text-muted-foreground">*Caller pressed 1*</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">[00:07]</p>
                    <p>Please hold while we connect you to our sales team. Your call is important to us.</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">[00:15]</p>
                    <p><strong>Sales Agent:</strong> Hello, thank you for calling. How can I help you today?</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">[00:18]</p>
                    <p><strong>Caller:</strong> Hi, I'm interested in learning more about your enterprise pricing plans.</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">[00:25]</p>
                    <p><strong>Sales Agent:</strong> Absolutely! I'd be happy to help you with that. Can you tell me a bit about your company size and requirements?</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">[00:35]</p>
                    <p><strong>Caller:</strong> Sure, we're a mid-size company with about 200 employees. We're looking for a solution that can handle our customer service calls.</p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
