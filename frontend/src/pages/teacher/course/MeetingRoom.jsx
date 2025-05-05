import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";

const MeetingRoom = () => {
  const { zegoRoomId } = useParams();
  const containerRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const userName = user?.name || "Instructor";
  const userID = user?._id || String(Math.floor(Math.random() * 10000));

  useEffect(() => {
    const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

    if (!appID || !serverSecret) {
      console.error("Missing ZEGO appID or serverSecret in .env file");
      return;
    }

    if (!containerRef.current) return;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      zegoRoomId,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: containerRef.current,
      sharedLinks: [
        {
          name: "Copy Link",
          url: window.location.href,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      turnOnMicrophoneWhenJoining: false,
      turnOnCameraWhenJoining: false,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
    });
  }, [zegoRoomId, userID, userName]);

  return (
    <div className="absolute inset-0  -ml-[220px] lg:ml-0">
    <div ref={containerRef} className="w-full h-full" />
  </div>
  );
};

export default MeetingRoom;
