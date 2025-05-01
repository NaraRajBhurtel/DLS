import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "../../../../features/api/courseApi";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const MEDIA_API = "http://localhost:9090/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [uploadMaterialInfo, setUploadMaterialInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);

  const params = useParams();
  const { courseId, lectureId } = params;

  const {data:lectureData} = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(()=>{
    if(lecture){
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
      setUploadMaterialInfo(lecture.materialInfo);
    }
  },[lecture])

  const [edtiLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();
    const [removeLecture,{data:removeData, isLoading:removeLoading, isSuccess:removeSuccess}] = useRemoveLectureMutation();



    const fileChangeHandler = async (e, type) => {
        const file = e.target.files[0];
      
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          setMediaProgress(true);
      
          try {
            const endpoint =
              type === "video"
                ? `${MEDIA_API}/upload-video`
                : `${MEDIA_API}/upload-file`; // Corrected endpoint for materials
      
            const res = await axios.post(endpoint, formData, {
              onUploadProgress: ({ loaded, total }) => {
                setUploadProgress(Math.round((loaded * 100) / total));
              },
            });
      
            if (res.data.success) {
              console.log(res);
              if (type === "video") {
                setUploadVideoInfo({
                  videoUrl: res.data.data.url,
                  publicId: res.data.data.public_id,
                });
              } else {
                setUploadMaterialInfo({
                  materialUrl: res.data.data.url,
                  publicId: res.data.data.public_id,
                });
              }
              setBtnDisable(false);
              toast.success(res.data.message);
            }
          } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Error uploading file");
          } finally {
            setMediaProgress(false);
          }
        }
      };

      const editLectureHandler = async () => {
        console.log({ lectureTitle, uploadVideoInfo, uploadMaterialInfo, isFree, courseId, lectureId });
    
        await edtiLecture({
          lectureTitle,
          videoInfo:uploadVideoInfo,
          materialInfo:uploadMaterialInfo,
          isPreviewFree:isFree,
          courseId,
          lectureId,
        });
      };
    
      const removeLectureHandler = async () => {
        await removeLecture(lectureId);
      }

      useEffect(() => {
        if (isSuccess) {
          toast.success(data.message);
        }
        if (error) {
          toast.error(error.data.message);
        }
      }, [isSuccess, error]);
    
      useEffect(()=>{
        if(removeSuccess){
          toast.success(removeData.message);
        }
      },[removeSuccess])
    
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>Edit Lecture Here</CardDescription>
        </div>
        <div className="flex items-center gap-2">
        <Button disbaled={removeLoading} variant="destructive" onClick={removeLectureHandler}>
            {
              removeLoading ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Please wait
              </> : "Remove Lecture"
            }
          </Button>
        </div>                                                                  
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>
        <div className="my-6">
          <Label>
            Video <span className="text-red-600">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) =>fileChangeHandler (e, "video")}
            placeholder="Lecture"
            className="w-fit"
          />
        </div>
        <div className="my-6">
          <Label>
            Materials<span className="text-red-600">*</span>
          </Label>
          <Input
            type="file"
            accept=".pdf,.pptx,.xls"
            onChange={(e) =>fileChangeHandler (e, "material")}
            placeholder="Lecture Materials"
            className="w-fit"
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch
            checked={isFree}
            onCheckedChange={setIsFree}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Is this lecture FREE?</Label>
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="mt-4 flex justify-start">
          <Button disabled={isLoading} onClick={editLectureHandler}>
              {
                isLoading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Please wait
                </> : "Update Lecture"
              }
            
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
