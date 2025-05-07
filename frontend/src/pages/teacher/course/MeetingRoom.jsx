// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { useSelector } from "react-redux";

// const MeetingRoom = () => {
//   const { zegoRoomId } = useParams();
//   const containerRef = useRef(null);
//   const [zp, setZp] = useState(null);

//   const { user } = useSelector((state) => state.auth);
//   const userName = user?.name || "Instructor";
//   const userID = user?._id || String(Math.floor(Math.random() * 10000));
//   const userRole = user?.role || "Participant";

//   useEffect(() => {
//     const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
//     const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

//     if (!appID || !serverSecret) {
//       console.error("Missing ZEGO appID or serverSecret in .env file");
//       return;
//     }

//     if (!containerRef.current) return;

//     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//       appID,
//       serverSecret,
//       zegoRoomId,
//       userID,
//       userName
//     );

//     const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
//     setZp(zegoInstance);

//     zegoInstance.joinRoom({
//       container: containerRef.current,
//       sharedLinks: [
//         {
//           name: "Copy Link",
//           url: window.location.href,
//         },
//       ],
//       scenario: {
//         mode: ZegoUIKitPrebuilt.GroupCall,
//       },
//       turnOnMicrophoneWhenJoining: false,
//       turnOnCameraWhenJoining: false,
//       showMyCameraToggleButton: true,
//       showMyMicrophoneToggleButton: true,
//       showScreenSharingButton: true,
//       showTextChat: true,
//       showUserList: true,
//       showTurnOffRemoteCameraButton: userRole === "instructor",
//       showTurnOffRemoteMicrophoneButton: userRole === "instructor",
//       showRemoveUserButton: userRole === "instructor",
//     });

//     return () => {
//       if (zegoInstance) {
//         zegoInstance.destroy();
//       }
//     };
//   }, [zegoRoomId, userID, userName, userRole]);

//   return (
//         <div className="absolute inset-0  -ml-[220px] lg:ml-0">
//         <div ref={containerRef} className="w-full h-full" />
//       </div>
//       );
//     };

// export default MeetingRoom;


import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";

const MeetingRoom = () => {
  const { zegoRoomId } = useParams();
  const containerRef = useRef(null);
  const [zp, setZp] = useState(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return; // Wait until user data is available

    const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

    if (!appID || !serverSecret) {
      console.error("Missing ZEGO appID or serverSecret in .env file");
      return;
    }

    if (!containerRef.current) return;

    const userName = user.name || "Instructor";
    const userID = user._id || String(Math.floor(Math.random() * 10000));
    const userRole = user.role || "Participant";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      zegoRoomId,
      userID,
      userName
    );

    const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
    setZp(zegoInstance);

    zegoInstance.joinRoom({
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
      showTurnOffRemoteCameraButton: userRole === "instructor",
      showTurnOffRemoteMicrophoneButton: userRole === "instructor",
      showRemoveUserButton: userRole === "instructor",
    });

    return () => {
      if (zegoInstance) {
        zegoInstance.destroy();
      }
    };
  }, [zegoRoomId, user]);

  return (
    <div className="absolute inset-0  -ml-[220px] lg:ml-0">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default MeetingRoom;