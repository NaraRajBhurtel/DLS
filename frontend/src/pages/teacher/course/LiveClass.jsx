import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useCreateMeetingMutation,
  useGetMeetingByCourseQuery,
  useDeleteMeetingMutation,
} from "/features/api/liveMeetingApi";
import { toast } from "sonner";

const LiveClass = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [scheduledDate, setScheduledDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localMeetings, setLocalMeetings] = useState([]);

  const [createMeeting, { isLoading: isCreating }] = useCreateMeetingMutation();
  const [deleteMeeting] = useDeleteMeetingMutation();

  const {
    data: meetingData,
    refetch,
  } = useGetMeetingByCourseQuery(courseId, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (meetingData) {
      setLocalMeetings(meetingData);
    }
  }, [meetingData]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleScheduleMeeting = async () => {
    try {
      await createMeeting({
        courseId,
        zegoRoomId: `room-${courseId}-${Date.now()}`,
        startTime: scheduledDate,
        meetingType: "scheduled",
      }).unwrap();

      toast.success(
        `Meeting scheduled for ${new Date(scheduledDate).toLocaleString()}`
      );
      setScheduledDate("");
      setIsDialogOpen(false);
      refetch();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to schedule the meeting.");
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await deleteMeeting(meetingId).unwrap();
      toast.success("Meeting deleted successfully!");

      setLocalMeetings((prev) =>
        prev.filter((meeting) => meeting._id !== meetingId)
      );
      refetch();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to delete the meeting.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Scheduled Live Classes</h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Schedule New</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule a New Meeting</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="meeting-time">Select Date and Time</Label>
                <Input
                  id="meeting-time"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button
                onClick={handleScheduleMeeting}
                disabled={!scheduledDate || isCreating}
              >
                {isCreating ? "Scheduling..." : "Schedule"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setScheduledDate("");
                  setIsDialogOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meeting Cards */}
      {localMeetings.length > 0 ? (
        <div className="space-y-4">
          {localMeetings.map((meeting, index) => (
            <Card key={meeting._id} className="shadow-md hover:shadow-lg transition">
              <CardContent className="py-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-medium">
                      Meeting #{index + 1}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      🧾 Room ID: <span className="font-mono">{meeting.zegoRoomId}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Starts: {new Date(meeting.startTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/teacher/course/meeting-room/${meeting.zegoRoomId}`)
                      }
                    >
                      Enter Room
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteMeeting(meeting._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No scheduled meetings yet.</p>
      )}
    </div>
  );
};

export default LiveClass;
 